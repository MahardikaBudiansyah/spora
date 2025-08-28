<?php

namespace App\Http\Requests\Staff\Auth;

use Illuminate\Support\Str;
use App\Helpers\NumberPhoneHelper;
use Illuminate\Auth\Events\Lockout;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
{
    /**
     * Tentukan apakah user diizinkan membuat request ini
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Rules validasi login staff
     */
    public function rules(): array
    {
        return [
            'phone_number' => ['required', 'regex:/^08[0-9]{8,13}$/'], 
            'password' => ['required'],
            'remember' => ['boolean'],
        ];
    }

    /**
     * Proses autentikasi
     */
    public function authenticate(): void
    {
        $this->ensureIsNotRateLimited();

        // Normalisasi nomor HP sebelum attempt
        $phone = NumberPhoneHelper::normalize($this->input('phone_number'));

        if (! Auth::guard('staff')->attempt(
            ['phone_number' => $phone, 'password' => $this->input('password')],
            $this->boolean('remember')
        )) {
            RateLimiter::hit($this->throttleKey());

            throw ValidationException::withMessages([
                'phone_number' => trans('auth.failed_phone_number'),
            ]);
        }

        RateLimiter::clear($this->throttleKey());
    }

    /**
     * Cek rate limit login
     */
    public function ensureIsNotRateLimited(): void
    {
        if (!RateLimiter::tooManyAttempts($this->throttleKey(), 3)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'phone_number' => trans('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    /**
     * Key untuk rate limiter (gabungan nomor HP + IP)
     */
    public function throttleKey(): string
    {
        return Str::lower($this->input('phone_number')) . '|' . $this->ip();
    }
}
