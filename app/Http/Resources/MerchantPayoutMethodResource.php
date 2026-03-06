<?php

namespace App\Http\Resources;

use App\Http\Resources\StatusHistoryResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MerchantPayoutMethodResource extends JsonResource
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
            'type' => $this->type,
            'provider_name' => $this->provider_name,
            'account_number' => $this->account_number,
            'account_holder_name' => $this->account_holder_name,
            'status' => $this->status,
            'status_histories' => StatusHistoryResource::collection($this->whenLoaded('statusHistories')),
            'latest_status' => new StatusHistoryResource($this->whenLoaded('latestStatusHistory')),

            'is_primary' => (bool) $this->is_primary,
            'is_shadow_data' => str_contains(get_class($this->resource), 'Submission'),

            'payout_method_id' => $this->payout_method_id,

            'created_at'     => $this->created_at,
            'updated_at'     => $this->updated_at,
        ];
    }
}
