<?php

namespace App\Enums;

enum PaymentType: string {
    case DP = 'down_payment';
    case FULL = 'full_payment';

    public function label(): string {
        return match($this) {
            self::DP => 'Uang Muka (DP)',
            self::FULL => 'Pelunasan / Bayar Penuh',
        };
    }
}