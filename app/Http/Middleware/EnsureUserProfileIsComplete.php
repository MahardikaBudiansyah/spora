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

        if (!$user->email || !$user->phone_number || !$user->name) {
            $currentRouteName = $request->route()->getName();

            if (!in_array($currentRouteName, ['user.profile.edit', 'user.profile.update'])) {
                return redirect()->route('user.profile.edit')
                    ->with('message', 'Lengkapi profil terlebih dahulu.');
            }
        }

        return $next($request);
    }
}
