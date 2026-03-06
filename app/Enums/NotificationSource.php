<?php

namespace App\Enums;

enum NotificationSource: string
{
    case PLATFORM = 'platform';
    case SYSTEM = 'system';
    case MIDTRANS = 'midtrans';
    case XENDIT = 'xendit';
    case ADMIN = 'admin';
    case USER = 'user';
    case MERCHANT = 'merchant';
    case STAFF = 'staff';
    case VENUE = 'venue';

    public function label(): string
    {
        return match ($this) {
            self::PLATFORM => 'Spora Official',
            self::SYSTEM => 'System',
            self::MIDTRANS => 'Payment Gateway Midtrans',
            self::XENDIT => 'Payment Gateway Xendit',
            self::ADMIN => 'Admin Spora',
            self::USER => 'Konsumen',
            self::MERCHANT => 'Mitra Spora',
            self::STAFF => 'Staff Mitra',
            self::VENUE => 'Venue Mitra',
        };
    }
}
