<?php

namespace App\Enums;

enum InvoiceStatus: string {
    case UNPAID = 'unpaid';
    case PARTIAL = 'partial';
    case PAID = 'paid';

    public function label(): string {
        return match($this) {
            self::UNPAID => 'Belum Dibayar',
            self::PARTIAL => 'Dibayar Sebagian',
            self::PAID => 'Lunas',
        };
    }

    public function isFullyPaid(): bool {
        return $this === self::PAID;
    }
}