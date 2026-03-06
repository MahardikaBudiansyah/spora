<?php

namespace App\Http\Requests\Merchant;

use App\Enums\PayoutMethodType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class MerchantPayoutMethodUpdateRequest extends FormRequest
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
    public function rules(): array
    {
        return [
            'type' => ['nullable', new Enum(PayoutMethodType::class)],
            'provider_name' => 'required|string|max:255',
            'account_number' => 'required|string|max:50',
            'account_holder_name' => 'required|string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'type.required' => 'Tipe Pencairan Dana (Rekening) wajib dipilih.',
            'provider_name.required' => 'Nama bank atau penyedia e-wallet wajib diisi.',
            'account_number.required' => 'Nomor rekening atau nomor akun wajib diisi.',
            'account_holder_name.required' => 'Nama pemilik rekening wajib diisi.',
        ];
    }
}
