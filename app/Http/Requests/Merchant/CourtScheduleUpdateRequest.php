<?php
namespace App\Http\Requests\Merchant;

use Illuminate\Foundation\Http\FormRequest;

class CourtScheduleUpdateRequest extends FormRequest
{
    public function authorize()
    {
        $venue = $this->route('venue');
        $court = $this->route('court');

        return $venue->merchant_id === auth('merchant')->id() && $court->venue_id === $venue->id;
    }

    public function rules()
    {
        return [
            'date'           => ['required', 'date', 'after_or_equal:today'],
            'status_id'      => ['required', 'exists:court_status_types,id'],
            'timeslot_ids'   => ['required', 'array', 'min:1'],
            'timeslot_ids.*' => ['required', 'exists:time_slots,id'],
        ];
    }
}