<?php

namespace App\Policies;

use App\Models\Admin;
use App\Models\PlatformProfile;

class PlatformProfilePolicy
{
    public function viewAny(Admin $admin): bool
    {
        return true;
    }

    public function update(Admin $admin, PlatformProfile $platformProfile): bool
    {
        return $admin->role === 'superadmin';
    }
}