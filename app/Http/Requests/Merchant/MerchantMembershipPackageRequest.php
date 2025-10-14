<?php

namespace App\Http\Requests\Merchant;

use Illuminate\Foundation\Http\FormRequest;

class MerchantMembershipPackageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth('merchant')->check();
    }

    public function rules(): array
    {
        return [
            'package_name' => 'required|string|max:255',
            'package_duration_months' => 'required|integer|min:1',
            'package_price' => 'required|numeric|min:0',
            'package_descriptions' => 'nullable|string',

            'discount_name' => 'nullable|string|max:255',
            'discount_type' => 'nullable|in:percentage,fixed',
            'discount_value' => 'nullable|numeric',
            'discount_limit' => 'nullable|integer',
            'discount_descriptions' => 'nullable|string',

            'other_name' => 'nullable|string|max:255',
            'other_descriptions' => 'nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'package_name.required' => 'Nama paket wajib diisi.',
            'package_duration_months.required' => 'Durasi paket wajib diisi.',
            'package_price.required' => 'Harga paket wajib diisi.',
            'discount_type.in' => 'Tipe diskon harus berupa percentage atau fixed.',
        ];
    }
}
