<?php

namespace App\Enums;

enum MerchantProfileStatus: string
{
    case DRAFT = 'draft';
    case PENDING = 'pending';
    case APPROVED = 'approved';
    case REJECTED = 'rejected';

    public function label(): string
    {
        return match ($this) {
            self::DRAFT => 'Melengkapi Data',
            self::PENDING => 'Menunggu Review',
            self::APPROVED => 'Identitas Valid',
            self::REJECTED => 'Identitas Tidak Cocok',
        };
    }
}
