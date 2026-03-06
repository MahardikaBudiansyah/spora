<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use App\Http\Resources\StatusHistoryResource;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'email_verified_at' => $this->email_verified_at,
            'phone_number' => $this->phone_number,
            'phone_verified_at' => $this->phone_verified_at,
            'avatar_path' => $this->avatar_path ? asset('storage/' . $this->avatar_path) : null,
            'status' => $this->status,
            'status_histories' => StatusHistoryResource::collection($this->whenLoaded('statusHistories')),
            'latest_status' => new StatusHistoryResource($this->whenLoaded('latestStatusHistory')),
            'is_active' => $this->is_active,
            'is_profile_complete' => !empty($this->name) && !empty($this->phone_number),

            'booking_customers_count' => $this->whenCounted('booking_customers'),
            'membership_cards_count' => $this->whenCounted('membership_cards'),

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,

        ];
    }
}
