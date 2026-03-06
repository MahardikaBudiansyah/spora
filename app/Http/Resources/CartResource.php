<?php
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return $this->resource->groupBy('venue_id')->map(function ($venueGroup) {
            $venue = $venueGroup->first()->venue;

            $dates = $venueGroup->groupBy('date')->map(function ($dateGroup, $date) {
            $dayType = $dateGroup->first()->day_type; 

            $courts = $dateGroup->groupBy('court_id')->map(function ($courtGroup) {
                return [
                    'court' => [
                        'id' => $courtGroup->first()->court->id,
                        'name' => $courtGroup->first()->court->name,
                    ],
                    'timeSlots' => $courtGroup->map(function ($item) {
                        return [
                            'cart_id' => $item->id,
                            'timeslot_id' => $item->timeSlot->id,
                            'start_time' => $item->timeSlot->start_time,
                            'end_time' => $item->timeSlot->end_time,
                            'day_type' => $item->day_type,
                            'price' => $item->price,
                        ];
                    })->values(),
                ];
            })->values();

            return [
                'date' => $date,
                'day_type' => $dayType, 
                'courts' => $courts,
            ];
        })->values();

            return [
                'venue' => [
                    'id' => $venue->id,
                    'name' => $venue->name,
                    'slug' => $venue->slug,
                ],
                'dates' => $dates,
            ];
        })->values()->all();
    }
}