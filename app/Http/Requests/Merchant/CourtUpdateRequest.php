<?php

namespace App\Http\Requests\Merchant;

use Illuminate\Foundation\Http\FormRequest;

class CourtUpdateRequest extends FormRequest
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
            'court_surface_id' => ['required', 'exists:court_surfaces,id'],
            'categories' => ['required', 'array', 'min:1'],
            
            'images' => ['nullable', 'array'],
            'images.*' => ['image', 'mimes:jpg,jpeg,png', 'max:2048'],
        
            'existing_image_ids' => ['required', 'string'], 
            
            'main_image_index' => ['required', 'integer'],

            // Validasi Time Slots & Prices
            'timeSlots' => ['required', 'array'],
            'timeSlots.weekday' => ['array'],
            'timeSlots.weekend' => ['array'],
            'timeSlots.holiday' => ['array'],
            
            'prices' => ['required', 'array'],
            'prices.weekday' => ['array'],
            'prices.weekend' => ['array'],
            'prices.holiday' => ['array'],
            'prices.*.*' => ['nullable', 'numeric', 'min:0'],
        ];
    }

    protected function prepareForValidation()
    {
        if ($this->has('existing_image_ids')) {
            $this->merge([
                'decoded_existing_ids' => json_decode($this->existing_image_ids, true),
            ]);
        }
    }
}