<?php

namespace App\Http\Controllers;

use App\Models\Venue;
use App\Models\Court;
use App\Models\CourtStatusType;
use App\Enums\CourtStatus;
use Illuminate\Http\Request;

class CourtAvailabilityController extends Controller
{
    public function getTimeslots(Request $request, Venue $venue)
    {
        $dateString = $request->query('date') ?? now()->toDateString();
        $dayOfWeek = date('N', strtotime($dateString)); 
        $dayType = ($dayOfWeek >= 6) ? 'weekend' : 'weekday';

        // Ambil data lapangan beserta relasinya
        $courts = Court::where('venue_id', $venue->id)
            ->with([
                'surface',
                'timeSlots' => function ($q) use ($dayType) {
                    $q->wherePivot('day_type', $dayType)->orderBy('start_time');
                },
                'schedules' => function ($q) use ($dateString) {
                    $q->whereDate('date', $dateString)->with('statusType');
                },
            ])->get();

        $defaultStatus = CourtStatusType::where('name', CourtStatus::AVAILABLE->value)->first();

        $mappedCourts = $courts->map(function ($court) use ($defaultStatus) {
            $statusMap = $court->schedules->keyBy('time_slot_id');
            
            return [
                'id' => $court->id,
                'name' => $court->name,
                'court_surface' => $court->surface->name ?? '-',
                'timeslots' => $court->timeSlots->map(function ($ts) use ($statusMap, $defaultStatus) {
                    $schedule = $statusMap[(int)$ts->id] ?? null;
                    $statusLabel = $schedule?->statusType?->label ?? $defaultStatus->label;
                    
                    return [
                        'timeslot_id'  => $ts->id, 
                        'start_time'   => $ts->start_time,
                        'end_time'     => $ts->end_time,
                        'price'        => (float) $ts->pivot->price,
                        'status_id'    => $schedule ? (int)$schedule->status_id : (int)$defaultStatus->id,
                        'status_label' => $statusLabel,
                        'is_available' => $schedule ? ($schedule->statusType->name === CourtStatus::AVAILABLE->value) : true,
                    ];
                })
            ];
        });

        return response()->json([
            'date' => $dateString,
            'day_type' => $dayType,
            'courts' => $mappedCourts
        ]);
    }
}