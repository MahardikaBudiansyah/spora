<?php

namespace App\Http\Requests\User\Auth;

use App\Models\User;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */

    public function rules()
    {
        return [
            'name' => ['required', 'string', 'max:255'], // BARU: Tambahkan validasi nama
            'identifier' => [
                'required',
                'string',
                function ($attribute, $value, $fail) {
                    $emailValid = filter_var($value, FILTER_VALIDATE_EMAIL);
                    $phone_numberValid = preg_match('/^(?:\+62|62|0)[0-9]{9,13}$/', $value);

                    if (! $emailValid && ! $phone_numberValid) {
                        $fail('Isi harus berupa email atau nomor HP yang valid.');
                    }
                },
            ],
            'password' => ['required', 'confirmed', Password::defaults()],
        ];
    }

}
