<?php

namespace App\Policies;

use App\Models\Venue;
use App\Models\Merchant;
use Illuminate\Auth\Access\Response;

class VenuePolicy
{
    public function viewAny(Merchant $merchant): bool
    {
        return $merchant->status === 'active'; 
    }

    public function view(Merchant $merchant, Venue $venue): bool
    {
        return $venue->merchant_id === $merchant->id;
    }

    public function update(Merchant $merchant, Venue $venue): bool
    {
        return $venue->merchant_id === $merchant->id;
    }

    public function delete(Merchant $merchant, Venue $venue): bool
    {
        return $venue->merchant_id === $merchant->id;
    }

    public function create(Merchant $merchant): bool
    {
        return $merchant->status === 'active';
    }
}
