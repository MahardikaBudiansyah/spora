<?php

namespace App\Enums;

enum AddressLabel: string
{
    case PRIMARY = 'primary';
    case BUSINESS = 'business';
    case LEGAL = 'legal';
    case OTHER = 'other';

    public function label(): string
    {
        return match ($this) {
            self::PRIMARY => 'Rumah',
            self::BUSINESS => 'Kantor',
            self::LEGAL => 'Identitas (KTP)',
            self::OTHER => 'Lainnya',
        };
    }
}
