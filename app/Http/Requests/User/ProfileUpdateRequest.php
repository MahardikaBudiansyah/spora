<?php

namespace App\Http\Requests\User;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'username' => [
                'nullable',
                'string',
                'max:255',
                'alpha_dash',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],
            'phone_number' => [
                'nullable',
                'string',
                'regex:/^[0-9]{9,15}$/',
                function ($attribute, $value, $fail) {
                    if ($this->user()->phone_number !== null && $value !== $this->user()->phone_number) {
                        $fail('Nomor handphone tidak dapat diubah setelah disetel.');
                    }
                },
            ],
            'email' => [
                'nullable',
                'email',
                function ($attribute, $value, $fail) {
                    if ($this->user()->email !== null && $value !== $this->user()->email) {
                        $fail('Email tidak dapat diubah setelah disetel.');
                    }
                },
            ],
            'photo' => ['nullable', 'image', 'max:2048'], 
        ];
    }
}
