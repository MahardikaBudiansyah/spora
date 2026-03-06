<?php

namespace App\Http\Requests\Merchant;

use App\Models\Venue;
use App\Models\VenuePaymentPolicy;
use Illuminate\Foundation\Http\FormRequest;

class VenuePaymentPolicyUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        $venue = Venue::find($this->venue_id);
    
        return $venue && $this->user('merchant')->can('update', [VenuePaymentPolicy::class, $venue]);
    }

    public function rules(): array
    {
        return [
            'venue_id'                 => 'required|exists:venues,id',
            'enable_dp'                => 'required|boolean',
            'dp_type'                  => 'required|in:fixed,percentage',
            'dp_value'                 => 'required|numeric|min:0',
            'enable_refund'            => 'required|boolean',
            'refund_percentage'        => 'required|numeric|min:0|max:100',
            'full_payment_days_before' => 'required|integer|min:0',
            'max_full_payment_days'    => 'required|integer|min:0',
        ];
    }
}