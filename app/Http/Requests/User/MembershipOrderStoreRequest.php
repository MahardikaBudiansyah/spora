<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

class MembershipOrderStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'venue_id'              => ['required', 'exists:venues,id'],
            'package_id'            => ['required', 'exists:membership_packages,id'], 
            'name'                  => ['required', 'string', 'max:255'],
            'phone_number'          => ['required', 'string', 'max:20'],
            'email'                 => ['required', 'email'],
            'qty'                   => ['nullable', 'integer', 'min:1'],
            'payment'               => ['required', 'array'],
            'payment.type'          => ['required', 'string', 'in:full_payment,down_payment'],
            'notes'                 => ['nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'venue_id.required' => 'Venue harus dipilih.',
            'package_id.required' => 'Paket membership harus dipilih.',
        ];
    }
}
