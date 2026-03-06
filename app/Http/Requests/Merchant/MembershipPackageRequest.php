<?php

namespace App\Http\Requests\Merchant;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MembershipPackageRequest extends FormRequest
{
    public function authorize(): bool
    {
        $venue = $this->route('venue');
        
        if (!$venue) {
            return true; 
        }

        return $this->user()->can('update', $venue);
    }

    public function rules(): array
    {
        $venueId = $this->route('venue')?->id ?? $this->input('venue_id');

        $packageId = $this->route('package')?->id ?? $this->route('membershipPackages')?->id;

        return [
            'package_name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('membership_packages', 'name')
                    ->where(fn($query) => 
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
            
            'venue_id' => [
                Rule::requiredIf(!$this->route('venue')),
                'exists:venues,id'
            ]
        ];
    }

    public function messages(): array
    {
        return [
            'package_name.required' => 'Nama paket wajib diisi.',
            'package_name.unique' => 'Nama paket sudah digunakan di venue ini.',
            'discount_type.required_with' => 'Tipe diskon wajib dipilih jika nama diskon diisi.',
            'discount_value.required_with' => 'Nilai diskon wajib diisi jika nama diskon diisi.',
        ];
    }
}