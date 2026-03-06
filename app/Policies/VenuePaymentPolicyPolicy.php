<?php

namespace App\Policies;

use App\Models\Admin;
use App\Models\Merchant;
use App\Models\Venue;
use Illuminate\Auth\Access\Response;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Contracts\Auth\Authenticatable;

class VenuePaymentPolicyPolicy
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
        if ($user instanceof Merchant) {
            return $user->status === 'active';
        }
        return false;
    }

    public function update(Authenticatable $user, Venue $venue): Response
    {
        if ($user instanceof Merchant) {
            return $venue->merchant_id === $user->id
                ? Response::allow()
                : Response::deny('Anda tidak memiliki izin untuk mengubah kebijakan pembayaran pada venue ini.');
        }

        return Response::deny('Akses ditolak.');
    }
}
