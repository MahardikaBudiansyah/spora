<?php

namespace App\Services\Billing;

class DiscountService
{
    /**
     * Hitung diskon untuk 1 item.
     */
    public function calculateItemDiscount(
        float $price,
        ?array $discount,
        ?int $discountLimit,
        ?int &$remainingLimit // by reference biar terupdate
    ): float {
        if (!$discount || $remainingLimit === 0) {
            return 0;
        }

        $discountAmount = 0;

        if ($discount['type'] === 'percentage') {
            $discountAmount = ($price * $discount['value']) / 100;
        } elseif ($discount['type'] === 'fixed') {
            $discountAmount = min($discount['value'], $price);
        }

        // Kurangi limit setelah dipakai
        if ($remainingLimit !== null) {
            $remainingLimit--;
        }

        return $discountAmount;
    }

    /**
     * Hitung total diskon dari semua cart.
     */
    public function calculateDiscount(
        $carts,
        ?array $discount,
        ?int $discountLimit,
        ?int $remainingLimit
    ): float {
        $totalDiscount = 0;

        foreach ($carts as $cart) {
            $totalDiscount += $this->calculateItemDiscount(
                $cart->price,
                $discount,
                $discountLimit,
                $remainingLimit
            );
        }

        return $totalDiscount;
    }
}
