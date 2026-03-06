<?php

namespace App\Policies;

use App\Models\Admin;
use App\Models\Merchant;

class MerchantPolicy
{
    public function viewAny($user): bool
    {
        return true;
    }

    public function view($user, Merchant $merchant): bool
    {
        return true;
    }

    public function create($user): bool
    {
        return true;
    }

    public function update($user, Merchant $merchant): bool
    {
        return $user->id === $merchant->id;
    }

    public function delete($user, Merchant $merchant): bool
    {
        return false;
    }

    public function viewMidtransDetails($user)
    {
        return $user instanceof Admin && $user->role === 'superadmin';
    }

    public function viewXenditDetails($user)
    {
        return $user instanceof Admin && $user->role === 'superadmin';
    }
}
