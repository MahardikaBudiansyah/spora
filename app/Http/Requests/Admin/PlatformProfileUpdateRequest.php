<?php

namespace App\Http\Requests\Admin;

use App\Enums\BusinessType;
use Illuminate\Validation\Rules\Enum;
use Illuminate\Foundation\Http\FormRequest;

class PlatformProfileUpdateRequest extends FormRequest
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
            'business_name' => ['required', 'string', 'max:255'],
            'business_email' => ['required', 'string', 'email', 'max:255'],
            'business_phone_number' =>  ['required', 'string', 'regex:/^(?:\+62|62|0)[0-9]{9,13}$/'],
            'logo_path' => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],
            'business_type' => ['nullable',  new Enum(BusinessType::class)],
            'nib' =>  ['nullable', 'string', 'max:13'],

            'address' => ['nullable', 'string'],
            'province_code' => ['nullable', 'exists:indonesia_provinces,code'],
            'city_code' => ['nullable', 'exists:indonesia_cities,code'],
            'district_code' => ['nullable', 'exists:indonesia_districts,code'],
            'village_code' => ['nullable', 'exists:indonesia_villages,code'],
            'postal_code' => ['nullable', 'string', 'max:10'],
            'latitude' => ['nullable', 'numeric'],
            'longitude' => ['nullable', 'numeric'],
        ];
    }

    public function messages(): array
    {
        return [
            'business_name.required' => 'Nama lengkap wajib diisi.',
            'business_email.required' => 'Email wajib diisi.',
            'business_phone_number.required' => 'Nomor Handphone Bisnis wajib diisi.',
            'business_phone_number.regex' => 'Format nomor telepon tidak valid (Gunakan format 08... atau 62...).',
            'logo_path.image' => 'File harus berupa gambar.',
            'logo_path.max' => 'Ukuran foto maksimal 2MB.',
            'province_code.exists' => 'Provinsi yang dipilih tidak valid.',
            'city_code.exists' => 'Kota/Kabupaten yang dipilih tidak valid.',
            'district_code.exists' => 'Kecamatan yang dipilih tidak valid.',
            'village_code.exists' => 'Kelurahan/Desa yang dipilih tidak valid.',
            'postal_code.max' => 'Kode pos maksimal 10 karakter.',
        ];
    }
}
