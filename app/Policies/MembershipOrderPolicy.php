<?php

namespace App\Policies;

use App\Models\Admin;
use App\Models\Venue;
use App\Models\Merchant;
use App\Models\MembershipOrder;
use App\Models\MembershipCard;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Auth\Access\Response;
use Illuminate\Auth\Access\HandlesAuthorization;

class MembershipOrderPolicy
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

    public function view(Authenticatable $user, MembershipOrder $order): Response
    {
        if ($user instanceof Merchant) {
            return $order->venue?->merchant_id === $user->id
                ? Response::allow()
                : Response::deny('Order ini bukan milik venue di bawah naungan Anda.');
        }

        return Response::deny('Akses ditolak.');
    }

    public function create(Authenticatable $user, ?MembershipCard $card = null): Response
    {
        if ($user instanceof Merchant) {
            if ($card) {
                return $card->venue?->merchant_id === $user->id
                    ? Response::allow()
                    : Response::deny('Anda tidak bisa membuat order untuk kartu member di luar venue Anda.');
            }

            return Response::allow();
        }
        
        return Response::deny('Hanya Merchant yang dapat memproses order membership.');
    }

    public function update(Authenticatable $user, MembershipOrder $order): Response
    {
        if ($user instanceof Merchant) {
            if ($order->venue?->merchant_id !== $user->id) {
                return Response::deny('Anda tidak memiliki izin untuk mengelola order ini.');
            }

            if ($order->status === 'success') {
                return Response::deny('Order yang sudah sukses tidak dapat diubah lagi.');
            }

            return Response::allow();
        }
        return Response::deny('Akses ditolak.');
    }

    public function delete(Authenticatable $user, MembershipOrder $order): Response
    {
        if ($user instanceof Merchant) {
            return $order->venue?->merchant_id === $user->id
                ? Response::allow()
                : Response::deny('Anda tidak memiliki izin untuk menghapus order ini.');
        }
        return Response::deny('Akses ditolak.');
    }
}