<?php

namespace App\Http\Controllers\Merchant;

use Inertia\Inertia;
use App\Models\Field;
use App\Models\Venue;
use App\Models\TimeSlot;
use App\Models\FieldType;
use App\Models\SlotStatus;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use App\Models\SlotStatusLabel;
use App\Helpers\UploadImageHelper;
use Illuminate\Support\Facades\Log;
use App\Events\TimeslotStatusUpdated;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Merchant\Controller;

class FieldController extends Controller
{
    protected function ensureFieldInVenue(Field $field, Venue $venue)
    {
        if ($field->venue_id !== $venue->id) {
            abort(404, 'Anda tidak memiliki akses ke lapangan ini.');
        }
    }

    public function index(Request $request, Venue $venue)
    {
        $this->authorize('view', $venue);
        
        $fields = Field::with(['venue', 'type'])
            ->where('venue_id', $venue->id)
            ->oldest()
            ->paginate(10)
            ->withQueryString();

        $currentPage = $fields->currentPage();
        $perPage = $fields->perPage();

        $fields->getCollection()->transform(function ($field, $index) use ($currentPage, $perPage) {
            return [
                'number' => ($currentPage - 1) * $perPage + $index + 1,
                'id' => $field->id,
                'slug' => $field->slug,
                'name' => $field->name,
                'fieldType' => $field->type->name,
                'description' => $field->description,
                'venueName' => $field->venue->name ?? '-',
                'updated_at' => $field->updated_at,
            ];
        });

        return Inertia::render('Merchant/Venue/Field/Index', [
            'fields' => $fields,
            'venue' => [
                'id' => $venue->id,
                'name' => $venue->name,
                'slug' => $venue->slug,
            ],
        ]);
    }



    public function create(Request $request, Venue $venue)
    {
        $this->authorize('create', $venue);

        $timeslots = TimeSlot::orderBy('id')->get(['id', 'name']);
        $fieldTypes = FieldType::all();

        return Inertia::render('Merchant/Venue/Field/Create', [
            'venue' => [
                'id' => $venue->id,
                'name' => $venue->name,
                'slug' => $venue->slug,
            ],
            'timeslots' => $timeslots,
            'fieldTypes' => $fieldTypes,
        ]);
    }


