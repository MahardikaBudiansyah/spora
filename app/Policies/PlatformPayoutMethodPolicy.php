<?php

namespace App\Policies;

use App\Models\Admin;
use App\Models\PlatformPayoutMethod;

class PlatformPayoutMethodPolicy
{
    public function viewAny(Admin $admin): bool
    {
        return $admin->role === 'superadmin';
    }

    public function create(Admin $admin): bool
    {
        return $admin->role === 'superadmin';
    }

    public function update(Admin $admin, PlatformPayoutMethod $payoutMethod): bool
    {
        return $admin->role === 'superadmin';
    }

    public function delete(Admin $admin, PlatformPayoutMethod $payoutMethod): bool
    {
        return $admin->role === 'superadmin';
    }
}