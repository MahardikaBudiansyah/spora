<?php

namespace App\Enums;

enum BusinessType: string
{
    case INDIVIDUAL = 'individual';
    case ENTITY = 'entity';

    public function label(): string
    {
        return match ($this) {
            self::INDIVIDUAL => 'Perseorangan',
            self::ENTITY => 'Badan Usaha',
        };
    }
}
