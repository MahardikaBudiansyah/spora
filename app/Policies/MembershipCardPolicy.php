<?php

namespace App\Policies;

use App\Models\Admin;
use App\Models\Venue;
use App\Models\Merchant;
use App\Models\MembershipCard;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Auth\Access\Response;
use Illuminate\Auth\Access\HandlesAuthorization;

class MembershipCardPolicy
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

    public function view(Authenticatable $user, MembershipCard $card): Response
    {
        if ($user instanceof Merchant) {
            return $card->venue?->merchant_id === $user->id
                ? Response::allow()
                : Response::deny('Kartu Member ini bukan milik venue di bawah naungan Anda.');
        }

        return Response::deny('Akses ditolak.');
    }

    public function create(Authenticatable $user, Venue $venue): Response
    {
        if ($user instanceof Merchant) {
            return $venue->merchant_id === $user->id
                ? Response::allow()
                : Response::deny('Anda hanya bisa membuat kartu member untuk venue milik sendiri.');
        }
        
        return Response::deny('Hanya Merchant yang dapat membuat kartu member.');
    }

    public function update(Authenticatable $user, MembershipCard $card): Response
    {
        if ($user instanceof Merchant) {
            return $card->venue?->merchant_id === $user->id
                ? Response::allow()
                : Response::deny('Anda tidak memiliki izin untuk mengedit kartu member ini.');
        }
        return Response::deny('Akses ditolak.');
    }

    public function toggleActive(Authenticatable $user, MembershipCard $card): Response
    {
        return $this->update($user, $card);
    }

    public function delete(Authenticatable $user, MembershipCard $card): Response
    {
        if ($user instanceof Merchant) {
            return $card->venue?->merchant_id === $user->id
                ? Response::allow()
                : Response::deny('Anda tidak memiliki izin untuk menghapus kartu member ini.');
        }
        return Response::deny('Akses ditolak.');
    }
}