<?php

namespace App\Http\Controllers\Staff\Auth;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\Staff\Auth\LoginRequest;

class AuthenticatedSessionController extends Controller
{
    /**
     * Tampilkan halaman login staff
     */
    public function create()
    {
        return Inertia::render('Merchant/Staff/Auth/Login', [
            'prefill' => [
                'phone_number' => session('phone_number'),
                'registration_success' => session('registration_success')
            ],
        ]);
    }

    /**
     * Proses login staff
     */
    public function store(LoginRequest $request)
    {
        $request->authenticate();

        $request->session()->regenerate();

        return redirect()->intended(route('staff.dashboard'));
    }

    /**
     * Logout staff
     */
    public function destroy(Request $request)
    {
        Auth::guard('staff')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('staff.login');
    }
}
