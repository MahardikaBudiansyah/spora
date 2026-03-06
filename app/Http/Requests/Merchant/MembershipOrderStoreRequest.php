<?php

namespace App\Http\Requests\Merchant;

use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class MembershipOrderStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth('merchant')->check();
    }

    public function rules(): array
    {
        $venueId = $this->input('venue_id') ?? $this->route('venue')?->id;

        return [
            'venue_id'               => ['required', 'integer', 'exists:venues,id'],
            'start_date'             => ['required', 'date'],
            // 'operator_assignment_id' => ['nullable', 'integer'],
            
            'membership_package_id' => [
                'required', 
                'integer', 
                Rule::exists('membership_packages', 'id')->where(function ($query) {
                    $query->where('venue_id', $this->venue_id);
                }),
            ],

            'customer_name'          => ['required', 'string', 'max:255'],
            'customer_phone'         => ['required', 'string', 'max:20'],
            'customer_email'         => ['nullable', 'email', 'max:255'],
            'customer_id'            => ['nullable', 'integer', 'exists:users,id'],

            'payment_type'           => ['required', 'string', 'in:down_payment,full_payment'],
            'payment_method'         => ['required', 'string', 'in:cash,bank_transfer,ewallet,qris'],
            'amount'                 => ['required', 'numeric', 'min:0'],
            'bank'                   => ['nullable', 'string'],
            'digital_wallet'         => ['nullable', 'string'],
            'reference_no'           => ['nullable', 'string'],
            'payer_name'             => ['nullable', 'string'],
            'payment_date'           => ['nullable', 'date'],
            'payment_time'           => ['nullable', 'string'],
            'proof_of_payment'       => ['nullable', 'file', 'mimes:jpg,jpeg,png', 'max:5120'],
        ];
    }

    protected function prepareForValidation()
    {
        if ($venue = $this->route('venue')) {
            $this->merge(['venue_id' => $venue->id]);
        }
    }
    

}


