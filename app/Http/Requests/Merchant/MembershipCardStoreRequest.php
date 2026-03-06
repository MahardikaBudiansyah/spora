<?php

namespace App\Http\Requests\Merchant;

use App\Models\Venue;
use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class MembershipCardStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $venueId = $this->input('venue_id') ?? $this->route('venue')?->id;

        return [
            'venue_id'       => ['required', 'integer', 'exists:venues,id'],
            'customer_phone' => ['required', 'string', 'min:8', 'max:20'],
            'customer_name'  => ['required', 'string', 'max:255'],
            'customer_email' => ['nullable', 'email', 'max:255'],
            'customer_id'    => ['nullable', 'integer'],
            'notes'          => ['nullable', 'string', 'max:1000'],
        ];
    }

    protected function prepareForValidation()
    {
        if ($venue = $this->route('venue')) {
            $this->merge(['venue_id' => $venue->id]);
        }
    }
}