<?php

namespace App\Services\Booking;

use Carbon\Carbon;
use App\Models\Venue;
use App\Enums\OrderType;
use App\Models\MembershipCard;
use App\Models\MembershipOrder;
use App\Helpers\NumberPhoneHelper;
use Illuminate\Support\Facades\Log;

class BookingPricingService
{
    public function getBookingSummary(array $details, ?string $phone, int $venueId, string $paymentType = 'full_payment'): array
    {
        $pricing = $this->calculateBookingPrice($details, $phone, $venueId);

        $venue = Venue::with('paymentPolicies')->findOrFail($venueId);
        $policy = $venue->getPolicyFor(OrderType::BOOKING);

        $totalFinal = $pricing['total_price'];
        $isDpAvailable = false;

        if (empty($details)) {
            return array_merge($pricing, [
                'payment_summary' => [
                    'selected_type' => 'full_payment',
                    'is_dp_available' => false,
                    'total_bill' => 0,
                    'amount_to_pay_now' => 0,
                    'policy' => $policy ? $this->formatPolicy($policy) : null
                ]
            ]);
        }

        if ($policy && $policy->enable_dp) {
            $dates = collect($details)->pluck('booking_date')->map(fn($d) => Carbon::parse($d));
            $earliestDate = $dates->min();
            
            $daysBeforePlay = now()->startOfDay()->diffInDays($earliestDate->startOfDay(), false);
            $minDaysRequired = $policy->full_payment_days_before ?? 1;

            $isDpAvailable = $daysBeforePlay >= $minDaysRequired;
        }

        // 3. Logika Penentuan Nominal (Force Full Payment jika DP tidak tersedia)
        $finalSelectedType = ($isDpAvailable && $paymentType === 'down_payment') ? 'down_payment' : 'full_payment';
        
        if ($finalSelectedType === 'down_payment') {
            if ($policy->dp_type === 'percentage') {
                $minAmountToPay = round($totalFinal * ($policy->dp_value / 100));
            } else {
                $minAmountToPay = (float) min($policy->dp_value, $totalFinal);
            }
        } else {
            $minAmountToPay = $totalFinal;
        }

        return array_merge($pricing, [
            'payment_summary' => [
                'selected_type' => $finalSelectedType, // Gunakan hasil validasi backend
                'is_dp_available' => $isDpAvailable,
                'total_bill' => $totalFinal,
                'amount_to_pay_now' => $minAmountToPay,
                'policy' => $policy ? $this->formatPolicy($policy) : null
            ]
        ]);
    }

    protected function formatPolicy($policy) {
        return [
            'id' => $policy->id,
            'full_payment_days_before' => $policy->full_payment_days_before,
            'enable_dp' => $policy->enable_dp,
            'dp_type' => $policy->dp_type,
            'dp_value' => $policy->dp_value,
        ];
    }

    public function calculateBookingPrice(array $details, ?string $phone, int $venueId): array
    {
        $totalOriginal = 0;
        $totalDiscount = 0;
        $calculatedDetails = [];

        Log::info('[PRICING_SERVICE][START]', [
            'phone' => $phone,
            'venue_id' => $venueId,
            'total_slots_sent' => count($details)
        ]);
        
        $activeOrder = $this->getActiveMembershipOrder($phone, $venueId);
        $quotaLeft = $activeOrder ? (int)$activeOrder->remaining_discount_limits : 0;
        
        Log::info('[PRICING_SERVICE][MEMBERSHIP_STATUS]', [
            'found' => $activeOrder ? true : false,
            'order_no' => $activeOrder?->order_no,
            'initial_quota' => $quotaLeft,
            'discount_type' => $activeOrder?->discount_type_snapshot,
            'discount_value' => $activeOrder?->discount_value_snapshot,
        ]);

        foreach ($details as $index => $item) {
            $original = (float) $item['original_price']; 
            $discount = 0;
            $isApplied = false; 

            if ($activeOrder && $quotaLeft > 0) {
                $discount = $this->calculateDiscountFromMembership($activeOrder, $original, $item['booking_date']);
                
                if ($discount > 0) {
                    $quotaLeft--;
                    $isApplied = true;
                }
            }

            Log::debug("[PRICING_SERVICE][SLOT_$index]", [
                'date' => $item['booking_date'],
                'original' => $original,
                'discount_applied' => $discount,
                'remaining_quota_after' => $quotaLeft,
                'status' => $isApplied ? 'DISCOUNTED' : 'NORMAL_PRICE'
            ]);

            $final = $original - $discount;
            $calculatedDetails[] = array_merge($item, [
                'discount_amount' => $discount,
                'final_price' => $final
            ]);

            $totalOriginal += $original;
            $totalDiscount += $discount;
        }

        $discountedItemsCount = collect($calculatedDetails)->where('discount_amount', '>', 0)->count();

        $result = [
            'total_original_price' => $totalOriginal,
            'total_discount' => $totalDiscount,
            'total_price' => $totalOriginal - $totalDiscount,
            'details' => $calculatedDetails,
            'membership_order_id' => $activeOrder?->id,
            'discounted_items_count' => $discountedItemsCount 
        ];

        Log::info('[PRICING_SERVICE][RESULT]', [
            'final_total' => $result['total_price'],
            'discounted_items' => $discountedItemsCount,
            'final_quota_left_in_process' => $quotaLeft
        ]);

        return $result;
    }

    protected function getActiveMembershipOrder(?string $phone, int $venueId)
    {
        if (!$phone) return null;

        $normalizedPhone = NumberPhoneHelper::normalize($phone);

        $rawOrder = MembershipOrder::whereHas('membershipCard', function($q) use ($normalizedPhone, $venueId) {
                $q->where('phone_number', $normalizedPhone)
                ->where('venue_id', $venueId);
            })->latest()->first();

        if ($rawOrder) {
            Log::info('[DEBUG_DB_CHECK]', [
                'order_no' => $rawOrder->order_no,
                'status' => $rawOrder->status,
                'remaining_quota' => $rawOrder->remaining_discount_limits,
                'start' => $rawOrder->start_date,
                'end' => $rawOrder->end_date,
                'now' => now()->toDateString()
            ]);
        }

        return MembershipOrder::activeForMember($normalizedPhone, $venueId)->first();
    }

    public function calculateDiscountFromMembership($activeOrder, float $price, ?string $bookingDate): float
    {
        if (!$bookingDate || !$activeOrder || $activeOrder->remaining_discount_limits <= 0) {
            return 0;
        }

        try {
            $start   = Carbon::parse($activeOrder->start_date);
            $end     = Carbon::parse($activeOrder->end_date);
            $booking = Carbon::parse($bookingDate);

            if ($booking->lt($start) || $booking->gt($end)) {
                return 0; 
            }

            $discountType = $activeOrder->discount_type_snapshot;
            $discountValue = $activeOrder->discount_value_snapshot;

            if (!$discountType || !$discountValue) return 0;

            $discountAmount = ($discountType === 'percentage')
                ? round($price * ($discountValue / 100))
                : $discountValue;

            return (float) min($discountAmount, $price);
        } catch (\Exception $e) {
            Log::error("Error parsing date in discount calculation: " . $e->getMessage());
            return 0;
        }
    }
}