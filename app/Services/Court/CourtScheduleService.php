<?php
namespace App\Services\Court;

use Carbon\Carbon;
use App\Models\Court;
use Illuminate\Support\Facades\DB;

class CourtScheduleService 
{
    public function syncMasterPrices(Court $court, array $slots, array $prices)
    {
        return DB::transaction(function () use ($court, $slots, $prices) {
            $court->timeSlots()->detach();

            foreach (['weekday', 'weekend', 'holiday'] as $type) {
                if (isset($slots[$type]) && is_array($slots[$type])) {
                    $syncData = [];
                    foreach ($slots[$type] as $slotId) {
                        $syncData[$slotId] = [
                            'day_type' => $type,
                            'price'    => $prices[$type][$slotId] ?? 0
                        ];
                    }
                    
                    $court->timeSlots()->attach($syncData);
                }
            }
        });
    }

    public function updateSchedules(Court $court, array $data)
    {
        return DB::transaction(function () use ($court, $data) {
            // Konversi format ISO 8601 ke Y-m-d
            $formattedDate = Carbon::parse($data['date'])->format('Y-m-d');

            $timeSlots = $court->timeSlots()->whereIn('time_slots.id', $data['timeslot_ids'])->get();

            foreach ($data['timeslot_ids'] as $timeslotId) {
                $slot = $timeSlots->firstWhere('id', $timeslotId);
                $price = $slot->pivot->price ?? 0;

                $court->schedules()->updateOrCreate(
                    [
                        'time_slot_id' => $timeslotId,
                        'date'         => $formattedDate, // Gunakan yang sudah diformat
                    ],
                    [
                        'status_id' => $data['status_id'],
                        'price'     => $price,
                    ]
                );
            }
        });
    }
}