<?php

namespace App\Services\Billing;

use App\Models\Booking;
use App\Models\Invoice;
use App\Models\Payment;
use App\Enums\PaymentType;
use App\Enums\InvoiceStatus;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use Illuminate\Http\Request;
use App\Models\PaymentDetail;
use App\Helpers\PaymentHelper;
use App\Models\MembershipOrder;
use App\Helpers\UploadFileHelper;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Enums\MembershipOrderStatus;
use App\Services\Booking\BookingService;
use App\Services\Billing\PaymentGatewayService;

class PaymentService
{
    protected BookingService $bookingService;
    protected PaymentGatewayService $gatewayService;

    public function __construct(
        BookingService $bookingService,
        PaymentGatewayService $gatewayService
    ) {
        $this->bookingService = $bookingService;
        $this->gatewayService = $gatewayService;
    }

    public function createPayment(Invoice $invoice, array $paymentData): Payment
    {
        Log::info('[BILLING][PAYMENT_DATA_RECEIVED]', ['invoice_id' => $invoice->id, 'data' => $paymentData]);

        $methodInput = $paymentData['payment_method'] ?? 'cash';
        $paymentMethod = $methodInput instanceof PaymentMethod
            ? $methodInput
            : PaymentMethod::from($methodInput);

        $isManualByMerchant = $paymentData['is_merchant_input'] ?? false;

        if ($isManualByMerchant) {
            $initialStatus = PaymentStatus::PAID;
        } else {
            $initialStatus = ($paymentMethod === PaymentMethod::CASH)
                ? PaymentStatus::PAID
                : PaymentStatus::PENDING;
        }

        $proofPath = $this->handleProofUpload($invoice, $paymentData);

        return DB::transaction(function () use ($invoice, $paymentData, $initialStatus, $proofPath, $paymentMethod) {
            $payment = Payment::create([
                'invoice_id'       => $invoice->id,
                'payment_method'   => $paymentMethod,
                'payment_type'     => $paymentData['payment_type'] ?? PaymentType::FULL,
                'gateway_order_id' => $paymentData['gateway_order_id'] ?? null,
                'checkout_url'     => $paymentData['checkout_url'] ?? null,
                'amount'           => $paymentData['amount'] ?? 0,
                'payment_status'   => $initialStatus,
            ]);

            PaymentDetail::create([
                'payment_id' => $payment->id,
                'payment_provider' => $paymentData['payment_provider'] ?? null,
                'payment_channel' => $paymentData['payment_channel'] ?? null,
                'reference_no' => $paymentData['reference_no'] ?? null,
                'payer_name' => $paymentData['payer_name'] ?? null,
                'payment_date' => $paymentData['payment_date'] ?? now(),
                'proof_of_payment' => $proofPath,
                'raw_response' => $paymentData['raw_response'] ?? null,
            ]);

            Log::info('[BILLING][PAYMENT_CREATED]', ['payment_id' => $payment->id, 'status' => $initialStatus]);

            if ($initialStatus->isSuccess()) {
                $this->updateInvoiceStatus($invoice);
            }

            return $payment;
        });
    }

    public function createOnlineTransaction(Invoice $invoice, array $userData, ?string $gatewayName = null): array
    {
        $activeGateway = $gatewayName ?? $this->gatewayService->getDefaultGatewayName();

        Log::info('[BILLING][DEBUG_START]', [
            'input_gateway_name' => $gatewayName,
            'resolved_active_gateway' => $activeGateway,
            'invoice_no' => $invoice->invoice_no
        ]);

        $gatewayOrderId = PaymentHelper::generatePaymentNo('PAY');

        $gatewayResponse = $this->gatewayService->createTransaction(
            $invoice,
            $userData,
            $gatewayOrderId,
            $activeGateway
        );

        Log::info('[BILLING][GATEWAY_RESPONSE]', [
            'gateway_used' => $activeGateway,
            'has_redirect_url' => isset($gatewayResponse['redirect_url']),
            'has_token' => isset($gatewayResponse['snap_token']),
            'response_keys' => array_keys($gatewayResponse)
        ]);

        $checkoutUrl = $gatewayResponse['redirect_url'] ?? null;

        $payment = $this->createInitialGatewayPayment(
            $invoice,
            $gatewayOrderId,
            $checkoutUrl,
        );

        return [
            'token' => $gatewayResponse['snap_token'] ?? null,
            'redirect_url' => $checkoutUrl,
            'invoice_id' => $invoice->id,
            'payment_id' => $payment->id,
            'gateway' => $activeGateway
        ];
    }

