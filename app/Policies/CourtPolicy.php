<?php

namespace App\Policies;

use App\Models\Merchant;
use App\Models\Court;

class CourtPolicy
{
    public function viewAny(Merchant $merchant)
    {
        return true;
    }

    public function view(Merchant $merchant, Court $court)
    {
        return $merchant->id === $court->venue->merchant_id;
    }

    public function create(Merchant $merchant)
    {
        return true;
    }

    public function update(Merchant $merchant, Court $court)
    {
        return $merchant->id === $court->venue->merchant_id;
    }

    public function delete(Merchant $merchant, Court $court)
    {
        return $merchant->id === $court->venue->merchant_id;
    }
}
