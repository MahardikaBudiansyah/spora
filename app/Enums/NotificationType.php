<?php

namespace App\Enums;

enum NotificationType: string
{
    // Terkait Booking
    case BOOKING_CREATED = 'booking_created';
    case BOOKING_CONFIRMED = 'booking_confirmed';
    case BOOKING_CANCELLED = 'booking_cancelled';

    // Terkait Pembayaran
    case PAYMENT_SUCCESS = 'payment_success';
    case PAYMENT_FAILED = 'payment_failed';
    case PAYMENT_REMINDER = 'payment_reminder';

    // Terkait Membership
    case MEMBERSHIP_ACTIVATED = 'membership_activated';
    case MEMBERSHIP_EXPIRED = 'membership_expired';

    public function label(): string
    {
        return match($this) {
            self::BOOKING_CREATED => 'Pesanan Baru Dibuat',
            self::PAYMENT_SUCCESS => 'Pembayaran Berhasil',
            self::MEMBERSHIP_EXPIRED => 'Masa Member Habis',
            // ... tambahkan label lainnya sesuai kebutuhan
            default => 'Notifikasi Sistem',
        };
    }
}