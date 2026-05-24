<?php

namespace App\Services\Booking;

use Carbon\Carbon;

use App\Models\Cart;
use App\Models\Admin;
use App\Models\Venue;
use App\Models\Booking;

use App\Models\Merchant;
use App\Enums\PaymentStatus;
use App\Services\CartService;
use App\Enums\NotificationType;
use Illuminate\Support\Facades\DB;

use Illuminate\Support\Facades\Log;
use App\Services\Billing\InvoiceService;
use App\Services\Billing\PaymentService;
use App\Services\System\NotificationService;
use Illuminate\Validation\ValidationException;
use App\Services\Booking\BookingPricingService;
use App\Services\Membership\MembershipOrderService;


class BookingFlowService
{
    protected BookingService $bookingService;
    protected BookingPricingService $bookingPricingService;
    protected InvoiceService $invoiceService;
    protected PaymentService $paymentService;
    protected MembershipOrderService $membershipOrderService;
    protected CartService $cartService;
    protected NotificationService $notificationService;

    public function __construct(
        BookingService $bookingService,
        BookingPricingService $bookingPricingService,
        InvoiceService $invoiceService,
        PaymentService $paymentService,
        MembershipOrderService $membershipOrderService,
        CartService $cartService,
        NotificationService $notificationService,
    ) {
        $this->bookingService = $bookingService;
        $this->bookingPricingService = $bookingPricingService;
        $this->invoiceService = $invoiceService;
        $this->paymentService = $paymentService;
        $this->membershipOrderService = $membershipOrderService;
        $this->cartService = $cartService;
        $this->notificationService = $notificationService;
    }

    public function handleOfflineBooking(array $input, Venue $venue): Booking
    {
        Log::info('[BOOKING][FLOW_START]', ['type' => 'OFFLINE', 'venue_id' => $venue->id]);

        $paymentData = $this->formatPaymentData($input);
        $customerPhone = $input['customer_phone'] ?? null;

        $pricing = $this->bookingPricingService->calculateBookingPrice(
            $input['details'],
            $customerPhone,
            $venue->id
        );

        if (abs($pricing['total_price'] - $input['total_price']) > 0.01) {
            Log::warning('[PRICE_MISMATCH_DETECTED]', [
                'frontend_total' => $input['total_price'],
                'backend_calculated' => $pricing['total_price'],
                'diff' => $pricing['total_price'] - $input['total_price'],
                'membership_found' => $pricing['membership_order_id'] ? 'YES' : 'NO',
                'phone' => $customerPhone
            ]);

            throw ValidationException::withMessages([
                'total_price' => "Harga tidak cocok. Di sistem: " . number_format($pricing['total_price']) .
                    ", di Form: " . number_format($input['total_price'])
            ]);
        }

        return DB::transaction(function () use ($input, $venue, $paymentData, $pricing) {
            $bookingData = array_merge($input, [
                'total_original_price' => $pricing['total_original_price'],
                'total_discount'       => $pricing['total_discount'],
                'total_price'          => $pricing['total_price'],
                'details'              => $pricing['details'],
            ]);

            $booking = $this->bookingService->createBooking($bookingData, $venue);

            $invoice = $this->invoiceService->createInvoice($booking, $paymentData);

            if ($pricing['membership_order_id'] && $pricing['discounted_items_count'] > 0) {
                $this->membershipOrderService->consumeDiscountLimit(
                    $pricing['membership_order_id'],
                    $pricing['discounted_items_count']
                );
            }

            if (($paymentData['amount'] ?? 0) > 0) {
                $paymentData['is_merchant_input'] = true;
                $paymentData['payment_status'] = PaymentStatus::PAID;

                $this->paymentService->createPayment($invoice, $paymentData);
                $this->bookingService->updateStatusAfterPayment($booking, $paymentData['amount']);
            }

            $this->sendBookingNotifications($booking, $venue);

            return $booking;
        });
    }

