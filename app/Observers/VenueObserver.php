<?php

namespace App\Observers;

use App\Models\Venue;
use App\Enums\OrderType;

class VenueObserver
{
    public function created(Venue $venue): void
    {
        $venue->recordStatusHistory();

        $venue->paymentPolicies()->createMany([
            [
                'order_type' => OrderType::BOOKING->value,
                'enable_dp' => false,
                'dp_type' => 'fixed',
                'dp_value' => 0,
                'full_payment_days_before' => 1,
                'max_full_payment_days' => 3,
                'enable_refund' => false,
                'refund_percentage' => 0,
                'is_active' => true,
            ],
            [
                'order_type' => OrderType::MEMBERSHIP->value,
                'enable_dp' => false,
                'dp_type' => 'fixed',
                'dp_value' => 0,
                'full_payment_days_before' => 0,
                'max_full_payment_days' => 1,
                'enable_refund' => false,
                'refund_percentage' => 0,
                'is_active' => true,
            ],
        ]);
    }

    public function updated(Venue $venue)
    {
        if ($venue->isDirty('status')) {
            $venue->recordStatusHistory();
        }
    }
}
