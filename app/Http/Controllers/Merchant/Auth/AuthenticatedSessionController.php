<?php

namespace App\Http\Controllers\Merchant\Auth;

use Log;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\Merchant\Auth\LoginRequest;

class AuthenticatedSessionController extends Controller
{
    public function create() {
        return Inertia::render('Merchant/Auth/Login', [
            'prefill' => [
                'email' => session('registered_email'),
                'registration_success' => session('registration_success')
            ],
        ]);
    }

    public function store(LoginRequest $request)
    {
        $request->authenticate();

        $request->session()->regenerate();

        return redirect()->intended(route('merchant.dashboard'));
    }

    public function destroy(Request $request)
    {
        Auth::guard('merchant')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('merchant.login');
    }
}
