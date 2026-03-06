<?php

namespace App\Policies;

use App\Models\Admin;
use App\Models\AdminProfile;

class AdminProfilePolicy
{
    public function before(Admin $admin, string $ability)
    {
        if ($admin->role === 'superadmin') {
            return true;
        }
    }

    public function view(Admin $admin, AdminProfile $adminProfile): bool
    {
        return $admin->id === $adminProfile->admin_id;
    }

    public function update(Admin $admin, AdminProfile $adminProfile): bool
    {
        return $admin->id === $adminProfile->admin_id;
    }
}
