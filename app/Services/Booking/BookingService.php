<?php

namespace App\Services\Booking;

use Log;
use DB;
use App\Models\Field;
use App\Models\Booking;
use App\Models\Invoice;
use App\Models\Membership;
use App\Models\SlotStatus;
use App\Models\SlotStatusLabel;
use App\Models\VenuePaymentType;
use Illuminate\Support\Facades\Auth;
use App\Services\Billing\InvoiceService;
use App\Services\Billing\PaymentService;
use App\Helpers\OrderHelper;
use App\Helpers\NumberPhoneHelper;
use Carbon\Carbon;

class BookingService
{
    public const PAYMENT_FULL = 'full_payment';
    public const PAYMENT_DP   = 'down_payment';

    public const STATUS_UNPAID  = 'unpaid';
    public const STATUS_PARTIAL = 'partial';

    /**
     * Generate nomor booking unik
     */
    protected function generateOrderNo(int $venueId, int $userId): string
    {
        return OrderHelper::generateOrderNo('BOOK', $venueId, $userId);
    }

    /**
     * Buat booking utama
     */
    protected function createBooking(
        $venue,
        string $orderNo,
        float $totalPrice,
        string $status,
        ?int $operatorAssignmentId = null,
        ?int $venuePaymentTypeId = null,
        float $totalOriginalPrice = null,
        float $totalDiscount = 0
    ): Booking {
        return Booking::create([
            'order_no'               => $orderNo,
            'venue_id'               => $venue->id,
            'venue_payment_type_id'  => $venuePaymentTypeId,
            'operator_assignment_id' => $operatorAssignmentId,
            'status'                 => $status,
            'total_original_price'   => $totalOriginalPrice ?? $totalPrice,
            'total_discount'         => $totalDiscount,
            'total_price'            => $totalPrice,
        ]);
    }

    /**
     * Tambahkan customer ke booking
     */
    protected function addCustomer(Booking $booking, array $customer)
    {
        return $booking->customers()->create([
            'user_id'      => $customer['user_id'] ?? null,
            'name'         => $customer['name'],
            'phone_number' => NumberPhoneHelper::normalize($customer['phone_number']),
        ]);
    }

    /**
     * Tambahkan detail booking & set slot status
     */
    protected function addDetails(Booking $booking, array $details)
    {
        $bookedStatusId = SlotStatusLabel::where('name', 'Booked')->value('id');
        if (!$bookedStatusId) {
            throw new \Exception("SlotStatusLabel 'Booked' tidak ditemukan.");
        }

        foreach ($details as $detail) {
            $fieldId     = $detail['field_id'];
            $timeSlotId  = $detail['time_slot_id'];
            $bookingDate = $detail['booking_date'];

            $field = Field::findOrFail($fieldId);

            $originalPrice  = $detail['original_price'] ?? $field->price ?? 0;
            $discountAmount = $detail['discount_amount'] ?? 0;
            $finalPrice     = $detail['final_price'] ?? max(0, $originalPrice - $discountAmount);

            $booking->details()->create([
                'field_id'        => $fieldId,
                'time_slot_id'    => $timeSlotId,
                'original_price'  => $originalPrice,
                'discount_amount' => $discountAmount,
                'final_price'     => $finalPrice,
                'booking_date'    => $bookingDate,
            ]);

            SlotStatus::firstOrCreate(
                [
                    'field_id'     => $fieldId,
                    'time_slot_id' => $timeSlotId,
                    'date'         => $bookingDate,
                ],
                [
                    'status_id' => $bookedStatusId,
                ]
            );
        }
    }

    /**
     * Buat invoice
     */
    protected function createInvoice(
        Booking $booking,
        float $totalPrice,
        string $status = self::STATUS_UNPAID,
        ?VenuePaymentType $venuePaymentType = null,
        array $detailsDates = [],
        string $paymentMethod = 'manual'
    ): Invoice {
        $dueDate = null;

        // Hanya hitung due_date untuk booking online/gateway
        if ($paymentMethod === 'gateway') {
            $dueDate = $this->calculateDueDate($venuePaymentType, $detailsDates);
        }

        return app(InvoiceService::class)->createInvoice(
            $booking,
            $totalPrice,
            $status,
            $dueDate
        );
    }

