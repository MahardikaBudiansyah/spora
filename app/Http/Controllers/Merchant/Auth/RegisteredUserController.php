<?php

namespace App\Http\Controllers\Merchant\Auth;

use App\Enums\MerchantOwnerStatus;
use App\Enums\MerchantPayoutMethodStatus;
use App\Enums\MerchantProfileStatus;
use App\Enums\MerchantStatus;
use App\Helpers\NumberPhoneHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\Merchant\Auth\RegisterMerchantRequest;
use App\Models\Admin;
use App\Models\Merchant;
use App\Notifications\Admin\NewMerchantRegisteredNotification;
use App\Notifications\Merchant\WelcomeMerchantNotification;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Inertia\Inertia;
use Inertia\Response;


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
        $validated = $request->validated();

        $email = $request->email;
        $phone_number = NumberPhoneHelper::normalize($request->phone_number);

        $existingMerchant = Merchant::withTrashed()->where('email', $email)->first();
        if ($existingMerchant) {
            if ($existingMerchant->trashed()) {
                return redirect()->route('merchant.recovery')->with([
                    'identifier' => $email,
                    'name' => $existingMerchant->name,
                    'status' => 'soft_deleted',
                ]);
            }
            return redirect()->back()->withErrors(['email' => 'Email sudah terdaftar.']);
        }

        $admins = Admin::all();

        try {
            $merchant = DB::transaction(function () use ($validated, $phone_number, $email, $admins) {
                $merchant = Merchant::create([
                    'name' => $validated['name'],
                    'phone_number' => $phone_number,
                    'email' => $email,
                    'password' => Hash::make($validated['password']),
                    'email_verified_at' => now(),
                    'phone_verified_at' => now(),
                    'status' => MerchantStatus::DRAFT,
                ]);

                $merchant->profileSubmission()->create(['status' => MerchantProfileStatus::DRAFT]);
                $merchant->ownerSubmission()->create(['status' => MerchantOwnerStatus::DRAFT]);

                $merchant->payoutMethodSubmissions()->create([
                    'type' => 'bank',
                    'provider_name' => '',
                    'account_number' => '',
                    'account_holder_name' => '',
                    'status' => MerchantPayoutMethodStatus::DRAFT,
                    'is_primary' => true,
                ]);

                return $merchant;
            });

            event(new Registered($merchant));

            $merchant->notify(new WelcomeMerchantNotification($merchant));
            Notification::send($admins, new NewMerchantRegisteredNotification($merchant));

            session()->flash('registered_email', $email);
            session()->flash('registration_success', true);
            session()->flash('success', 'Pendaftaran akun mitra berhasil!');

            return redirect()->route('merchant.login')->with([
                'prefill_email' => $email,
                'registration_success' => true,
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->withErrors([
                'email' => 'Terjadi kesalahan sistem saat mendaftar. Silakan coba lagi.'
            ]);
        }
    }
}
