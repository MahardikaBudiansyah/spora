<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Enums\OrderType; // Pastikan Enum ini diimport

class CheckoutItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $pricing = $this->additional['pricing']['details'] ?? [];
        
        $itemPricing = collect($pricing)->first(function($p) {
            return $p['time_slot_id'] == $this->time_slot_id && $p['booking_date'] == $this->date;
        });

        // Ambil policy khusus untuk BOOKING
        $policy = $this->venue->paymentPolicies
            ->where('order_type', OrderType::BOOKING)
            ->where('is_active', true)
            ->first();

        return [
            'cart_id'         => $this->id,
            'venue_id'        => $this->venue_id,
            'court_id'        => $this->court_id,
            'court_name'      => $this->court->name,
            'timeslot_id'     => $this->time_slot_id,
            'start_time'      => $this->timeSlot->start_time,
            'end_time'        => $this->timeSlot->end_time,
            'booking_date'    => $this->date,
            'original_price'  => (float) $this->price,
            'final_price'     => (float) ($itemPricing['final_price'] ?? $this->price),
            'discount_amount' => (float) ($itemPricing['discount_amount'] ?? 0),
            
            // Gunakan Resource Policy yang sudah kamu buat agar strukturnya konsisten
            'paymentType'     => $policy ? new VenuePaymentPolicyResource($policy) : null,
        ];
    }
}