    public function handleOnlineBooking(int $userId, array $input): array
    {
        Log::info('[BOOKING][FLOW_START]', ['type' => 'ONLINE', 'user_id' => $userId]);

        $venue = Venue::findOrFail($input['venue_id']);
        $user = auth()->user();

        $selectedCartIds = session('checkout_cart_ids', []);

        $summary = $this->bookingPricingService->getBookingSummary(
            $input['details'],
            $user->phone_number,
            $venue->id,
            $input['payment']['type'] ?? 'full_payment'
        );

        return DB::transaction(function () use ($userId, $input, $venue, $summary, $selectedCartIds) {
            $normalizedData = array_merge($input, [
                'total_original_price' => $summary['total_original_price'],
                'total_discount'       => $summary['total_discount'],
                'total_price'          => $summary['total_price'],
                'details'              => $summary['details'],
                'customer_name'        => $input['customer']['name'] ?? $summary['customer_name'] ?? null,
                'customer_phone'       => $input['customer']['phone_number'] ?? $summary['customer_phone'] ?? null,
            ]);


            $order = $this->bookingService->createBooking($normalizedData, $venue, $userId);

            $paymentData = [
                'payment_method' => $input['payment']['method'] ?? 'gateway',
                'payment_type'   => $summary['payment_summary']['selected_type'] ?? $input['payment']['type'] ?? 'full_payment',
                'amount'         => $summary['payment_summary']['amount_to_pay_now'],
                'venue_payment_policy_id' => $summary['payment_summary']['policy']['id'] ?? $input['payment']['venue_payment_policy_id'] ?? null,
            ];

            $invoice = $this->invoiceService->createInvoice($order, $paymentData);

            if ($summary['membership_order_id'] && $summary['discounted_items_count'] > 0) {
                $this->membershipOrderService->consumeDiscountLimit(
                    $summary['membership_order_id'],
                    $summary['discounted_items_count']
                );
            }

            $gatewayData = $this->paymentService->createOnlineTransaction(
                $invoice,
                $this->mapOrderToCustomerData($order),
                null
            );

            Log::info('[BOOKNG][ONLINE_GATEWAY_CREATED]', ['token' => $gatewayData['token'] ?? 'N/A']);

            if (!empty($selectedCartIds)) {
                $this->cartService->deleteCarts($selectedCartIds);
            }

            $this->sendBookingNotifications($order, $venue);

            return [
                'order' => $order,
                'gateway_data' => $gatewayData
            ];
        });
    }

    private function formatPaymentData(array $input): array
    {
        $methodRaw = $input['payment_method'] ?? 'cash';

        $paymentDateTime = Carbon::parse(
            ($input['payment_date'] ?? now()->toDateString()) . ' ' .
                ($input['payment_time'] ?? now()->format('H:i')),
            'Asia/Jakarta'
        );

        return [
            'payment_type'     => $input['payment_type'] ?? 'full_payment',
            'payment_method'   => match ($methodRaw) {
                'bank_transfer', 'ewallet' => 'transfer',
                'qris' => 'qris',
                'cash' => 'cash',
                default => 'other',
            },
            'payment_channel'  => $methodRaw,
            'payment_provider' => $input['bank'] ?? $input['digital_wallet'] ?? ($methodRaw === 'qris' ? 'qris' : null),
            'amount'           => $input['amount'] ?? 0,
            'reference_no'     => $input['reference_no'] ?? null,
            'payer_name'       => $input['payer_name'] ?? null,
            'payment_date'     => $paymentDateTime,
            'proof_of_payment' => request()->file('proof_of_payment'),
        ];
    }

    private function mapOrderToCustomerData(Booking $booking): array
    {
        $customer = $booking->customer;
        $user = $customer?->user;

        return [
            'name'  => $booking->customer_name_snapshot
                ?? $customer->name
                ?? $user?->name
                ?? 'Guest',

            'email' => $booking->email_snapshot
                ?? $customer->email
                ?? $user?->email
                ?? 'customer@example.com',

            'phone_number' => $booking->phone_number_snapshot
                ?? $customer->phone_number
                ?? $user?->phone_number
                ?? null,

            'member_no' => $booking->member_no_snapshot ?? '-',
        ];
    }

    private function sendBookingNotifications(Booking $booking, Venue $venue)
    {
        $customerName = $booking->customer->name ?? 'Pelanggan';

        if ($booking->user) {
            $this->notificationService->send(
                $booking->user,
                NotificationType::BOOKING_CREATED,
                ['message' => "Booking berhasil! Kode: {$booking->order_no} di {$venue->name}."]
            );
        }

        if ($venue->merchant) {
            $this->notificationService->send(
                $venue->merchant,
                NotificationType::BOOKING_CREATED,
                ['message' => "Pesanan Baru: {$booking->order_no} oleh {$customerName}."]
            );
        }

        $platformAdmins = Admin::where('is_active', true)->get();
        foreach ($platformAdmins as $admin) {
            $this->notificationService->send(
                $admin,
                NotificationType::BOOKING_CREATED,
                ['message' => "Pesanan Baru di {$venue->name}: {$booking->order_no} oleh {$customerName}."]
            );
        }
    }
}
