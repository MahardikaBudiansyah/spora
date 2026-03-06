<?php

namespace App\Enums;

enum VenueStatus: string
{
    case DRAFT = 'draft';
    case PENDING = 'pending';
    case APPROVED = 'approved';
    case REJECTED = 'rejected';

    public function label(): string
    {
        return match ($this) {
            self::DRAFT => 'Proses Melengkapi Data',
            self::PENDING => 'Menunggu Verifikasi',
            self::APPROVED => 'Terverifikasi',
            self::REJECTED => 'Pendaftaran Ditolak',
        };
    }
}
