<?php

namespace App\Enums;

enum PaymentStatus: string {
    case PENDING = 'pending';
    case PAID = 'paid';
    case FAILED = 'failed';
    case REFUNDED = 'refunded';

    public function isSuccess(): bool {
        return $this === self::PAID;
    }

    public function label(): string {
        return match($this) {
            self::PENDING => 'Menunggu Pembayaran',
            self::PAID => 'Sudah Dibayar',
            self::FAILED => 'Gagal',
            self::REFUNDED => 'Dikembalikan (Refund)',
        };
    }
}