<?php

namespace App\Policies;

use App\Models\Admin;

class AdminPolicy
{
    private function isSuperAdmin(Admin $admin): bool
    {
        return $admin->role === 'superadmin';
    }

    public function viewAny(Admin $admin): bool
    {
        return true;
    }

    public function view(Admin $admin, Admin $model): bool
    {
        return true;
    }

    public function create(Admin $admin): bool
    {
        return $this->isSuperAdmin($admin);
    }

    public function update(Admin $admin, Admin $model): bool
    {
        return $this->isSuperAdmin($admin);
    }

    public function delete(Admin $admin, Admin $model): bool
    {
        return $this->isSuperAdmin($admin);
    }
}
