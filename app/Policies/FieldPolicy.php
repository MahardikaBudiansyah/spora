<?php

namespace App\Policies;

use App\Models\Merchant;
use App\Models\Field;

class FieldPolicy
{
    public function viewAny(Merchant $merchant)
    {
        return true;
    }

    public function view(Merchant $merchant, Field $field)
    {
        return $merchant->id === $field->venue->merchant_id;
    }

    public function create(Merchant $merchant)
    {
        return true;
    }

    public function update(Merchant $merchant, Field $field)
    {
        return $merchant->id === $field->venue->merchant_id;
    }

    public function delete(Merchant $merchant, Field $field)
    {
        return $merchant->id === $field->venue->merchant_id;
    }
}