    protected function createInitialGatewayPayment(Invoice $invoice, string $gatewayOrderId, ?string $checkoutUrl = null): Payment
    {
        return Payment::create([
            'invoice_id' => $invoice->id,
            'payment_method' => 'gateway',
            'payment_type' => 'full_payment',
            'gateway_order_id' => $gatewayOrderId,
            'checkout_url' => $checkoutUrl,
            'amount' => $invoice->total_amount,
            'payment_status' => 'pending',
        ]);
    }

    public function handleGatewayCallback(Request $request, string $gatewayName): Payment
    {
        $notification = $this->gatewayService->handleNotification($request, $gatewayName);
        $rawContent = $request->getContent();

        $orderId = $notification->order_id;
        $transactionStatus = $notification->transaction_status;
        $grossAmount = (float) $notification->gross_amount;

        $payment = Payment::with(['invoice.order'])
            ->where('gateway_order_id', $orderId)
            ->first();

        if (!$payment) {
            Log::warning('[BILLING][CALLBACK_SKIP]', [
                'order_id' => $orderId,
                'reason' => 'Payment record not found in database'
            ]);
            throw new \Exception("Payment with Gateway ID '{$orderId}' not found.");
        }

        $requiredAmount = (float) $payment->invoice->total_amount;
        if (round($grossAmount, 2) !== round($requiredAmount, 2)) {
            Log::error('[BILLING][AMOUNT_MISMATCH]', [
                'order_id' => $orderId,
                'midtrans_amount' => $grossAmount,
                'required_amount' => $requiredAmount
            ]);
            throw new \Exception("Amount mismatch for order '{$orderId}'.");
        }

        $newStatus = match (strtolower($transactionStatus)) {
            'capture', 'settlement', 'paid', 'settled' => PaymentStatus::PAID,
            'deny', 'expire', 'cancel', 'failed'      => PaymentStatus::FAILED,
            'pending'                                  => PaymentStatus::PENDING,
            default                                    => PaymentStatus::PENDING,
        };

        return DB::transaction(function () use ($payment, $newStatus, $notification, $rawContent, $gatewayName) {
            if ($payment->payment_status !== $newStatus) {
                $payment->update([
                    'payment_status' => $newStatus,
                ]);
            }

            PaymentDetail::updateOrCreate(
                ['payment_id' => $payment->id],
                [
                    'payment_provider' => $gatewayName,
                    'payment_channel'  => $notification->payment_type ?? $notification->payment_method ?? 'unknown',
                    'reference_no'     => $notification->transaction_id ?? $notification->payment_id ?? null,
                    'payment_date'     => now(),
                    'raw_response'     => $rawContent,
                ]
            );

            Log::info("[BILLING][GATEWAY_CALLBACK_UPDATE]", [
                'payment_id' => $payment->id,
                'new_status' => $newStatus->value,
                'payment_provider' => $gatewayName,
                'payment_channel'  => $notification->payment_type ?? $notification->payment_method ?? 'unknown',
                'reference_no'     => $notification->transaction_id ?? $notification->payment_id ?? null,
                'payment_date'     => now(),
                'raw_response'     => $rawContent,
            ]);

            if ($newStatus === PaymentStatus::PAID) {
                $this->updateInvoiceStatus($payment->invoice);
            } elseif ($newStatus === PaymentStatus::FAILED) {
                $order = $payment->invoice->order;

                if ($order instanceof Booking) {
                    $this->bookingService->handleExpiredBooking($order);
                } elseif ($order instanceof MembershipOrder) {
                    $order->update(['status' => MembershipOrderStatus::CANCELLED]);
                }

                Log::info("[BILLING][REVERSAL_TRIGGERED]", [
                    'type'           => $order instanceof Booking ? 'BOOKING' : 'MEMBERSHIP',
                    'order_no'       => $order->order_no ?? 'N/A',
                    'payment_status' => $newStatus->value,
                    'gateway_status' => $transactionStatus,
                    'description'    => "Order otomatis dibatalkan karena pembayaran gagal atau kadaluarsa."
                ]);
            }

            return $payment;
        });
    }

