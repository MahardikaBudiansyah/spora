<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use App\Http\Resources\AddressResource;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\PlatformPayoutMethodResource;

class PlatformProfileResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'admin_id' => $this->admin_id,
            'nik' => $this->nik,
            'full_name' => $this->full_name,

            'business_name' => $this->business_name,
            'business_email' => $this->business_email,
            'business_phone_number' => $this->business_phone_number,
            'business_type' => $this->business_type,
            'nib' => $this->nib,
            'logo_path' => $this->logo_path,

            'social_media' => $this->whenLoaded('socialMedia', function () {
                return $this->socialMedia->map(fn($sm) => [
                    'id' => $sm->id,
                    'platform' => ($sm->platform),
                    'username' => $sm->username,
                    'url' => $sm->url,
                ]);
            }),

            'address' => new AddressResource($this->whenLoaded('address')),

            'payout_methods'            => PlatformPayoutMethodResource::collection($this->whenLoaded('payoutMethods')),
            'primary_payout_method'     => new PlatformPayoutMethodResource($this->whenLoaded('primaryPayoutMethod')),

            'midtrans_sub_account_id'     => $this->midtrans_sub_account_id,
            'xendit_sub_account_id'     => $this->xendit_sub_account_id,

            'created_at'     => $this->created_at,
            'updated_at'     => $this->updated_at,
        ];
    }
}
