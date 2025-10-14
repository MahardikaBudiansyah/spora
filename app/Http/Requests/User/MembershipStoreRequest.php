<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

class MembershipStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // atur sesuai policy
    }

    public function rules(): array
    {
        return [
            'venue_id'            => ['required', 'exists:venues,id'],
            'membership_package_id' => ['required', 'exists:membership_packages,id'],
            'start_date'          => ['required', 'date', 'after_or_equal:today'],
            'notes'               => ['nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'venue_id.required' => 'Venue harus dipilih.',
            'membership_package_id.required' => 'Paket membership harus dipilih.',
            'start_date.after_or_equal' => 'Tanggal mulai minimal hari ini.',
        ];
    }
}
