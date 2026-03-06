<?php

namespace App\Traits;

use App\Models\Address;
use App\Enums\AddressLabel;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;

trait HasAddress
{
    public function addresses(): MorphMany
    {
        return $this->morphMany(Address::class, 'addressable');
    }
    
    public function address(): MorphOne
    {
        return $this->morphOne(Address::class, 'addressable');
    }

    public function getAddressByLabel(AddressLabel $label): ?Address
    {
        return $this->addresses()->where('label', $label->value)->first();
    }
}