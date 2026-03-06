<?php

namespace App\Enums;

enum BookingStatus: string
{
    case PENDING = 'pending';
    case CONFIRMED = 'confirmed';
    case CANCELLED = 'cancelled';
    case FAILED = 'failed';
    case EXPIRED = 'expired';
    case COMPLETED = 'completed';

    public function label(): string
    {
        return match($this) {
            self::PENDING => 'Menunggu Pembayaran',
            self::CONFIRMED => 'Dikonfirmasi',
            self::CANCELLED => 'Dibatalkan',
            self::FAILED => 'Gagal',
            self::EXPIRED => 'Kedaluwarsa',
            self::COMPLETED => 'Selesai',
        };
    }

    public function isConfirmed(): bool
    {
        return $this === self::CONFIRMED;
    }

    public function canBeCancelled(): bool
    {
        return $this === self::PENDING;
    }

    public function isUnsuccessful(): bool
    {
        return in_array($this, [self::CANCELLED, self::FAILED, self::EXPIRED]);
    }
}