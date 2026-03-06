<?php

namespace App\Enums;

enum UserStatus: string
{
    case PENDING = 'pending';
    case VERIFIED = 'verified';
    case BANNED = 'banned';
    case DEACTIVATION_REQUESTED = 'deactivation_requested';

    public function label(): string
    {
        return match ($this) {
            self::PENDING => 'Menunggu Verifikasi',
            self::VERIFIED => 'Terverifikasi',
            self::BANNED => 'Diblokir',
            self::DEACTIVATION_REQUESTED => 'Pengajuan Hapus Akun',
        };
    }
}
