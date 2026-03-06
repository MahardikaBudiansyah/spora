<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VenuePaymentPolicyResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'order_type' => $this->order_type->value,
            
            'enable_dp' => (bool) $this->enable_dp,
            'dp_type' => $this->dp_type,
            'dp_value' => (float) $this->dp_value,

            'full_payment_days_before' => (int) $this->full_payment_days_before,
            'max_full_payment_days' => (int) $this->max_full_payment_days,

            'enable_refund' => (bool) $this->enable_refund,
            'refund_percentage' => (float) $this->refund_percentage,
            
        ];
    }
}
