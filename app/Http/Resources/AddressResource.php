<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AddressResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $parts = [];

        $parts[] = $this->address;

        if ($this->relationLoaded('village')) {
            $parts[] = $this->village?->name;
        }
        if ($this->relationLoaded('district')) {
            $parts[] = $this->district?->name;
        }
        if ($this->relationLoaded('city')) {
            $parts[] = $this->city?->name;
        }
        if ($this->relationLoaded('province')) {
            $parts[] = $this->province?->name;
        }

        $parts[] = $this->postal_code;

        $fullAddress = collect($parts)->filter()->implode(', ');

        $shortParts = [];
        if ($this->relationLoaded('district')) {
            $shortParts[] = $this->district?->name;
        }
        if ($this->relationLoaded('city')) {
            $shortParts[] = $this->city?->name;
        }

        $shortAddress = collect($shortParts)->filter()->implode(', ');

        return [
            'full_address'  => $fullAddress,
            'short_address' => $shortAddress ?: $this->address,
            'address'       => $this->address,
            'label'         => $this->label,
            'province_code' => $this->province_code,
            'province'      => $this->whenLoaded('province', fn() => $this->province->name),
            'city_code'     => $this->city_code,
            'city'          => $this->whenLoaded('city', fn() => $this->city->name),
            'district_code' => $this->district_code,
            'district'      => $this->whenLoaded('district', fn() => $this->district->name),
            'village_code'  => $this->village_code,
            'village'       => $this->whenLoaded('village', fn() => $this->village->name),
            'postal_code'   => $this->postal_code,
            'latitude'      => (float) $this->latitude,
            'longitude'     => (float) $this->longitude,

        ];
    }
}
