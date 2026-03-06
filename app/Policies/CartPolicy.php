<?php

namespace App\Policies;

use App\Models\Cart;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class CartPolicy
{
    public function viewAny(User $user): bool
    {
        return true; 
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function delete(User $user, Cart $cart)
    {
        return $user->id === $cart->user_id;
    }

}
