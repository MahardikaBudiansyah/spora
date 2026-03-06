<?php

namespace App\Enums;

enum PayoutMethodType: string
{
    case BAMK = 'bank';
    case EWALLET = 'ewallet';

    public function label(): string
    {
        return match ($this) {
            self::BAMK => 'Laki-laki',
            self::EWALLET => 'Perempuan',
        };
    }
}
