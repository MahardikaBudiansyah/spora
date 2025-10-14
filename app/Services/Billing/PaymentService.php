<?php

namespace App\Services\Billing;

use App\Models\Booking;
use App\Models\Invoice;
use App\Models\Payment;
use App\Models\Membership;
use Illuminate\Http\Request;
use App\Helpers\PaymentHelper;
use App\Services\MidtransService;
use Illuminate\Support\Facades\Log;

class PaymentService
{
    /**
     * Tentukan tipe pembayaran berdasarkan jenis order.
     */
    protected function determinePaymentType($invoice, ?string $requestedType = null): string
    {
        $order = $invoice->order;

        // Jika order adalah Membership → wajib full_payment
        if ($order instanceof Membership) {
            return 'full_payment';
        }

        // Jika Booking → boleh pakai DP
        return $requestedType ?? 'full_payment';
    }

    /**
     * Update status entitas yang berhubungan dengan invoice.
     */
    protected function updateOrderStatus($order, string $paymentType, string $status): void
    {
        if (!$order) {
            Log::warning('Order not found for invoice.');
            return;
        }

        // Booking
        if ($order instanceof Booking) {
            if ($status === 'paid') {
                $order->update([
                    'status' => $paymentType === 'full_payment' ? 'confirmed' : 'pending',
                ]);
            } elseif ($status === 'failed') {
                $order->update(['status' => 'cancelled']);
            }
        }

        // Membership
        elseif ($order instanceof Membership) {
            if ($status === 'paid') {
                // Cek apakah ada membership lain yang masih aktif di venue yang sama
                $hasActiveMembership = Membership::whereHas('membershipUser', function ($q) use ($order) {
                        $q->where('venue_id', $order->membershipUser->venue_id)
                        ->where('user_id', $order->membershipUser->user_id);
                    })
                    ->where('id', '!=', $order->id)
                    ->where('status', 'active')
                    ->where('is_queued', false)
                    ->exists();

                if ($hasActiveMembership) {
                    // Masih ada membership aktif → masuk antrian
                    $order->update([
                        'status'    => 'active',
                        'is_queued' => true,
                    ]);
                    Log::info("Membership #{$order->id} dibayar tapi masuk antrian (is_queued = true).");
                } else {
                    // Tidak ada membership aktif → langsung aktif
                    $order->update([
                        'status'    => 'active',
                        'is_queued' => false,
                    ]);
                    Log::info("Membership #{$order->id} dibayar dan langsung aktif.");
                }

            } elseif ($status === 'failed') {
                $order->update(['status' => 'cancelled']);
            }
        }

    }

    /**
     * Create payment via Midtrans (Gateway)
     */
    public function createGatewayPayment(
        Invoice $invoice,
        float $amount,
        array $paymentData,
        $user,
        $venuePaymentType = null
    ): array {
        // Ambil jumlah bayar dari BookingService
        $paymentAmount = $paymentData['amount'] ?? $amount;
        $paymentType   = $paymentData['type'] ?? 'full_payment';

        // Generate order ID unik untuk Midtrans
        $gatewayOrderId = PaymentHelper::generatePaymentNo();

        // Buat record Payment
        $payment = $invoice->payments()->create([
            'payment_method'   => 'gateway',
            'payment_type'     => $paymentType,
            'gateway_order_id' => $gatewayOrderId,
            'amount'           => $paymentAmount,
            'payment_status'   => 'pending',
        ]);

        // Data untuk Snap
        $params = [
            'transaction_details' => [
                'order_id'     => $gatewayOrderId,
                'gross_amount' => $paymentAmount,
            ],
            'customer_details' => [
                'first_name' => $paymentData['customer']['name'] ?? null,
                'email'      => $user->email,
                'phone'      => $paymentData['customer']['phone_number'] ?? null,
            ],
        ];

        $snapToken = app(MidtransService::class)->createSnapToken($params);

        return [
            'data'       => $payment,
            'snap_token' => $snapToken,
        ];
    }


    /**
     * Handle callback Midtrans (webhook)
     */
    /**
     * Handle callback Midtrans (webhook)
     */
    public function handleGatewayCallback(Request $request): ?Payment
    {
        $notif = app(MidtransService::class)->parseNotification($request);

        $payment = Payment::where('gateway_order_id', $notif->order_id)->first();
        if (!$payment) return null;

        // Konversi status dari Midtrans
        $status = match ($notif->transaction_status) {
            'capture', 'settlement'    => 'paid',
            'pending'                  => 'pending',
            'deny', 'expire', 'cancel' => 'failed',
            'refund'                   => 'refunded',
            default                    => 'unknown',
        };

        // Update status payment
        $payment->update(['payment_status' => $status]);

        // Ambil payer_name dengan aman
       $payerName = $notif->payer_name ?? null;

        if (empty($payerName) && !empty($notif->va_numbers)) {
            // Konversi va_numbers ke array
            $vaNumbers = json_decode(json_encode($notif->va_numbers), true);

            if (is_array($vaNumbers) && isset($vaNumbers[0]['bank'])) {
                $payerName = $vaNumbers[0]['bank'];
            }
        }

        // Simpan detail transaksi
        $payment->detail()->updateOrCreate(
            ['reference_no' => $notif->transaction_id],
            [
                'payment_provider' => 'midtrans',
                'payment_channel'  => $notif->payment_type ?? null,
                'payer_name'       => $payerName,
                'payment_date'     => now(),
                'raw_response'     => json_decode($request->getContent(), true),
            ]
        );

        // Update invoice
        $invoice = $payment->invoice;
        if ($invoice) {
            if ($status === 'paid') {
                $invoice->update([
                    'status' => $payment->payment_type === 'down_payment' ? 'partial' : 'paid',
                ]);
            } elseif (in_array($status, ['failed', 'refunded'])) {
                $invoice->update(['status' => 'unpaid']);
            }

            // Update order (Booking / Membership) sesuai tipe pembayaran
            $this->updateOrderStatus($invoice->order, $payment->payment_type, $status);
        }

        return $payment;
    }


    /**
     * Confirm manual payment (admin/partner)
     */
    public function confirmManualPayment(Payment $payment): Payment
    {
        $payment->update(['payment_status' => 'paid']);

        $invoice = $payment->invoice;
        if ($invoice) {
            $invoice->update([
                'status' => $payment->payment_type === 'down_payment' ? 'partial' : 'paid',
            ]);

            $this->updateOrderStatus($invoice->order, $payment->payment_type, 'paid');
        }

        return $payment;
    }
}
