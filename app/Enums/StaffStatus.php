<?php

namespace App\Enums;

enum StaffStatus: string
{
    case ACTIVE = 'active';
    case INACTIVE = 'inactive';
    case RESIGNED = 'resign';
    case BANNED = 'banned';
    case DEACTIVATION_REQUESTED = 'deactivation_requested';

    public function label(): string
    {
        return match ($this) {
            self::ACTIVE => 'Aktif',
            self::INACTIVE => 'Tidak Aktif',
            self::BANNED => 'Diblokir',
            self::RESIGNED => 'Keluar',
            self::DEACTIVATION_REQUESTED => 'Pengajuan Hapus Akun',
        };
    }
}
