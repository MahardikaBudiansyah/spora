<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCartRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'venue_id' => ['required', 'exists:venues,id'],
            'field_id' => ['required', 'exists:fields,id'],
            'time_slot_id' => ['required', 'exists:time_slots,id'],
            'date' => ['required', 'date'],
            'total_price' => ['required', 'numeric', 'min:0'],
        ];
    }
}
