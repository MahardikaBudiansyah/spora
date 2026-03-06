<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserProfileIsComplete
{
    public function handle(Request $request, Closure $next)
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        if (empty($user->email) || empty($user->phone_number) || empty($user->name)) {
            $currentRouteName = $request->route()->getName();

            // Jangan sampai redirect loop
            if (!in_array($currentRouteName, ['user.profile.edit', 'user.profile.update'])) {
                return redirect()
                    ->route('user.profile.edit')
                    ->with('warning', 'Lengkapi profil terlebih dahulu sebelum melanjutkan booking.');
            }
        }

        return $next($request);
    }
}