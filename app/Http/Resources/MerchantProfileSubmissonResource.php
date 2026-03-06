<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use App\Http\Resources\AddressResource;
use App\Http\Resources\StatusHistoryResource;
use Illuminate\Http\Resources\Json\JsonResource;

class MerchantProfileSubmissionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'business_name' => $this->business_name,
            'business_email' => $this->business_email,
            'business_phone_number' => $this->business_phone_number,
            'business_type' => $this->business_type,
            'nib' => $this->nib,

            'status' => $this->status,
            'status_histories' => StatusHistoryResource::collection($this->whenLoaded('statusHistories')),
            'latest_status' => new StatusHistoryResource($this->whenLoaded('latestStatusHistory')),

            'address' => new AddressResource($this->whenLoaded('address')),

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