    public function store(Request $request, Venue $venue)
    {
        $this->authorize('create', $venue);
        $this->authorize('create', Field::class);

        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'nullable|string',
            'field_type_id' => 'required|exists:field_types,id',
            'timeslots' => 'nullable|array',
            'timeslots.*.id' => 'required|exists:time_slots,id',
            'timeslots.*.price' => 'required|numeric|min:0',
            'images' => 'nullable|array',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'main_image_index' => 'nullable|integer|min:0',
        ]);

        $field = $venue->fields()->create([
            'name' => $validated['name'],
            'field_type_id' => $validated['field_type_id'],
            'description' => $validated['description'] ?? null,
        ]);

        if (!empty($validated['timeslots'])) {
            $syncData = collect($validated['timeslots'])
                ->mapWithKeys(fn ($slot) => [$slot['id'] => ['price' => $slot['price']]])
                ->toArray();

            $field->timeslots()->sync($syncData);
        }

        if ($request->hasFile('images')) {
            $fieldNameSlug = Str::slug($field->name);
            $folderPath = "uploads/fields/{$field->id}";
            $featuredIndex = intval($validated['main_image_index'] ?? 0);

            $uploadedImages = UploadImageHelper::handle(
                $request->file('images'),
                $folderPath,
                $fieldNameSlug,
                $featuredIndex,
                $field->id,
            );

            $field->images()->createMany($uploadedImages);
        }

        return redirect()
            ->route('merchant.venues.fields.index', $venue->slug)
            ->with('success', 'Lapangan berhasil ditambahkan.');
    }



    public function show(Venue $venue, Field $field)
    {
        $this->authorize('view', $venue);
        $this->authorize('view', $field);

        $field->load(['timeslots', 'type']);

        return Inertia::render('Merchant/Venue/Field/Show', [
            'venue' => $venue,
            'field' =>  [ 
                'id' => $field->id,
                'name' => $field->name,
                'field_type' =>$field->type->name,
                'images' => $field->images->map(fn ($img) => [
                    'id' => $img->id,
                    'image_path' => asset('storage/' . $img->image_path),
                    'is_featured' => (bool) $img->is_featured,
                    'order' => $img->order,
                ]),
                'slug' => $field->slug,
                'created_at' => $field->created_at->format('d M Y'),
                'updated_at' => $field->updated_at->format('d M Y'),
            ],
        ]);
    }


    public function edit(Venue $venue, Field $field)
    {
        $this->authorize('update', $venue);
        $this->authorize('update', $field);
        $this->ensureFieldInVenue($field, $venue);

        $field->load([
            'timeslots', 
            'venue',  
            'images' => fn ($q) => $q->orderBy('order')
        ]);

        return Inertia::render('Merchant/Venue/Field/Edit', [
            'venue' => $venue,
            'field' => [
                'id' => $field->id,
                'name' => $field->name,
                'field_type_id' => $field->field_type_id,
                'description' => $field->description,
                'timeslot_ids' => $field->timeslots->pluck('id'),
                'prices' => $field->timeslots->mapWithKeys(fn ($ts) => [
                    $ts->id => $ts->pivot->price,
                ]),
                'slots' => $field->timeslots->map(function ($ts) {
                    return [
                        'timeslot_id' => $ts->id,
                        'price' => $ts->pivot->price,
                    ];
                }),
                'images' => $field->images->map(function ($image) {
                    return [
                        'id' => $image->id,
                        'url' => asset('storage/' . $image->image_path),
                        'name' => basename($image->image_path),
                        'size' => function () use ($image) {
                            $image_path = $image->image_path;
                            return $image_path && Storage::disk('public')->exists($image_path)
                                ? Storage::disk('public')->size($image_path)
                                : 0;
                        },
                        'is_featured' => $image->is_featured, // tambahan: agar tahu mana gambar utama
                        'order' => $image->order,             // tambahan: bisa digunakan untuk urutan preview
                    ];
                }),
                'venue' => [
                    'id' => $field->venue->id,
                    'slug' => $field->venue->slug,
                    'name' => $field->venue->name,
                ],
                'slug' => $field->slug,
                'created_at' => $field->created_at->format('d M Y'),
                'updated_at' => $field->updated_at->format('d M Y'),
            ],
            'fieldTypes' => FieldType::all(['id', 'name']),
            'timeslots' => TimeSlot::orderBy('name')->get(['id', 'name']),
        ]);
    }


    public function update(Request $request, Venue $venue, Field $field)
    {
        $this->authorize('update', $venue);
        $this->ensureFieldInVenue($field, $venue);

        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'field_type_id' => 'required|exists:field_types,id',
            'description' => 'nullable|string',
            'timeslots' => 'array',
            'timeslots.*' => 'exists:time_slots,id',
            'price' => 'array',
            'price.*' => 'numeric|min:0',
            'images' => 'nullable|array',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'existing_image_ids' => 'nullable|json',
            'main_image_index' => 'nullable|integer|min:0',
            'main_image_id' => 'nullable|integer',
        ]);

        $field->update([
            'name' => $validated['name'],
            'field_type_id' => $validated['field_type_id'] ?? null,
            'description' => $validated['description'] ?? null,
        ]);

        if (!empty($validated['timeslots']) && !empty($validated['price'])) {
            $this->syncTimeslots($field, $validated['timeslots'], $validated['price']);
        }

        UploadImageHelper::syncImages($field, $request, [
            'slug_name' => $validated['name'],
            'folder' => "uploads/fields"
        ]);

        return redirect()
            ->route('merchant.venues.fields.index', $field->venue->slug)
            ->with('success', 'Lapangan berhasil diperbarui.');
    }


    public function destroy(Venue $venue, Field $field)
    {
        $this->authorize('delete', $venue);
        $this->authorize('delete', $field);
        $this->ensureFieldInVenue($field, $venue);

        $field->load('images');

        foreach ($field->images as $image) {
            if (!empty($image->image_path)) {
                Storage::disk('public')->delete($image->image_path);
            }
            $image->delete();
        }

        $field->delete();

        return redirect()
            ->route('merchant.venues.fields.index', $venue->slug)
            ->with('success', 'Lapangan berhasil dihapus.');
    }


    public function calendar(Request $request, Venue $venue, Field $field)
    {
        $this->authorize('view', $venue);
        $this->authorize('view', $field);
        $this->ensureFieldInVenue($field, $venue);

        $field->load([
            'type',
            'venue',
            'timeslots', 
        ]);

        return Inertia::render('Merchant/Venue/Field/Partials/FieldCalendar', [
            'venue' => [
                'id' => $venue->id,
                'name' => $venue->name,
                'slug' => $venue->slug,
            ],
            'field' => [
                'id' => $field->id,
                'name' => $field->name,
                'field_type' => $field->type->name,
                'prices' => $field->timeslots->mapWithKeys(fn ($ts) => [
                    $ts->id => $ts->pivot->price,
                ]),
                'slug' => $field->slug,
                'slots' => $field->timeslots->map(fn($ts) => [
                    'timeslot_id' => $ts->id,
                    'price' => $ts->pivot->price,
                ]),
                'created_at' => $field->created_at->format('d M Y'),
                'updated_at' => $field->updated_at->format('d M Y'),
            ],
            'fieldTypes' => FieldType::all(['id', 'name']),
            'slotStatusLabel' => SlotStatusLabel::all(['id', 'label']),
            'timeslots' => TimeSlot::orderBy('name')->get(['id', 'name']),
        ]);
    }


    public function getCalendarData(Request $request, Venue $venue, Field $field)
    {
        try {
            $this->authorize('view', $venue);
            $this->authorize('view', $field);
            $this->ensureFieldInVenue($field, $venue);

            // Ambil query params
            $view  = $request->query('view', 'month');
            $start = $request->query('start');
            $end   = $request->query('end');

            // Logging awal biar kelihatan param masuk
            \Log::info("getCalendarData called", [
                'view'  => $view,
                'start' => $start,
                'end'   => $end,
            ]);

            // Default ke bulan ini jika tidak ada
            if (!$start || !$end) {
                $start = now()->startOfMonth()->toDateString();
                $end   = now()->endOfMonth()->toDateString();
            }

            // Mapping FullCalendar view ke backend
            $map = [
                'dayGridMonth' => 'month',
                'timeGridWeek' => 'week',
                'timeGridDay'  => 'day',
                'month'        => 'month',
                'week'         => 'week',
                'day'          => 'day',
            ];
            $view = $map[$view] ?? $view;

            // Pastikan $start dan $end berupa date string
            $start = Carbon::parse((string) $start)->toDateString();
            $end   = Carbon::parse((string) $end)->toDateString();

            // Ambil ID status yang penting
            $labels = SlotStatusLabel::whereIn('label', ['Dipesan','Event','Pemeliharaan'])
                ->pluck('id', 'label');

            $bookedId      = $labels['Dipesan'] ?? -1;
            $eventId       = $labels['Event'] ?? -1;
            $maintenanceId = $labels['Pemeliharaan'] ?? -1;

            // ================= MONTH VIEW =================
            if ($view === 'month') {
                $totalSlots = $field->timeslots()->count();

                $summary = $field->slotStatuses()
                    ->whereBetween('date', [$start, $end])
                    ->selectRaw('date, 
                        SUM(CASE WHEN status_id = ? THEN 1 ELSE 0 END) as booked,
                        SUM(CASE WHEN status_id = ? THEN 1 ELSE 0 END) as event,
                        SUM(CASE WHEN status_id = ? THEN 1 ELSE 0 END) as maintenance',
                        [$bookedId, $eventId, $maintenanceId]
                    )
                    ->groupBy('date')
                    ->get()
                    ->map(function ($day) use ($totalSlots) {
                        return [
                            'date'        => $day->date,
                            'booked'      => (int) $day->booked,
                            'event'       => (int) $day->event,
                            'maintenance' => (int) $day->maintenance,
                            'available'   => max(
                                $totalSlots - ((int)$day->booked + (int)$day->event + (int)$day->maintenance),
                                0
                            ),
                        ];
                    });

                \Log::info("getCalendarData month summary", [
                    'count'  => $summary->count(),
                    'sample' => $summary->take(3),
                ]);

                return response()->json([
                    'view'    => $view,
                    'summary' => $summary,
                ]);
            }

            // ================= WEEK / DAY VIEW =================
            if ($view === 'week' || $view === 'day') {
                $field->load([
                    'timeslots',
                    'slotStatuses' => fn ($q) => $q
                        ->whereBetween('date', [$start, $end])
                        ->with(['slotStatusLabel', 'timeSlot']),
                ]);

                $timezone = 'Asia/Jakarta';

                $period = new \DatePeriod(
                    Carbon::parse($start),
                    new \DateInterval('P1D'),
                    Carbon::parse($end)->addDay()
                );

                $slots = collect();

                foreach ($period as $date) {
                    $carbonDate = Carbon::instance($date); // fix utama ✅

                    foreach ($field->timeslots as $timeslot) {
                        $status = $field->slotStatuses
                            ->first(fn ($s) => $s->date === $carbonDate->toDateString()
                                && $s->time_slot_id === $timeslot->id);

                        $timeRange = $timeslot->name ?? '00:00-01:00';

                        if (strpos($timeRange, '-') !== false) {
                            [$startTime, $endTime] = array_map('trim', explode('-', $timeRange));
                        } else {
                            $startTime = trim($timeRange);
                            $endTime   = Carbon::parse($startTime, $timezone)->addHour()->format('H:i');
                        }

                        $startDateTime = Carbon::parse($carbonDate->toDateString().' '.$startTime, $timezone);
                        $endDateTime   = Carbon::parse($carbonDate->toDateString().' '.$endTime, $timezone);

                        if ($endDateTime->lt($startDateTime)) {
                            $endDateTime->addDay();
                        }

                        $slots->push([
                            'date'        => $carbonDate->toDateString(),
                            'timeslot_id' => $timeslot->id,
                            'status'      => $status?->slotStatusLabel?->label ?? 'Tersedia',
                            'start'       => $startDateTime->toIso8601String(),
                            'end'         => $endDateTime->toIso8601String(),
                        ]);
                    }
                }

                \Log::info("getCalendarData slots generated", [
                    'total'  => $slots->count(),
                    'sample' => $slots->take(3),
                ]);

                return response()->json([
                    'view'    => $view,
                    'summary' => [],
                    'slots'   => $slots->values(),
                ]);
            }

            // ================= DEFAULT =================
            return response()->json([
                'view'    => $view,
                'summary' => [],
                'slots'   => [],
            ]);
        } catch (\Throwable $e) {
            \Log::error("getCalendarData error: ".$e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json([
                'error'   => true,
                'message' => 'Terjadi kesalahan: '.$e->getMessage(),
            ], 500);
        }
    }

    public function getCalendarMonth(Request $request, Venue $venue, Field $field)
    {
        $this->authorize('view', $venue);
        $this->authorize('view', $field);
        $this->ensureFieldInVenue($field, $venue);

        $start = Carbon::parse($request->query('start', now()->startOfMonth()->toDateString()))->toDateString();
        $end   = Carbon::parse($request->query('end', now()->endOfMonth()->toDateString()))->toDateString();

        $labels = SlotStatusLabel::whereIn('label', ['Dipesan','Event','Pemeliharaan'])
            ->pluck('id', 'label');

        $bookedId      = $labels['Dipesan'] ?? -1;
        $eventId       = $labels['Event'] ?? -1;
        $maintenanceId = $labels['Pemeliharaan'] ?? -1;

        $totalSlots = $field->timeslots()->count();

        // Query summary untuk tanggal yang ada datanya
        $dbSummary = $field->slotStatuses()
            ->whereBetween('date', [$start, $end])
            ->selectRaw('date, 
                SUM(CASE WHEN status_id = ? THEN 1 ELSE 0 END) as booked,
                SUM(CASE WHEN status_id = ? THEN 1 ELSE 0 END) as event,
                SUM(CASE WHEN status_id = ? THEN 1 ELSE 0 END) as maintenance',
                [$bookedId, $eventId, $maintenanceId]
            )
            ->groupBy('date')
            ->get()
            ->keyBy('date'); // keyBy supaya mudah dicari

        // Generate semua tanggal dari start ke end
        $period = new \DatePeriod(
            Carbon::parse($start),
            new \DateInterval('P1D'),
            Carbon::parse($end)->addDay()
        );

        $summary = collect();

        foreach ($period as $date) {
            $d = $date->format('Y-m-d');

            if (isset($dbSummary[$d])) {
                // ada di DB → gunakan hasil query
                $day = $dbSummary[$d];
                $summary->push([
                    'date'        => $d,
                    'booked'      => (int) $day->booked,
                    'event'       => (int) $day->event,
                    'maintenance' => (int) $day->maintenance,
                    'available'   => max(
                        $totalSlots - ((int)$day->booked + (int)$day->event + (int)$day->maintenance),
                        0
                    ),
                ]);
            } else {
                // tidak ada di DB → default available
                $summary->push([
                    'date'        => $d,
                    'booked'      => 0,
                    'event'       => 0,
                    'maintenance' => 0,
                    'available'   => $totalSlots,
                ]);
            }
        }

        return response()->json([
            'view'    => 'month',
            'summary' => $summary,
        ]);
    }


    public function getCalendarWeekDays(Request $request, Venue $venue, Field $field)
    {
        $this->authorize('view', $venue);
        $this->authorize('view', $field);
        $this->ensureFieldInVenue($field, $venue);

        $start = Carbon::parse($request->query('start'))->toDateString();
        $end   = Carbon::parse($request->query('end'))->toDateString();
        $timezone = 'Asia/Jakarta';

        $field->load([
            'timeslots',
            'slotStatuses' => fn ($q) => $q
                ->whereBetween('date', [$start, $end])
                ->with(['slotStatusLabel', 'timeSlot']),
        ]);

        $period = new \DatePeriod(
            Carbon::parse($start),
            new \DateInterval('P1D'),
            Carbon::parse($end)->addDay()
        );

        $slots = collect();

        foreach ($period as $date) {
            $carbonDate = Carbon::instance($date);

            foreach ($field->timeslots as $timeslot) {
                $status = $field->slotStatuses
                    ->first(fn ($s) => $s->date === $carbonDate->toDateString()
                        && $s->time_slot_id === $timeslot->id);

                $timeRange = $timeslot->name ?? '00:00-01:00';

                if (strpos($timeRange, '-') !== false) {
                    [$startTime, $endTime] = array_map('trim', explode('-', $timeRange));
                } else {
                    $startTime = trim($timeRange);
                    $endTime   = Carbon::parse($startTime, $timezone)->addHour()->format('H:i');
                }

                $startDateTime = Carbon::parse($carbonDate->toDateString().' '.$startTime, $timezone);
                $endDateTime   = Carbon::parse($carbonDate->toDateString().' '.$endTime, $timezone);

                if ($endDateTime->lt($startDateTime)) {
                    $endDateTime->addDay();
                }

                $slots->push([
                    'date'        => $carbonDate->toDateString(),
                    'timeslot_id' => $timeslot->id,
                    'status'      => $status?->slotStatusLabel?->label ?? 'Tersedia',
                    'start'       => $startDateTime->toIso8601String(),
                    'end'         => $endDateTime->toIso8601String(),
                ]);
            }
        }

        return response()->json([
            'view'  => $request->query('view', 'week'),
            'slots' => $slots->values(),
        ]);
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
