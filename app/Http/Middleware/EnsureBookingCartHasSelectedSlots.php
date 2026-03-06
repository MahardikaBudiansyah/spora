<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureBookingCartHasSelectedSlots
{
    public function handle(Request $request, Closure $next)
    {
        $hasCartSession = session()->has('checkout_cart_ids') && !empty(session('checkout_cart_ids'));
        
        $hasSnapToken = session()->has('flash.snap_token') || session()->has('snap_token');

        if (!$hasCartSession && !$hasSnapToken) {
            return redirect()->route('user.dashboard')->with('error', 'Sesi checkout telah berakhir.');
        }

        return $next($request);
    }

}
