<?php

namespace App\Http\Requests\Merchant;

use App\Enums\Gender;
use Illuminate\Validation\Rules\Enum;
use Illuminate\Foundation\Http\FormRequest;

class MerchantOwnerUpdateRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            'nik'  => ['required', 'string', 'size:16'],
            'phone_number' => ['required', 'string', 'regex:/^(?:\+62|62|0)[0-9]{9,13}$/'],
            'gender' => ['nullable', new Enum(Gender::class)],
            'date_of_birth' => ['nullable', 'date', 'before:today'],
            'email' => ['required', 'string', 'email', 'max:255'],
            'photo_path' => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],
            'ktp_photo_path' => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],
            'selfie_photo_path' => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],

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
            'name.required' => 'Nama lengkap wajib diisi.',
            'nik.required' => 'NIK wajib diisi.',
            'nik.size' => 'NIK harus tepat 16 digit.',
            'phone_number.required' => 'Nomor telepon wajib diisi.',
            'phone_number.regex' => 'Format nomor telepon tidak valid (Gunakan format 08... atau 62...).',
            'email.required' => 'Email wajib diisi.',
            'photo_path.image' => 'File harus berupa gambar.',
            'photo_path.max' => 'Ukuran foto maksimal 2MB.',
            'ktp_photo_path.image' => 'File harus berupa gambar.',
            'ktp_photo_path.max' => 'Ukuran foto maksimal 2MB.',
            'selfie_photo_path.image' => 'File harus berupa gambar.',
            'selfie_photo_path.max' => 'Ukuran foto maksimal 2MB.',

            'province_code.exists' => 'Provinsi yang dipilih tidak valid.',
            'city_code.exists' => 'Kota/Kabupaten yang dipilih tidak valid.',
            'district_code.exists' => 'Kecamatan yang dipilih tidak valid.',
            'village_code.exists' => 'Kelurahan/Desa yang dipilih tidak valid.',
            'postal_code.max' => 'Kode pos maksimal 10 karakter.',
        ];
    }
}
