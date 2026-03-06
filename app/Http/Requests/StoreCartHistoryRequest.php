<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class StoreCartHistoryRequest extends FormRequest
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
            'cart_id' => ['required', 'exists:carts,id'],
            'user_id' => ['required', 'exists:users,id'],
            'court_id' => ['required', 'exists:courts,id'],
            'time_slot_id' => ['required', 'exists:time_slots,id'],
            'price' => ['required', 'numeric', 'min:0'],
            'status' => ['required', Rule::in(['added', 'removed', 'booked', 'expired'])],
            'added_at' => ['required', 'date'],
        ];
    }
}
