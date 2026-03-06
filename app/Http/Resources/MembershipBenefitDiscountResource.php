<?php
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MembershipBenefitDiscountResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'name'           => $this->name,
            'discount_type'  => $this->discount_type,
            'discount_value' => $this->discount_value,
            'discount_limit' => $this->discount_limit,
            'description'    => $this->description,
        ];
    }
}