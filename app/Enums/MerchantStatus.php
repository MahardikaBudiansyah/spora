<?php

namespace App\Enums;

enum MerchantStatus: string
{
    case DRAFT = 'draft';
    case PENDING = 'pending';
    case APPROVED = 'approved';
    case REJECTED = 'rejected';
    case BANNED = 'banned';
    case DEACTIVATION_REQUESTED = 'deactivation_requested';

    public function label(): string
    {
        return match ($this) {
            self::DRAFT => 'Melengkapi Data',
            self::PENDING => 'Menunggu Verifikasi',
            self::APPROVED => 'Terverifikasi',
            self::REJECTED => 'Pendaftaran Ditolak',
            self::BANNED => 'Akun Diblokir',
            self::DEACTIVATION_REQUESTED => 'Pengajuan Hapus Akun',
        };
    }
}
