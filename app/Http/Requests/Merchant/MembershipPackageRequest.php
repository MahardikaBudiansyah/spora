<?php

namespace App\Http\Requests\Merchant;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MembershipPackageRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Pastikan user memiliki hak untuk mengelola venue
        $venue = $this->route('venue');
        return $this->user()->can('update', $venue);
    }

    public function rules(): array
    {
        $venueId = $this->route('venue')->id;

        return [
            'package_name' => [
                'required',
                'string',
                'max:255',
                // Nama paket harus unik di venue ini
                Rule::unique('membership_packages', 'name')
                    ->where(fn($query) => $query->where('venue_id', $venueId))
                    ->ignore($this->route('package')?->id),
            ],
            'package_duration_months' => 'required|integer|min:1',
            'package_price' => 'required|numeric|min:0',
            'package_descriptions' => 'nullable|string|max:1000',

            // Diskon
            'discount_name' => 'nullable|string|max:255',
            'discount_type' => 'nullable|in:percentage,nominal',
            'discount_value' => 'nullable|numeric|min:0',
            'discount_limit' => 'nullable|integer|min:0',
            'discount_descriptions' => 'nullable|string|max:1000',

            // Lainnya
            'other_name' => 'nullable|string|max:255',
            'other_descriptions' => 'nullable|string|max:1000',
        ];
    }

    public function messages(): array
    {
        return [
            'package_name.required' => 'Nama paket wajib diisi.',
            'package_name.unique' => 'Nama paket sudah digunakan di venue ini.',
            'package_duration_months.required' => 'Durasi paket wajib diisi.',
            'package_price.required' => 'Harga paket wajib diisi.',
        ];
    }
}
