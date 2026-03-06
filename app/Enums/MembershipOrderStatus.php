<?php

namespace App\Enums;

enum MembershipOrderStatus: string
{
    case PENDING = 'pending';
    case ACTIVE = 'active'; 
    case QUEUED = 'queued'; 
    case FAILED = 'failed';
    case EXPIRED = 'expired';
    case CANCELLED = 'cancelled';

    public function label(): string
    {
        return match($this) {
            self::PENDING => 'Menunggu Pembayaran',
            self::ACTIVE => 'Aktif',
            self::QUEUED => 'Dalam Antrian',
            self::FAILED => 'Gagal',
            self::EXPIRED => 'Sudah Berakhir',
            self::CANCELLED => 'Dibatalkan',
        };
    }

    public function isPaid(): bool
    {
        return in_array($this, [self::ACTIVE, self::QUEUED]);
    }

    public function canBeActivated(): bool
    {
        return $this === self::PENDING;
    }
}