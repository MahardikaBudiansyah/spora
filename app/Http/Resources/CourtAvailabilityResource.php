<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CourtAvailabilityResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $statusMap = $this->additional['status_map'] ?? [];

        $defaultStatus = $this->additional['default_status'] ?? (object)[
            'id' => 1,
            'label' => 'Tersedia'
        ];

        return [
            'id' => $this->id,
            'name' => $this->name,
            'court_surface' => $this->surface->name ?? '-',
            'timeslot_ids' => $this->timeSlots->pluck('id'),
            'prices' => $this->timeSlots->mapWithKeys(fn($ts) => [
                $ts->id => (float) $ts->pivot->price,
            ]),
            'timeslots' => $this->timeSlots->map(function ($ts) use ($statusMap, $defaultStatus) {
                $courtId = (int) $this->id;
                $slotId = (int) $ts->id;

                $schedule = $statusMap[$courtId][$slotId] ?? null;

                $isAvailable = $schedule
                    ? (method_exists($schedule->statusType, 'isAvailable')
                        ? $schedule->statusType->isAvailable()
                        : false)
                    : true;

                return [
                    'id'           => $ts->id,
                    'start_time'   => $ts->start_time,
                    'end_time'     => $ts->end_time,
                    'day_type'     => $ts->pivot->day_type,
                    'price'        => (float) $ts->pivot->price,
                    'status_id'    => $schedule ? (int)$schedule->status_id : (int)$defaultStatus->id,
                    'status'       => $schedule?->statusType?->label ?? $defaultStatus->label,
                    'is_available' => $isAvailable,
                    'updated_at'   => $schedule?->updated_at?->format('Y-m-d H:i:s') ?? null,
                ];
            }),
        ];
    }
}
