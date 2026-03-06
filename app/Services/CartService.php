<?php

namespace App\Services;

use App\Models\Cart;
use Illuminate\Support\Facades\DB;

class CartService
{
    public function addCart(array $data): Cart
    {
        return Cart::create($data);
    }

    public function deleteCarts(array $cartIds, ?int $userId = null): void
    {
        $query = Cart::whereIn('id', $cartIds);
        
        if ($userId) {
            $query->where('user_id', $userId);
        }

        $query->delete();
    }


}
