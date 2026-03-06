<?php
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\MembershipBenefitOtherResource;
use App\Http\Resources\MembershipBenefitDiscountResource;

class MembershipPackageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $latestUpdate = collect([
            $this->updated_at,
            optional($this->discounts)->max('updated_at'),
            optional($this->others)->max('updated_at'),
        ])->filter()->max();

        return [
            'id'              => $this->id,
            'venue_id'        => $this->venue_id,
            'slug'            => $this->slug,
            'name'            => $this->name,
            'duration_months' => $this->duration_months,
            'price'           => $this->price,
            'description'     => $this->description,
            'is_active'       => (bool) $this->is_active,
            'updated_at'      => $latestUpdate?->format('Y-m-d H:i:s'),
            
            'discounts'       => MembershipBenefitDiscountResource::collection($this->whenLoaded('discounts')),
            'others'          => MembershipBenefitOtherResource::collection($this->whenLoaded('others')),
        ];
    }
}