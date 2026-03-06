<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PlatformPayoutMethodResource extends JsonResource
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
            'is_primary' => (bool) $this->is_primary,

            'created_at'     => $this->created_at,
            'updated_at'     => $this->updated_at,
        ];
    }
}
