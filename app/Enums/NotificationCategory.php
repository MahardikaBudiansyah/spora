<?php

namespace App\Enums;

enum NotificationCategory: string
{
    case PROMO = 'promo';
    case ACCOUNT = 'account';
    case TRANSACTION = 'transaction';
    case INFO = 'info';
    case FINANCE = 'finance';

    public function label(): string
    {
        return match ($this) {
            self::PROMO => 'Promo & Penawaran',
            self::ACCOUNT => 'Keamanan & Akun',
            self::TRANSACTION => 'Aktivitas Transaksi',
            self::INFO => 'Berita & Info',
            self::FINANCE => 'Keuangan',
        };
    }
}
