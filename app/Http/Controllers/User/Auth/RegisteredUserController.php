<?php

namespace App\Http\Controllers\User\Auth;

use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use App\Helpers\NumberPhoneHelper;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\RedirectResponse;
use Illuminate\Auth\Events\Registered;
use App\Providers\RouteServiceProvider;
use App\Http\Requests\User\Auth\RegisterRequest;

class RegisteredUserController extends Controller
{
    /**
     * Show user registration page.
     */
    public function create(): Response
    {
        return Inertia::render('User/Auth/Register');
    }

    /**
     * Handle user registration.
     */
    public function store(RegisterRequest $request): RedirectResponse
    {
        $identifier = $request->identifier;
        $email = filter_var($identifier, FILTER_VALIDATE_EMAIL) ? $identifier : null;
        $phone_number = $email ? null : NumberPhoneHelper::normalize($identifier);

        // Cek apakah user sudah ada (dengan soft delete)
        $user = User::withTrashed()
            ->when($email, fn($q) => $q->where('email', $email))
            ->when($phone_number, fn($q) => $q->where('phone_number', $phone_number))
            ->first();

        if ($user) {
            $updateData = [
                'name' => $request->name,
                'password' => Hash::make($request->password),
            ];

            if ($user->trashed()) {
                $user->restore();
            }

            $user->update($updateData);
        } else {
            $user = User::create([
                'name' => $request->name,
                'email' => $email,
                'phone_number' => $phone_number,
                'password' => Hash::make($request->password),
            ]);
        }

        event(new Registered($user));

        session()->flash('registered_identifier', $identifier);
        session()->flash('registered_password', $request->password);
        session()->flash('registration_success', true);

        return redirect()->intended(RouteServiceProvider::HOME);
    }

    /**
     * Check if email/phone already used.
     */
    public function checkIdentifier(Request $request)
    {
        $request->validate([
            'identifier' => 'required|string',
        ]);

        $identifier = $request->identifier;
        $isEmail = filter_var($identifier, FILTER_VALIDATE_EMAIL);

        $query = User::withTrashed();
        $user = $isEmail
            ? $query->where('email', $identifier)->first()
            : $query->where('phone_number', $identifier)->first();

        if ($user && !$user->trashed()) {
            return response()->json([
                'status' => 'exists',
                'message' => 'Akun sudah terdaftar.',
            ], 409);
        }

        if ($user && $user->trashed()) {
            return response()->json([
                'status' => 'soft_deleted',
                'message' => 'Akun Anda sebelumnya terhapus.',
                'name' => $user->name,
            ]);
        }

        return response()->json([
            'status' => 'new',
            'message' => 'Akun belum terdaftar.',
        ]);
    }
}
