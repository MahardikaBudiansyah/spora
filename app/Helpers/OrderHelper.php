<?php

namespace App\Helpers;

class OrderHelper
{
    /**
     * Generate order number untuk transaksi (booking / membership order)
     *
     * Format: {PREFIX}-YYYYMMDD-V{venueId}U{userId}{random}
     *
     * @param string $prefix
     * @param int $venueId
     * @param int $userId
     * @return string
     */
    public static function generateOrderNo(string $prefix = 'ORD', int $venueId, int $userId): string
    {
        $prefix = strtoupper($prefix);
        $date   = now()->format('Ymd');
        $random = strtoupper(substr(uniqid(), -6));

        return "{$prefix}-{$date}-V{$venueId}U{$userId}{$random}";
    }

    /**
     * Generate subscription number (tidak ada userId, pakai merchantId)
     *
     * Format: {PREFIX}-YYYYMMDD-M{merchantId}{random}
     *
     * @param int $merchantId
     * @param string $prefix
     * @return string
     */
    public static function generateSubscriptionNo(int $merchantId, string $prefix = 'SUB'): string
    {
        $prefix = strtoupper($prefix);
        $date   = now()->format('Ymd');
        $random = strtoupper(substr(uniqid(), -6));

        return "{$prefix}-{$date}-M{$merchantId}{$random}";
    }
}
