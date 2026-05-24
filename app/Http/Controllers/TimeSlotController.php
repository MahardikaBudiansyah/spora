<?php

namespace App\Http\Controllers;

use Log;
use Carbon\Carbon;
use App\Models\Court;
use App\Models\Venue;
use App\Enums\CourtStatus;
use App\Models\SlotStatus;
use Illuminate\Http\Request;
use App\Models\CourtSchedule;
use App\Models\CourtStatusType;
use App\Models\SlotStatusLabel;
use Illuminate\Support\Facades\DB;
use App\Events\TimeslotStatusUpdated;
use App\Http\Resources\CourtAvailabilityResource;
use App\Http\Requests\Merchant\CourtTimeSlotUpdateRequest;

class TimeSlotController extends Controller
{
    protected function authorizeVenue(Venue $venue)
    {
        if ($venue->merchant_id !== auth('merchant')->id()) {
            abort(403, 'Anda tidak memiliki akses ke venue ini.');
        }
    }

    protected function authorizeCourt(Court $court)
    {
        if ($court->venue->merchant_id !== auth('merchant')->id()) {
            abort(403, 'Anda tidak memiliki akses ke lapangan ini.');
        }
    }

    protected function ensureCourtInVenue(Court $court, Venue $venue)
    {
        if ($court->venue_id !== $venue->id) {
            abort(404, 'Anda tidak memiliki akses ke lapangan ini.');
        }
    }

    public function getTimeslotsByVenue(Request $request, Venue $venue)
    {
        $dateString = $request->query('date') ?? now()->toDateString();
        $dayOfWeek = date('N', strtotime($dateString));
        $dayType = ($dayOfWeek >= 6) ? 'weekend' : 'weekday';

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

                    return [
                        'id'           => $ts->id,
                        'start_time'   => $ts->start_time,
                        'end_time'     => $ts->end_time,
                        'day_type'     => $ts->pivot->day_type,
                        'price'        => (float) $ts->pivot->price,
                        'status_id'    => $schedule ? (int)$schedule->status_id : (int)$defaultStatus->id,
                        'status'       => $schedule?->statusType?->label ?? $defaultStatus->label,
                        'is_available' => $schedule ? false : true,
                        'debug_check'  => $schedule ? 'BOOKED' : 'AVAILABLE'
                    ];
                })
            ];
        });

        return response()->json([
            'debug_info' => [
                'date' => $dateString,
                'schedules_count' => $courts->pluck('schedules')->flatten()->count(),
            ],
            'courts' => $mappedCourts
        ]);
    }

    // public function getTimeSlotsByVenue(Request $request, Venue $venue)
    // {
    //     $dateString = $request->query('date') ?? now()->toDateString();
    //     $date = Carbon::parse($dateString);
    //     $dayType = $date->isWeekend() ? 'weekend' : 'weekday';

    //     $default_status = CourtStatusType::where('label', 'Tersedia')->first();

    //     $courts = Court::where('venue_id', $venue->id)->with([
    //         'surface',
    //         'timeSlots' => function ($query) use ($dayType) {
    //             $query->withPivot('price', 'day_type')->wherePivot('day_type', $dayType);
    //         },
    //         'schedules' => fn($q) => $q->whereDate('date', $dateString)->with('statusType')
    //     ])->get();

    //     return response()->json([
    //         'venue_id' => $venue->id,
    //         'date'     => $dateString,
    //         'day_type' => $dayType,
    //         'courts'   => $courts->map(function ($court) use ($default_status) {
    //             $statusMap = $court->schedules->keyBy('time_slot_id');

    //             return [
    //                 'id'            => $court->id,
    //                 'name'          => $court->name,
    //                 'court_surface' => $court->surface->name ?? '-',
    //                 'timeslots'     => $court->timeSlots->map(function ($ts) use ($statusMap, $default_status) {
    //                     $schedule = $statusMap[$ts->id] ?? null;
    //                     return [
    //                         'timeslot_id'  => $ts->id,
    //                         'start_time'   => $ts->start_time,
    //                         'end_time'     => $ts->end_time,
    //                         'day_type'     => $ts->pivot ? $ts->pivot->day_type : '',
    //                         'price'        => $ts->pivot ? $ts->pivot->price : 0,
    //                         'status_id'    => $schedule ? $schedule->status_id : $default_status?->id,
    //                         'status_label' => $schedule ? $schedule->statusType->label : ($default_status?->label ?? 'Tersedia'),
    //                     ];
    //                 }),
    //             ];
    //         }),
    //     ]);
    // }

    public function getTimeSlotsByCourt(Request $request, Venue $venue, Court $court)
    {
        $this->authorizeVenue($venue);
        $this->authorizeCourt($court);
        $this->ensureCourtInVenue($court, $venue);

        $dateString = $request->query('date') ?? now()->toDateString();
        $date = Carbon::parse($dateString);

        $isWeekend = $date->isWeekend();
        $dayType = $isWeekend ? 'weekend' : 'weekday';

        $default_status = CourtStatusType::where('label', 'Tersedia')->first();

        $court->load([
            'timeSlots' => function ($query) use ($dayType) {
                $query->withPivot('price', 'day_type')->wherePivot('day_type', $dayType);
            },
            'schedules' => fn($q) => $q
                ->whereDate('date', $dateString)
                ->with('statusType')
        ]);

        $statusMap = $court->schedules->keyBy('time_slot_id');

        return response()->json([
            'venue_id'  => $venue->id,
            'court_id'  => $court->id,
            'date'      => $dateString,
            'day_type'  => $dayType,
            'timeslots' => $court->timeSlots->map(function ($ts) use ($statusMap, $default_status) {
                $schedule = $statusMap[$ts->id] ?? null;

                return [
                    'id'           => $ts->id,
                    'start_time'   => $ts->start_time,
                    'end_time'     => $ts->end_time,
                    'day_type'     => $ts->pivot ? $ts->pivot->day_type : '',
                    'price'        => $ts->pivot ? (float)$ts->pivot->price : 0,
                    'status_id'    => $schedule ? (int)$schedule->status_id : (int)$default_status?->id,
                    'status'       => $schedule ? $schedule->statusType->label : ($default_status?->label ?? 'Tersedia'),
                    'is_available' => $schedule ? false : true,
                    'updated_at'   => $schedule ? $schedule->updated_at->format('d M Y H:i') : '-',
                ];
            }),
        ]);
    }
}
