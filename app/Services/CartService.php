<?php

namespace App\Services;

use App\Models\Cart;
use Illuminate\Support\Facades\DB;

class CartService
{
    /**
     * Hapus cart biasa (tanpa pindah ke history)
     */
    public function deleteCarts(array $cartIds): void
    {
        Cart::whereIn('id', $cartIds)->delete();
    }

    /**
     * Tambahkan cart baru
     */
    public function addCart(array $data): Cart
    {
        return Cart::create($data);
    }

    // Bisa ditambahkan method lain: updateCart, getUserCart, dll
}
