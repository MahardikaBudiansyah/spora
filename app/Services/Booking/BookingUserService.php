<?php

namespace App\Services\Booking;

use Carbon\Carbon;
use App\Models\Cart;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Services\CartService;

class BookingUserService extends BookingService
{
    /**
     * Buat booking lengkap (booking + customer + detail + invoice + payment + hapus cart)
     */
    public function create(array $validated, $venue, $request): array
    {
        return DB::transaction(function () use ($validated, $venue, $request) {
            $user = Auth::user();

            Log::info('BookingUserService payload', [
                'user_id' => $user?->id,
                'payload' => $validated,
            ]);

            $orderNo = $this->generateOrderNo($venue->id, $user->id);

            $venuePaymentType = $venue->paymentType()
                ->where('id', $validated['payment']['venue_payment_type_id'] ?? 0)
                ->first() ?? $venue->paymentType()->first();

            if (!$venuePaymentType) abort(400, 'Tipe pembayaran tidak valid untuk venue ini.');

            $details = collect($validated['details'] ?? []);
            if ($details->isEmpty()) throw new \Exception('Tidak ada detail booking.');

            // Hitung diskon membership per detail & update remaining_discount_limits
            $details = $details->map(fn($detail) => $this->prepareDetail($detail, $user, $venue))->toArray();

            $totalOriginalPrice = collect($details)->sum(fn($d) => $d['original_price']);
            $totalDiscount      = collect($details)->sum(fn($d) => $d['discount_amount']);
            $totalPrice         = $this->calculateTotal($details);

            // Buat booking
            $booking = $this->createBooking(
                $venue,
                $orderNo,
                $totalPrice,
                'pending',
                null,
                $venuePaymentType->id,
                $totalOriginalPrice,
                $totalDiscount
            );

            // Customer & details
            $this->addCustomer($booking, $validated['customer']);
            $this->addDetails($booking, $details);

            $paymentType = $validated['payment']['type'] ?? $this->determinePaymentType($venuePaymentType);
            $isDp = $paymentType === self::PAYMENT_DP;

            // Invoice
            $invoiceStatus = $isDp ? self::STATUS_PARTIAL : self::STATUS_UNPAID;
            $invoice = $this->createInvoice(
                $booking,
                $totalPrice,
                $invoiceStatus,
                $venuePaymentType,
                collect($details)->pluck('booking_date')->toArray(),
                $validated['payment']['method'] ?? 'manual'
            );

            // Payment
            $payment = null;
            $snapToken = null;

            if (!empty($validated['payment'])) {
                $paymentAmount = $isDp
                    ? $this->calculateDp($venuePaymentType, $totalPrice)
                    : $totalPrice;

                $paymentData = $validated['payment'];
                $paymentData['amount']           = $paymentAmount;
                $paymentData['type']             = $isDp ? self::PAYMENT_DP : self::PAYMENT_FULL;
                $paymentData['customer']         = $validated['customer'];
                $paymentData['venuePaymentType'] = $venuePaymentType;
                $paymentData['method']           = $paymentData['method'] ?? 'manual';

                $paymentResult = $this->createPayment($invoice, $paymentData, $request);
                $payment = $paymentResult['data'] ?? null;
                $snapToken = $paymentResult['snap_token'] ?? null;

                if (($payment['payment_status'] ?? null) === 'paid') {
                    $invoiceStatus = $payment['payment_type'] === self::PAYMENT_FULL ? 'paid' : 'partial';
                    $bookingStatus = $payment['payment_type'] === self::PAYMENT_FULL ? 'confirmed' : 'pending';

                    $invoice->update(['status' => $invoiceStatus]);
                    $booking->update(['status' => $bookingStatus]);
                }
            }

            // Hapus cart
            $details = collect($validated['details'] ?? [])->map(fn($detail) => [
                ...$this->prepareDetail($detail, $user, $venue),
                'cart_id' => $detail['cart_id'] ?? null,
            ])->toArray();

            $cartIds = collect($details)->pluck('cart_id')->filter()->all();
            Log::info('Cart IDs to delete', ['cartIds' => $cartIds]);

            if (!empty($cartIds)) {
                app(CartService::class)->deleteCarts($cartIds);
                Log::info('Carts deleted', ['cartIds' => $cartIds]);
            }

            Log::info("✅ BookingUserService success", [
                'booking_id' => $booking->id,
                'invoice_id' => $invoice->id,
                'payment_id' => $payment['id'] ?? null,
                'user_id'    => $user->id,
            ]);

            return [$booking, $invoice, $payment, $snapToken];
        }, 5);
    }

    /**
     * Persiapkan detail booking (hitung diskon & final_price)
     */
    private function prepareDetail(array $detail, $user, $venue): array
    {
        $field = $venue->fields()->findOrFail($detail['field_id']);
        $basePrice = $detail['original_price'] ?? $field->price ?? 0;

        $membership = $this->getActiveMembership($user, $venue->id);
        $discountAmount = 0;

        if ($membership && $membership->remaining_discount_limits > 0) {
            $discountAmount = $this->calculateMembershipDiscount(
                $membership,
                $basePrice,
                $detail['booking_date'] // kirim tanggal slot untuk cek periode
            );

            if ($discountAmount > 0) {
                // Update remaining limit per slot yang dapat diskon
                $before = $membership->remaining_discount_limits;
                $membership->remaining_discount_limits = max(0, $before - 1);
                $membership->save();

                Log::info('Membership discount limit updated', [
                    'membership_id' => $membership->id,
                    'user_id'       => $user->id,
                    'before'        => $before,
                    'slots_used'    => 1,
                    'remaining'     => $membership->remaining_discount_limits,
                ]);

                Log::info('Membership discount check', [
                    'slot_date' => $detail['booking_date'],
                    'base_price' => $basePrice,
                    'discount' => $discountAmount,
                    'membership_limit' => $membership?->remaining_discount_limits,
                ]);
            }
        }

        return array_merge($detail, [
            'original_price'  => $basePrice,
            'discount_amount' => $discountAmount,
            'final_price'     => max(0, $basePrice - $discountAmount),
        ]);
    }
}
