<?php

namespace App\Http\Controllers;

use Log;
use App\Models\Field;
use App\Models\Venue;
use App\Models\SlotStatus;
use Illuminate\Http\Request;
use App\Models\SlotStatusLabel;
use App\Events\TimeslotStatusUpdated;

class TimeSlotController extends Controller
{
    protected function authorizeVenue(Venue $venue)
    {
        if ($venue->merchant_id !== auth('merchant')->id()) {
            abort(403, 'Anda tidak memiliki akses ke venue ini.');
        }
    }

    protected function authorizeField(Field $field)
    {
        if ($field->venue->merchant_id !== auth('merchant')->id()) {
            abort(403, 'Anda tidak memiliki akses ke lapangan ini.');
        }
    }

    protected function ensureFieldInVenue(Field $field, Venue $venue)
    {
        if ($field->venue_id !== $venue->id) {
            abort(404, 'Anda tidak memiliki akses ke lapangan ini.');
        }
    }

    public function getTimeslotsByVenue(Request $request, Venue $venue)
    {
        $date = $request->query('date') ?? now()->toDateString();
        $defaultStatus = SlotStatusLabel::where('label', 'Tersedia')->first();

        $fields = $venue->fields()->with([
            'timeslots',
            'type',
            'slotStatuses' => fn($q) => $q
                ->whereDate('date', $date)
                ->with('slotStatusLabel')
        ])->get();

    
        return response()->json([
            'venue_id' => $venue->id,
            'date' => $date,
            'fields' => $fields->map(function ($field) use ($defaultStatus) {
                $statusMap = $field->slotStatuses->keyBy('time_slot_id');
                return [
                    'id' => $field->id,
                    'name' => $field->name,
                    'field_type' => $field->type->name,
                    'slots' => $field->timeSlots->map(function ($ts) use ($statusMap, $defaultStatus) {
                        $status = $statusMap[$ts->id] ?? null;
                        return [
                            'timeslot_id' => $ts->id,
                            'name' => $ts->name,
                            'price' => $ts->pivot->price,
                            'status_id' => $status?->status_id ?? $defaultStatus?->id,
                            'status_label' => $status?->slotStatusLabel?->label ?? $defaultStatus?->label,
                            'updated_at' => $status?->updated_at?->format('d M Y H:i') ?? '-',
                        ];
                    }),
                ];
            }),
        ]);
    }

    public function getTimeslotsByField(Request $request, Venue $venue, Field $field)
    {
        $this->authorizeVenue($venue);
        $this->authorizeField($field);
        $this->ensureFieldInVenue($field, $venue);

        $date = $request->query('date') ?? now()->toDateString();
        $defaultStatus = SlotStatusLabel::where('label', 'Tersedia')->first();

        $field->load([
            'timeslots',
            'slotStatuses' => fn ($q) => $q
                ->whereDate('date', $date)
                ->with('slotStatusLabel')
        ]);

        $statusMap = $field->slotStatuses->keyBy('time_slot_id');

        return response()->json([
            'venue_id' => $venue->id,
            'field_id' => $field->id,
            'date' => $date,
            'timeslots' => $field->timeslots->map(function ($ts) use ($statusMap, $defaultStatus) {
                $status = $statusMap[$ts->id] ?? null;
                return [
                    'timeslot_id' => $ts->id,
                    'name' => $ts->name,
                    'price' => $ts->pivot->price,
                    'status_id' => $status?->status_id ?? $defaultStatus?->id,
                    'status_label' => $status?->slotStatusLabel?->label ?? $defaultStatus?->label,
                    'updated_at' => $status?->updated_at?->format('d M Y H:i') ?? '-',
                ];
            }),
        ]);
    }

    public function updateTimeslots(Request $request, Venue $venue, Field $field)
    {   
        $this->authorizeVenue($venue);
        $this->authorizeField($field);
        $this->ensureFieldInVenue($field, $venue);

        $validated = $request->validate([
            'timeslot_ids' => ['required', 'array'],
            'timeslot_ids.*' => ['exists:time_slots,id'],
            'prices' => ['required', 'array'],
            'prices.*' => ['numeric', 'min:0'],
        ]);

        // Buat array pivot: [timeslot_id => ['price' => x]]
        $this->syncTimeslots($field, $validated['timeslot_ids'], $validated['prices']);

        return redirect()->route('merchant.venues.fields.calendar', [
            'venue' => $venue->slug,
            'field' => $field->slug,
        ])->with('success', 'Slot waktu berhasil diperbarui.');
    }

    public function updateTimeslotStatuses(Request $request, Venue $venue, Field $field)
    {
        $this->authorizeVenue($venue);
        $this->authorizeField($field);
        $this->ensureFieldInVenue($field, $venue);

        $validated = $request->validate([
            'date' => ['required', 'date'],
            'status_id' => ['required', 'exists:slot_status_labels,id'],
            'timeslot_ids' => ['required', 'array'],
            'timeslot_ids.*' => ['required', 'exists:time_slots,id'],
        ]);

        foreach ($validated['timeslot_ids'] as $timeslotId) {
            Log::info('Updating slot status', [
                'field_id' => $field->id,
                'timeslot_id' => $timeslotId,
                'date' => $validated['date'],
                'status_id' => $validated['status_id'],
            ]);

            SlotStatus::updateOrCreate(
                [
                    'field_id' => $field->id,
                    'time_slot_id' => $timeslotId,
                    'date' => $validated['date'],
                ],
                [
                    'status_id' => $validated['status_id'],
                ]
            );
        }

        TimeslotStatusUpdated::dispatch(
            $field->id,
            $validated['timeslot_ids'],
            $validated['date'],
            $validated['status_id']
        );

        return redirect()->back()->with('success', 'Status slot berhasil diperbarui.');
    }

    protected function syncTimeslots(Field $field, array $timeslotIds, array $prices)
    {
        $syncData = [];

        foreach ($timeslotIds as $id) {
            $syncData[$id] = ['price' => $prices[$id] ?? 0];
        }

        $field->timeslots()->sync($syncData);
    }
}
