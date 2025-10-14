<?php

namespace App\Helpers;

class PaymentHelper
{
    /**
     * Generate unique payment number (gateway_order_id)
     *
     * Format: PAY-YYYYMMDD-RANDOM
     *
     * @param string $prefix
     * @return string
     */
    public static function generatePaymentNo(string $prefix = 'PAY'): string
    {
        $prefix = strtoupper($prefix);
        $date   = now()->format('Ymd'); // YYYYMMDD
        $random = strtoupper(substr(uniqid(), -6));

        return "{$prefix}-{$date}-{$random}";
    }
}
