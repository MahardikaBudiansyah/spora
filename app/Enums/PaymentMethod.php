<?php

namespace App\Enums;

enum PaymentMethod: string {
    case CASH = 'cash';
    case TRANSFER = 'transfer';
    case GATEWAY = 'gateway';
    case QRIS = 'qris';
    case OTHER = 'other';

    public function label(): string {
        return match($this) {
            self::CASH => 'Tunai (Cash)',
            self::TRANSFER => 'Transfer Bank',
            self::GATEWAY => 'Payment Gateway',
            self::QRIS => 'QRIS',
            self::OTHER => 'Lainnya',
        };
    }
}