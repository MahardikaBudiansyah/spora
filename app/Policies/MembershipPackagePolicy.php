<?php

namespace App\Policies;

use App\Models\Admin;
use App\Models\Merchant;
use App\Models\Venue;
use App\Models\MembershipPackage;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Auth\Access\Response;
use Illuminate\Auth\Access\HandlesAuthorization;

class MembershipPackagePolicy
{
    use HandlesAuthorization;

    public function before(Authenticatable $user, string $ability): ?bool
    {
        if ($user instanceof Admin) {
            return true;
        }
        return null;
    }

    public function viewAny(Authenticatable $user): bool
    {
        return $user instanceof Merchant || $user instanceof Admin;
    }

    public function view(Authenticatable $user, MembershipPackage $package): Response
    {
        if ($user instanceof Merchant) {
            return $package->venue->merchant_id === $user->id
                ? Response::allow()
                : Response::deny('Paket Membership ini bukan milik venue Anda.');
        }

        return Response::deny('Akses ditolak.');
    }

    public function create(Authenticatable $user, Venue $venue): Response
    {
        if ($user instanceof Merchant) {
            return $venue->merchant_id === $user->id
                ? Response::allow()
                : Response::deny('Anda tidak diizinkan menambah paket ke Venue milik orang lain.');
        }

        return Response::deny('Hanya Merchant yang dapat membuat paket membership.');
    }

    public function update(Authenticatable $user, MembershipPackage $package): Response
    {
        if ($user instanceof Merchant) {
            return $package->venue->merchant_id === $user->id
                ? Response::allow()
                : Response::deny('Anda tidak memiliki izin untuk mengedit paket ini.');
        }

        return Response::deny('Akses ditolak.');
    }

    public function toggleActive(Authenticatable $user, MembershipPackage $package): Response
    {
        return $this->update($user, $package);
    }

    public function delete(Authenticatable $user, MembershipPackage $package): Response
    {
        if ($user instanceof Merchant) {
            return $package->venue->merchant_id === $user->id
                ? Response::allow()
                : Response::deny('Anda tidak memiliki izin untuk menghapus paket ini.');
        }

        return Response::deny('Akses ditolak.');
    }
}