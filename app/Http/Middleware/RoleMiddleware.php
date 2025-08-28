<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        // Tentukan guard aktif
        $guard = null;
        if (auth('staff')->check()) {
            $guard = 'staff';
        } elseif (auth('merchant')->check()) {
            $guard = 'merchant';
        } elseif (auth('web')->check()) { // konsumen
            $guard = 'web';
        }

        if (!$guard) {
            abort(403, 'Unauthorized: no guard authenticated');
        }

        $user = auth($guard)->user();

        // Kalau tidak ada role yang dipassing → semua boleh
        if (empty($roles)) {
            return $next($request);
        }

        if ($guard === 'staff') {
            // pastikan staff aktif
            if (! $user->isActive()) {
                abort(403, 'Your account is inactive.');
            }

            // gunakan helper hasRole() → lebih bersih
            if (! $user->hasRole($roles)) {
                abort(403, 'You do not have the required staff role.');
            }
        }

        return $next($request);
    }
}
