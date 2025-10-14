<?php

namespace App\Services\Booking;

use App\Models\Cart;
use App\Helpers\OrderHelper;
use App\Services\CartService;
use App\Models\VenuePaymentType;
use Illuminate\Support\Facades\DB;
use App\Services\Billing\PaymentService;

class BookingMerchantService extends BookingService
{
    protected PaymentService $paymentService;

    public function __construct(PaymentService $paymentService)
    {
        $this->paymentService = $paymentService;
    }

    protected function generateOrderNo(int $venueId, int $userId): string
    {
        return OrderHelper::generateOrderNo('BOOK', $venueId, $userId);
    }


    /**
     * Create booking by merchant (manual/offline)
     */
    public function create(array $validated, $venue, $request)
    {
        return DB::transaction(function () use ($validated, $venue, $request) {

            // Generate nomor order unik
            $orderNo = $this->generateOrderNo($venue->id, $user->id);

            // Hitung total harga dari detail booking
            $totalPrice = collect($validated['details'])->sum('price');

            // Operator yang mencatat booking (opsional)
            $operatorAssignmentId = $validated['operator_assignment_id'] ?? null;

            // Booking langsung dikonfirmasi oleh merchant
            $bookingStatus = 'confirmed';

            // Ambil tipe pembayaran
            $venuePaymentType = $venue->paymentType()
                ->find($validated['payment']['venue_payment_type_id'] ?? null);

            // Hitung DP/final price jika ada
            $finalPrice = $totalPrice;
            $totalDiscount = 0;

            if ($venuePaymentType?->enable_dp && $venuePaymentType->apply_to_merchant) {
                $dpAmount = $this->calculateDp($venuePaymentType, $totalPrice, true);
                $totalDiscount = $totalPrice - $dpAmount;
                $finalPrice = $dpAmount;
            }

            // 1️⃣ Buat booking utama
            $booking = $this->createBooking(
                $venue,
                $orderNo,
                $finalPrice,
                $bookingStatus,
                $operatorAssignmentId,
                $venuePaymentType?->id,
                $totalPrice,
                $totalDiscount
            );

            // 2️⃣ Tambahkan customer & detail slot
            $this->addCustomer($booking, $validated['customer']);
            $this->addDetails($booking, $validated['details']);

            // 3️⃣ Buat invoice
            $invoice = $this->createInvoice($booking, $finalPrice, self::STATUS_UNPAID, $venuePaymentType);

            // 4️⃣ Buat payment manual (merchant input langsung)
            $payment = null;
            if (!empty($validated['payment'])) {
                $paymentData = $validated['payment'];
                $paymentData['method'] = $paymentData['method'] ?? 'manual';

                // Tentukan jumlah yang dibayar
                $paymentAmount = $finalPrice;

                // Tentukan tipe pembayaran
                $paymentType = ($venuePaymentType?->enable_dp && $venuePaymentType->apply_to_merchant)
                    ? self::PAYMENT_DP
                    : ($paymentData['type'] ?? self::PAYMENT_FULL);

                // Tambahkan data customer ke paymentData
                $paymentData['customer'] = $validated['customer'];

                $payment = $this->createPayment($invoice, array_merge($paymentData, [
                    'amount' => $paymentAmount,
                    'type'   => $paymentType,
                ]), $request);
            }


            // 5️⃣ Arsipkan cart (jika ada) dan hapus dari carts
            $cartIds = collect($validated['details'])->pluck('cart_id')->filter()->all();
            if (!empty($cartIds)) {
                app(CartService::class)->deleteCarts($cartIds);
            }


            // 6️⃣ Kembalikan entitas penting
            return [$booking, $invoice, $payment];
        }, 5);
    }
}
