<?php
namespace App\Enums;

enum OrderType: string
{
    case BOOKING = 'booking';
    case MEMBERSHIP = 'membership';

    public function label(): string
    {
        return match($this) {
            self::BOOKING => 'Booking Lapangan',
            self::MEMBERSHIP => 'Membership',
        };
    }
}