    /**
     * Hitung due date berdasarkan DP dan tanggal booking
     */
    private function calculateDueDate(?VenuePaymentType $venuePaymentType, array $detailsDates): ?Carbon
    {
        if (!$venuePaymentType || !$venuePaymentType->enable_dp || empty($detailsDates)) {
            return null;
        }

        $earliestDate = collect($detailsDates)->min(fn($d) => Carbon::parse($d));
        $earliestDate = Carbon::parse($earliestDate);

        $fullPaymentDaysBefore = min(
            $venuePaymentType->full_payment_days_before,
            $venuePaymentType->max_full_payment_days
        );

        $dueDate = $earliestDate->copy()->subDays($fullPaymentDaysBefore);

        if ($dueDate->isPast()) {
            Log::info("Booking terlalu dekat. DP tidak berlaku. Gunakan full payment.");
            return null;
        }

        return $dueDate;
    }

    /**
     * Buat pembayaran (gateway/manual)
     */
    public function createPayment($invoice, array $paymentData, $request): array
    {
        $paymentService = app(PaymentService::class);
        $user = Auth::guard('web')->user() ?? Auth::guard('partner')->user();

        if (!$user) {
            throw new \Exception('Tidak ada user atau partner yang terautentikasi.');
        }

        $paymentData['type'] = match ($paymentData['type'] ?? '') {
            'dp', 'down_payment' => self::PAYMENT_DP,
            'full_payment'       => self::PAYMENT_FULL,
            default              => self::PAYMENT_FULL,
        };

        $isGateway = ($paymentData['method'] ?? '') === 'gateway';
        $venuePaymentType = $paymentData['venuePaymentType'] ?? null;

        $result = $isGateway
            ? $paymentService->createGatewayPayment($invoice, $paymentData['amount'], $paymentData, $user, $venuePaymentType)
            : $paymentService->createManualPayment($invoice, $paymentData['amount'], $paymentData['method'] ?? 'cash', $paymentData['extra'] ?? []);

        return [
            'status' => 'success',
            'method' => $isGateway ? 'gateway' : 'manual',
            'type'   => $paymentData['type'],
            'data'   => $result,
            'snap_token' => $result['snap_token'] ?? null,
        ];
    }

    /**
     * Ambil membership aktif
     */
    protected function getActiveMembership($user, ?int $venueId = null)
    {
        if (!$venueId) return null;
        return Membership::activeForUserVenue($user->id, $venueId)->lockForUpdate()->first();
    }

    /**
     * Hitung total harga dari details
     */
    protected function calculateTotal(array $details): float
    {
        return collect($details)->sum(fn($item) => (float)($item['final_price'] ?? $item['price'] ?? $item['original_price'] ?? 0));
    }

    /**
     * Tentukan tipe pembayaran (DP atau full)
     */
    protected function determinePaymentType(?VenuePaymentType $venuePaymentType): string
    {
        return ($venuePaymentType && $venuePaymentType->enable_dp)
            ? self::PAYMENT_DP
            : self::PAYMENT_FULL;
    }

    /**
     * Hitung jumlah DP yang harus dibayar
     */
    public function calculateDp(?VenuePaymentType $paymentType, float $totalPrice, bool $forceMerchant = false): float
    {
        if (!$paymentType) return $totalPrice;
        if ($forceMerchant && !$paymentType->apply_to_merchant) return $totalPrice;
        if (!$paymentType->enable_dp) return $totalPrice;

        $dpValue = $paymentType->dp_value ?? 0;

        if ($paymentType->dp_type === 'percentage') {
            return round($totalPrice * ($dpValue / 100));
        }

        if ($paymentType->dp_type === 'fixed') {
            return min($dpValue, $totalPrice);
        }

        return $totalPrice;
    }

    /**
     * Hitung harga setelah diskon membership
     */
    protected function calculateMembershipDiscount($membership, float $price, string $bookingDate): float
    {
        if (!$membership || $membership->remaining_discount_limits <= 0) return 0;

        $start   = Carbon::parse($membership->start_date);
        $end     = Carbon::parse($membership->end_date);
        $booking = Carbon::parse($bookingDate);

        // Cek periode aktif
        if ($booking->lt($start) || $booking->gt($end)) {
            return 0; // booking di luar periode aktif → tidak dapat diskon
        }

        $discount = $membership->membershipPackage->discounts->first();
        if (!$discount) return 0;

        return ($discount->discount_type === 'percentage')
            ? round($price * ($discount->discount_value / 100))
            : $discount->discount_value;
    }
}
