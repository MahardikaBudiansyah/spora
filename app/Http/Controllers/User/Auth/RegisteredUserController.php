<?php

namespace App\Http\Controllers\User\Auth;

use App\Helpers\NumberPhoneHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\User\Auth\RegisterRequest;
use App\Models\Admin;
use App\Models\User;
use App\Notifications\Admin\NewUserRegisteredNotification;
use App\Notifications\User\WelcomeUserNotification;
use App\Providers\RouteServiceProvider;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('User/Auth/Register');
    }

    public function store(RegisterRequest $request)
    {
        $identifier = $request->identifier;
        $email = filter_var($identifier, FILTER_VALIDATE_EMAIL) ? $identifier : null;
        $phone_number = $email ? null : NumberPhoneHelper::normalize($identifier);

        $user = User::withTrashed()
            ->when($email, fn($q) => $q->where('email', $email))
            ->when($phone_number, fn($q) => $q->where('phone_number', $phone_number))
            ->first();

        $verificationData = [
            'email_verified_at' => $email ? now() : null,
            'phone_verified_at' => $phone_number ? now() : null,
        ];

        $admins = Admin::all();

        if ($user) {
            $updateData = array_merge([
                'name' => $request->name,
                'password' => Hash::make($request->password),
            ], $verificationData);

            if ($user->trashed()) {
                $user->restore();
            }

            $user->update($updateData);
        } else {
            $user = User::create(array_merge([
                'name' => $request->name,
                'email' => $email,
                'phone_number' => $phone_number,
                'password' => Hash::make($request->password),
            ], $verificationData));

            event(new Registered($user));

            $user->notify(new WelcomeUserNotification($user));
            Notification::send($admins, new NewUserRegisteredNotification($user));

            session()->flash('registered_identifier', $identifier);
            session()->flash('registered_password', $request->password);
            session()->flash('registration_success', true);

            return redirect()->intended(RouteServiceProvider::HOME);
        }
    }

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
