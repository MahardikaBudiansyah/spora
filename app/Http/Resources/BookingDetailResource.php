<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookingDetailResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'court_id' => $this->court_id,
            'time_slot_id' => $this->time_slot_id,

            'court_name' => $this->court_name_snapshot ?? $this->court?->name,
            'time_slot_name' => $this->time_slot_name_snapshot ?? $this->timeSlot?->name,
            'day_type' => $this->day_type_snapshot, 

            'original_price' => (float) $this->original_price,
            'discount_amount' => (float) $this->discount_amount,
            'final_price' => (float) $this->final_price,
            'booking_date' => $this->booking_date,
        ];
    }
}
