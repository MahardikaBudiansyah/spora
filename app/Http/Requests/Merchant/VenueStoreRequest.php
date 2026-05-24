<?php

namespace App\Http\Requests\Merchant;

use Illuminate\Foundation\Http\FormRequest;

class VenueStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:100',
            'description' => 'nullable|string',
            'phone_number' => 'required|string|max:20',

            'category_ids' => 'required|array|min:1',
            'category_ids.*' => 'exists:venue_categories,id',

            'facility_ids' => 'nullable|array',
            'facility_ids.*' => 'exists:venue_facilities,id',

            'images' => 'required|array|min:1',
            'images.*' => 'image|mimes:jpeg,png,jpg,webp|max:2048',
            'main_image_index' => 'integer|min:0',

            'full_address' => 'nullable|string',
            'province_code' => 'required|exists:indonesia_provinces,code',
            'city_code' => 'required|exists:indonesia_cities,code',
            'district_code' => 'required|exists:indonesia_districts,code',
            'village_code' => 'required|exists:indonesia_villages,code',

            'postal_code' => 'nullable|string|max:10',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama venue tidak boleh kosong.',
            'phone_number.required' => 'Nomor telepon aktif wajib diisi.',
            'category_ids.required' => 'Pilih minimal satu kategori venue.',
            'images.required' => 'Mohon unggah minimal satu foto venue.',
            'images.*.image' => 'File harus berupa gambar.',
            'images.*.max' => 'Ukuran foto tidak boleh lebih dari 2MB.',
            'province_code.required' => 'Provinsi wajib dipilih.',
            'city_code.required' => 'Kota/Kabupaten wajib dipilih.',
            'district_code.required' => 'Kecamatan wajib dipilih.',
            'village_code.required' => 'Kelurahan/Desa wajib dipilih.',
        ];
    }
}
