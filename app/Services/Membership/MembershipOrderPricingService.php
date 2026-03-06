<?php

namespace App\Services\Membership;

use App\Models\Venue;
use App\Enums\OrderType;
use App\Models\MembershipCard;
use App\Models\MembershipPackage;
use App\Services\Membership\MembershipOrderService;

class MembershipOrderPricingService
{
    protected $orderService;

    public function __construct(
        MembershipOrderService $orderService,
    ){
        $this->orderService = $orderService;
    }
    
    public function getMembershipOrderSummary(MembershipCard $card, MembershipPackage $package, string $paymentType = 'full_payment'): array
    {
        $venue = $package->venue;
        $policy = $venue->getPolicyFor(OrderType::MEMBERSHIP);

        $dates = $this->orderService->previewDates($card, $package->duration_months);

        $subtotal = $package->price;
        $totalFinal = $subtotal;

        $isDpAvailable = ($policy && $policy->enable_dp);
        
        $finalSelectedType = ($isDpAvailable && $paymentType === 'down_payment') ? 'down_payment' : 'full_payment';
        
        if ($finalSelectedType === 'down_payment') {
            $minAmountToPay = ($policy->dp_type === 'percentage') 
                ? round($totalFinal * ($policy->dp_value / 100))
                : (float) min($policy->dp_value, $totalFinal);
        } else {
            $minAmountToPay = $totalFinal;
        }

        return [
            'package_id' => $package->id,
            'package_name' => $package->name,
            'subtotal' => $subtotal,
            'total_price' => $totalFinal,
            'schedule_prediction' => [
                'start_date' => $dates['start_date']->toIso8601String(),
                'end_date' => $dates['end_date']->toIso8601String(),
                'is_queued' => $dates['is_renewal'],
            ],
            'payment_summary' => [
                'selected_type' => $finalSelectedType,
                'is_dp_available' => $isDpAvailable,
                'total_bill' => $totalFinal,
                'amount_to_pay_now' => $minAmountToPay,
                'policy' => $policy ? $this->formatPolicy($policy) : null
            ]
        ];
    }

    protected function formatPolicy($policy) {
        return [
            'id' => $policy->id,
            'enable_dp' => $policy->enable_dp,
            'dp_type' => $policy->dp_type,
            'dp_value' => $policy->dp_value,
        ];
    }
}