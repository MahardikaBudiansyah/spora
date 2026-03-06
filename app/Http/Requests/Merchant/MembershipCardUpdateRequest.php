<?php

namespace App\Http\Requests\Merchant;

use App\Models\MembershipCard;
use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class MembershipCardUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; 
    }

    public function rules(): array
    {
        $membershipCard = $this->route('membership_card');
        
        $cardId = $membershipCard instanceof MembershipCard 
            ? $membershipCard->id 
            : $membershipCard;

        $venueId = $this->input('venue_id') ?? $membershipCard?->venue_id;

        return [
            'venue_id' => ['sometimes', 'required', 'exists:venues,id'],

            'member_no' => [
                'sometimes', 
                'required', 
                'string', 
                'max:50',
                Rule::unique('membership_cards')
                    ->where(fn ($q) => $q->where('venue_id', $venueId))
                    ->ignore($cardId)
            ],

            'customer_name'  => [
                'required', 
                'string', 
                'max:255'
            ],
            'customer_email' => ['nullable', 'email', 'max:255'],
            'notes'          => ['nullable', 'string', 'max:1000'],
        ];
    }

    protected function passedValidation()
    {
        $membershipCard = $this->route('membership_card');
        if ($membershipCard?->user_id) {
            $this->offsetUnset('customer_name');
            $this->offsetUnset('customer_email');
        }
    }
}