<?php

namespace App\Helpers;

class InvoiceHelper
{
    /**
     * Generate unique invoice number
     *
     * @return string
     */
    public static function generateInvoiceNo(): string
    {
        $prefix = "INV";
        $date   = now()->format('Ymd');
        $random = strtoupper(substr(uniqid(), -6));

        return "{$prefix}-{$date}-{$random}";
    }
}
