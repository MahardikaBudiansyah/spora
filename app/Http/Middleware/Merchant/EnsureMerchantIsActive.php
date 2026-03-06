<?php

namespace App\Http\Middleware\Merchant;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureMerchantIsActive
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (auth('merchant')->check() && auth('merchant')->user()->status !== 'active') {
            
            if ($request->routeIs('merchant.dashboard')) {
                return $next($request);
            }

            return redirect()->route('merchant.dashboard')
                ->with('error', 'Akun Anda masih dalam proses verifikasi atau sedang dinonaktifkan.');
        }

        return $next($request);
    }
}
