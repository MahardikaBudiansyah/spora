<?php

namespace App\Http\Requests\Merchant;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MerchantMembershipPackageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth('merchant')->check();
    }

    public function rules(): array
    {
        $packageId = $this->route('membership_package')?->id;
        
        $venueId = $this->input('venue_id') ?? $this->route('membership_package')?->venue_id;

        return [
            'venue_id' => [
                Rule::requiredIf(!$packageId),
                'exists:venues,id,merchant_id,' . auth('merchant')->id()
            ],

            'package_name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('membership_packages', 'name')
                    ->where(fn ($query) => 
                        $query->where('venue_id', $venueId)
                            ->whereNull('deleted_at')
                    )
                    ->ignore($packageId),
            ],
            
            'package_duration_months' => 'required|integer|min:1',
            'package_price' => 'required|numeric|min:0',
            'package_descriptions' => 'nullable|string|max:1000',

            'discount_name' => 'nullable|string|max:255',
            'discount_type' => 'required_with:discount_name|nullable|in:percentage,fixed',
            'discount_value' => 'required_with:discount_name|nullable|numeric|min:0',
            'discount_limit' => 'nullable|integer|min:0',
            'discount_descriptions' => 'nullable|string|max:1000',

            'other_name' => 'nullable|string|max:255',
            'other_descriptions' => 'nullable|string|max:1000',
        ];
    }

    public function messages(): array
    {
        return [
            'package_name.required' => 'Nama paket wajib diisi.',
            'package_name.unique' => 'Nama paket sudah terdaftar di venue ini.',
            'package_duration_months.required' => 'Durasi paket wajib diisi.',
            'package_price.required' => 'Harga paket wajib diisi.',
            'discount_type.required_with' => 'Tipe diskon harus dipilih jika nama diskon diisi.',
            'discount_value.required_with' => 'Nilai diskon harus diisi jika nama diskon diisi.',
            'venue_id.exists' => 'Venue tidak valid atau bukan milik Anda.',
        ];
    }
}