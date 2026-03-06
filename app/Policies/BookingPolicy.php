<?php

namespace App\Policies;

use App\Models\Admin;
use App\Models\Venue;
use App\Models\Booking;
use App\Models\Merchant;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Auth\Access\Response;
use Illuminate\Auth\Access\HandlesAuthorization;

class BookingPolicy
{
    use HandlesAuthorization;

    /**
     * Admin memiliki akses penuh ke segala aksi.
     */
    public function before(Authenticatable $user, string $ability): ?bool
    {
        if ($user instanceof Admin) { 
            return true;
        }
        return null; 
    }

    /**
     * Merchant atau Admin bisa melihat index booking secara umum.
     */
    public function viewAny(Authenticatable $user): bool
    {
        return $user instanceof Merchant;
    }

    /**
     * Memberikan izin jika booking tersebut berasal dari venue milik merchant yang bersangkutan.
     */
    public function view(Authenticatable $user, Booking $booking): Response
    {
        if ($user instanceof Merchant) {
            return $booking->venue?->merchant_id === $user->id
                ? Response::allow()
                : Response::deny('Booking ini bukan milik venue di bawah naungan Anda.');
        }

        return Response::deny('Akses ditolak.');
    }

    /**
     * Merchant bisa membuat booking (lewat panel dashboard merchant).
     * Jika parameter venue diberikan, pastikan venue itu milik merchant tersebut.
     */
    public function create(Authenticatable $user, ?Venue $venue = null): Response
    {
        if ($user instanceof Merchant) {
            if ($venue) {
                return $venue->merchant_id === $user->id
                    ? Response::allow()
                    : Response::deny('Anda tidak bisa membuat booking untuk venue di luar akun Anda.');
            }

            return Response::allow();
        }
        
        return Response::deny('Hanya Merchant yang dapat memproses order booking.');
    }

    /**
     * Update hanya diperbolehkan jika status belum 'completed' atau 'cancelled',
     * dan tentu saja harus milik merchant yang bersangkutan.
     */
    public function update(Authenticatable $user, Booking $booking): Response
    {
        if ($user instanceof Merchant) {
            if ($booking->venue?->merchant_id !== $user->id) {
                return Response::deny('Anda tidak memiliki izin untuk mengelola booking ini.');
            }

            // Aturan bisnis: Booking yang sudah selesai atau batal tidak boleh diedit sembarangan
            if (in_array($booking->status, ['completed', 'cancelled', 'failed'])) {
                return Response::deny('Booking dengan status ' . $booking->status . ' tidak dapat diubah lagi.');
            }

            return Response::allow();
        }
        return Response::deny('Akses ditolak.');
    }

    /**
     * Delete biasanya digunakan untuk pembatalan atau penghapusan record non-aktif.
     */
    public function delete(Authenticatable $user, Booking $booking): Response
    {
        if ($user instanceof Merchant) {
            return $booking->venue?->merchant_id === $user->id
                ? Response::allow()
                : Response::deny('Anda tidak memiliki izin untuk menghapus data booking ini.');
        }
        return Response::deny('Akses ditolak.');
    }
}