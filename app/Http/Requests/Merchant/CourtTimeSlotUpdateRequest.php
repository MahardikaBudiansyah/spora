<?php
namespace App\Http\Requests\Merchant;

use Illuminate\Foundation\Http\FormRequest;

class CourtTimeSlotUpdateRequest extends FormRequest
{
    public function authorize()
    {
        $venue = $this->route('venue');
        $court = $this->route('court');

        $isVenue = $venue->merchant_id === auth('merchant')->id();

        $isCourtInVenue = $court->venue_id === $venue->id;

        return $isVenue && $isCourtInVenue;
    }

    public function rules()
    {
        return [
            'timeSlots' => ['required', 'array'],
            'timeSlots.weekday' => ['array'],
            'timeSlots.weekend' => ['array'],
            'timeSlots.holiday' => ['array'],
            'prices' => ['required', 'array'],
        ];
    }
}