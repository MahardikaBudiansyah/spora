<?php

namespace App\Http\Controllers\Merchant\Auth;

use Inertia\Inertia;
use Inertia\Response;
use App\Models\Merchant;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules;
use App\Helpers\NumberPhoneHelper;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\RedirectResponse;
use Illuminate\Auth\Events\Registered;
use App\Providers\RouteServiceProvider;
use App\Http\Requests\Merchant\Auth\RegisterMerchantRequest;


class RegisteredUserController extends Controller
{
    /**
     * Show partner registration page.
     */
    public function create(): Response
    {
        return Inertia::render('Merchant/Auth/Register');
    }

    /**
     * Handle partner registration.
     */
    public function store(RegisterMerchantRequest $request)
    {
        $request->validated();

        $name = $request->name;
        $email = $request->email;
        $phone_number = NumberPhoneHelper::normalize($request->phone_number);

        // Cek apakah email sudah pernah digunakan (termasuk yang soft deleted)
        $merchant = Merchant::withTrashed()->where('email', $email)->first();

        if ($merchant) {
            if ($merchant->trashed()) {
                return redirect()->route('merchant$merchant.recovery')->with([
                    'identifier' => $email,
                    'name' => $merchant->name,
                    'status' => 'soft_deleted',
                ]);
            }

            return redirect()->back()->withErrors([
                'email' => 'Email sudah terdaftar.',
            ]);
        }

        $merchant = Merchant::create([
            'name' => $name,
            'phone_number' => $phone_number,
            'email' => $email,
            'email_verified_at' => null,
            'password' => Hash::make($request->password),
        ]);

        event(new Registered($merchant));

        session()->flash('registered_email', $email);
        session()->flash('registration_success', true);

        return Inertia::render('Merchant/Auth/Login', [
            'prefill' => ['email' => $email],
            'registration_success' => true,
        ]);

    }

}
