<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureBookingCartHasSelectedSlots
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */

    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();
        $carts = $user->carts;

        if ($carts->isEmpty()) {
            return redirect()->route('home')->with('error', 'Pilih slot terlebih dahulu.');
        }

        return $next($request);
    }

}
