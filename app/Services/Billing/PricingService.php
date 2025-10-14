<?php

namespace App\Services\Billing;

use Log;
use App\Models\Field;
use App\Models\TimeSlot;

class PricingService
{
    /**
     * Hitung harga asli per slot (field + timeSlot + date).
     */
    public function getPrice(Field $field, ?TimeSlot $timeSlot, string $date): float
    {
        Log::info('GetPrice Debug | Field: '.$field->id.' | TimeSlot: '.$timeSlot->id.' | Date: '.$date);

        // Untuk sementara, anggap harga langsung dari field / timeSlot
        // Bisa dikembangkan: weekend pricing, dynamic pricing, dsb
        Log::info('Field base_price: '.$field->base_price.' | TimeSlot price: '.$timeSlot->price);
        return $timeSlot?->price ?? $field->base_price ?? 0;

    }

    /**
     * Hitung total harga asli dari collection carts.
     */
    public function calculateOriginalTotal($carts): float
    {
        return $carts->sum('price');
    }
}
