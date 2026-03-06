<?php

namespace App\Http\Requests\Merchant;

use Illuminate\Foundation\Http\FormRequest;

class CourtStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'venue_id' => ['required', 'exists:venues,id'],
            'court_surface_id' => ['required', 'exists:court_surfaces,id'],
            'categories' => ['required', 'array', 'min:1'],
            'categories.*.id' => ['required', 'exists:court_categories,id'],
            
            // Validasi Images
            'images' => ['required', 'array', 'min:1'],
            'images.*' => ['image', 'mimes:jpg,jpeg,png', 'max:2048'],
            'main_image_index' => ['required', 'integer', 'min:0'],

            // Validasi Time Slots & Prices
            'timeSlots' => ['required', 'array'],
            'timeSlots.weekday' => ['array'],
            'timeSlots.weekend' => ['array'],
            'timeSlots.holiday' => ['array'],
            
            'prices' => ['required', 'array'],
            'prices.weekday' => ['required_with:timeSlots.weekday', 'array'],
            'prices.weekend' => ['required_with:timeSlots.weekend', 'array'],
            'prices.holiday' => ['required_with:timeSlots.holiday', 'array'],
            
            'prices.*.*' => ['nullable', 'numeric', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return [
            'images.required' => 'Setidaknya harus mengunggah satu foto lapangan.',
            'categories.required' => 'Pilih minimal satu kategori lapangan.',
            'prices.*.*.numeric' => 'Harga harus berupa angka.',
        ];
    }
}