    public function updateInvoiceStatus(Invoice $invoice): Invoice
    {
        $totalPaid = $invoice->payments()
            ->where('payment_status', PaymentStatus::PAID)
            ->sum('amount');

        $totalRequired = $invoice->total_amount;

        if ($totalPaid >= $totalRequired) {
            $newStatus = InvoiceStatus::PAID;
        } elseif ($totalPaid > 0) {
            $newStatus = InvoiceStatus::PARTIAL;
        } else {
            $newStatus = InvoiceStatus::UNPAID;
        }

        if ($invoice->status !== $newStatus) {
            $invoice->update(['status' => $newStatus]);

            if ($newStatus === InvoiceStatus::PAID) {
                $this->activateOrder($invoice);
            }
        }

        return $invoice;
    }

    private function activateOrder(Invoice $invoice): void
    {
        $order = $invoice->order;
        if (!$order) return;

        if ($order instanceof MembershipOrder) {
            if ($order->status === MembershipOrderStatus::PENDING) {
                $hasActiveOther = MembershipOrder::where('membership_card_id', $order->membership_card_id)
                    ->where('status', MembershipOrderStatus::ACTIVE)
                    ->where('id', '!=', $order->id)
                    ->exists();

                $newStatus = $hasActiveOther
                    ? MembershipOrderStatus::QUEUED
                    : MembershipOrderStatus::ACTIVE;

                $order->update(['status' => $newStatus]);

                Log::info("[MEMBERSHIP][STATUS_ACTIVATED]", [
                    'order_no'    => $order->order_no,
                    'invoice_no'  => $invoice->invoice_no,
                    'prev_status' => 'pending',
                    'new_status'  => $newStatus->value,
                    'is_renewal'  => $hasActiveOther,
                    'start_date'  => $order->start_date
                ]);
            }
        } elseif ($order instanceof Booking) {
            $totalPaid = $invoice->payments()
                ->where('payment_status', PaymentStatus::PAID)
                ->sum('amount');

            $this->bookingService->updateStatusAfterPayment($order, $totalPaid);

            Log::info("[BOOKING][STATUS_UPDATED]", [
                'order_no' => $order->order_no,
                'total_paid' => $totalPaid
            ]);
        }
    }

    private function handleProofUpload(Invoice $invoice, array $paymentData): ?string
    {
        if (empty($paymentData['proof_of_payment'])) {
            return null;
        }

        try {
            return UploadFileHelper::handleInvoiceFile(
                $paymentData['proof_of_payment'],
                $invoice->id,
                'payment-proof'
            );
        } catch (\Throwable $e) {
            Log::error('[BILLING][UPLOAD_ERROR]', ['message' => $e->getMessage(), 'invoice_id' => $invoice->id]);
            return null;
        }
    }

    public function syncWithGateway(Payment $payment): Payment
    {
        $provider = $payment->detail->payment_provider ?? 'midtrans';
        $status = $this->gatewayService->checkStatus($payment->gateway_order_id, $provider);

        $isPaid = in_array($status->transaction_status, ['settlement', 'capture', 'PAID', 'COMPLETED']);

        if ($isPaid) {
            DB::transaction(function () use ($payment, $status, $provider) {
                $payment->update(['payment_status' => PaymentStatus::PAID]);

                $payment->detail()->updateOrCreate(
                    ['payment_id' => $payment->id],
                    [
                        'payment_provider' => $provider,
                        'reference_no'     => $status->transaction_id ?? $status->id ?? null,
                        'raw_response'     => json_encode($status)
                    ]
                );
                $this->updateInvoiceStatus($payment->invoice);
            });
        }

        return $payment->refresh();
    }
}
