<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CartStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'venue_id'     => 'required|exists:venues,id',
            'court_id'     => 'required|exists:courts,id',
            'time_slot_id' => 'required|exists:time_slots,id',
            'date'         => 'required|date',
            'price'        => 'required|numeric',
        ];
    }
}
