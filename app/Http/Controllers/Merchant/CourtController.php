<?php

namespace App\Http\Controllers\Merchant;

use App\Http\Controllers\Merchant\Controller;
use App\Http\Requests\Merchant\CourtStoreRequest;
use App\Http\Requests\Merchant\CourtUpdateRequest;
use App\Http\Resources\CourtResource;
use App\Models\Court;
use App\Models\CourtCategory;
use App\Models\CourtStatusType;
use App\Models\CourtSurface;
use App\Models\Schedule;
use App\Models\TimeSlot;
use App\Models\Venue;
use App\Services\Court\CourtFlowService;
use App\Services\Court\CourtService;
use Carbon\CarbonPeriod;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class CourtController extends Controller
{
    protected $courtService;
    protected $courtFlowService;

    public function __construct(CourtService $courtService, CourtFlowService $courtFlowService)
    {
        $this->courtService = $courtService;
        $this->courtFlowService = $courtFlowService;
        $this->authorizeResource(Court::class, 'court');
    }

    protected function ensureCourtInVenue(Court $court, Venue $venue)
    {
        if ($court->venue_id !== $venue->id) {
            abort(404, 'Anda tidak memiliki akses ke lapangan ini.');
        }
    }

    public function index(Request $request, Venue $venue)
    {
        $this->authorize('view', $venue);

        $courts = Court::with(['surface'])
            ->where('venue_id', $venue->id)
            ->oldest()
            ->paginate(10);

        return Inertia::render('Merchant/Venue/Courts/Index', [
            'courts' => CourtResource::collection($courts)->response()->getData(true),
            'venue'  => [
                'id'   => $venue->id,
                'name' => $venue->name,
                'slug' => $venue->slug,
            ],
        ]);
    }

    public function create(Request $request, Venue $venue)
    {
        $this->authorize('create', $venue);

        $surfaces = CourtSurface::orderBy('id')->get(['id', 'name']);
        $court_categories = CourtCategory::orderBy('id')->get(['id', 'name', 'label']);
        $timeSlots = TimeSlot::orderBy('id')->get(['id', 'start_time', 'end_time']);

        return Inertia::render('Merchant/Venue/Courts/Create', [
            'venue' => [
                'id' => $venue->id,
                'name' => $venue->name,
                'slug' => $venue->slug,
            ],
            'surfaces' => $surfaces,
            'court_categories' => $court_categories,
            'timeSlots' => $timeSlots,
        ]);
    }

    public function store(CourtStoreRequest $request, Venue $venue)
    {
        $this->authorize('update', $venue);

        $this->courtFlowService->createCourtWithPricing($venue, $request->validated());

        return redirect()
            ->route('merchant.venues.courts.index', $venue->slug)
            ->with('success', 'Lapangan berhasil ditambahkan.');
    }

    public function show(Venue $venue, Court $court)
    {
        $this->authorize('view', $venue);
        $this->authorize('view', $court);

        $court->load([
            'timeSlots',
            'surface',
            'categories',
            'images',
        ]);

        return Inertia::render('Merchant/Venue/Courts/Show', [
            'venue' => $venue,
            'court' => new CourtResource($court),
        ]);
    }

    public function edit(Venue $venue, Court $court)
    {
        $this->authorize('update', $venue);
        $this->authorize('update', $court);
        $this->ensureCourtInVenue($court, $venue);

        $court->load([
            'venue',
            'categories',
            'surface',
            'timeSlots',
            'images' => fn($q) => $q->orderBy('order')
        ]);

        return Inertia::render('Merchant/Venue/Courts/Edit', [
            'venue' => $venue,
            'court' => new CourtResource($court),
            'surfaces' => CourtSurface::all(['id', 'name']),
            'court_categories' => CourtCategory::orderBy('id')->get(['id', 'name', 'label']),
            'timeSlots' => TimeSlot::orderBy('id')->get(['id', 'start_time', 'end_time']),
        ]);
    }

    public function update(CourtUpdateRequest $request, Venue $venue, Court $court)
    {
        $this->authorize('update', $venue);
        $this->ensureCourtInVenue($court, $venue);

        $this->courtFlowService->updateCourtWithPricing($court, $request->validated());

        return redirect()
            ->route('merchant.venues.courts.index', $venue->slug)
            ->with('success', 'Lapangan berhasil diperbarui.');
    }

    public function destroy(Venue $venue, Court $court)
    {
        $this->authorize('delete', $venue);
        $this->ensureCourtInVenue($court, $venue);

        $this->courtService->deleteCourt($court);

        return redirect()
            ->route('merchant.venues.courts.index', $venue->slug)
            ->with('success', 'Lapangan berhasil dihapus.');
    }


    public function calendar(Request $request, Venue $venue, Court $court)
    {
        $this->authorize('view', $venue);
        $this->authorize('view', $court);
        $this->ensureCourtInVenue($court, $venue);

        $court->load(['surface', 'venue', 'timeSlots']);

        return Inertia::render('Merchant/Venue/Courts/Partials/CourtCalendar', [
            'venue' => $venue,
            'court' => new CourtResource($court),
            'surfaces' => CourtSurface::all(['id', 'name']),
            'statusType' => CourtStatusType::all(['id', 'name', 'label']),
            'timeSlots' => TimeSlot::orderBy('id')->get(['id', 'start_time', 'end_time'])
        ]);
    }

    public function getCalendarData(Request $request, Venue $venue, Court $court)
    {
        try {
            $this->authorize('view', $venue);
            $this->authorize('view', $court);
            $this->ensureCourtInVenue($court, $venue);

            $view = $request->query('view', 'month');
            $start = $request->query('start');
            $end = $request->query('end');

            $slotDefinitions = $court->timeSlots()
                ->selectRaw('LOWER(day_type) as day_type, count(*) as total')
                ->groupBy('day_type')
                ->pluck('total', 'day_type')
                ->toArray();

            $statusIds = CourtStatusType::whereIn('label', ['Dipesan', 'Event', 'Pemeliharaan'])
                ->pluck('id', 'label');

            $bookedId      = $statusIds['Dipesan'] ?? 999;
            $eventId       = $statusIds['Event'] ?? 999;
            $maintenanceId = $statusIds['Pemeliharaan'] ?? 999;

            if ($view === 'month' || $view === 'dayGridMonth') {
                $schedules = $court->schedules()
                    ->whereBetween('date', [$start, $end])
                    ->selectRaw(
                        'date, 
                        SUM(CASE WHEN status_id = ? THEN 1 ELSE 0 END) as booked,
                        SUM(CASE WHEN status_id = ? THEN 1 ELSE 0 END) as event,
                        SUM(CASE WHEN status_id = ? THEN 1 ELSE 0 END) as maintenance',
                        [$statusIds['Dipesan'] ?? 0, $statusIds['Event'] ?? 0, $statusIds['Pemeliharaan'] ?? 0]
                    )
                    ->groupBy('date')
                    ->get()
                    ->keyBy('date');

                $period = \Carbon\CarbonPeriod::create($start, $end);
                $summary = [];

                foreach ($period as $date) {
                    $dateStr = $date->toDateString();

                    $dayTypeForMatch = $date->isWeekend() ? 'weekend' : 'weekday';
                    $displayDayType = $date->isWeekend() ? 'Weekend' : 'Weekday';

                    $maxSlots = $slotDefinitions[$dayTypeForMatch] ?? 0;

                    $dayData = $schedules->get($dateStr);
                    $b = $dayData ? (int)$dayData->booked : 0;
                    $e = $dayData ? (int)$dayData->event : 0;
                    $m = $dayData ? (int)$dayData->maintenance : 0;

                    $occupied = $b + $e + $m;

                    $summary[] = [
                        'date'        => $dateStr,
                        'day_type'    => $displayDayType,
                        'booked'      => $b,
                        'event'       => $e,
                        'maintenance' => $m,
                        'available'   => max($maxSlots - $occupied, 0),
                        'total_max'   => $maxSlots,
                    ];
                }

                return response()->json(['view' => 'month', 'summary' => $summary]);
            }

            // ================= WEEK / DAY VIEW (Detail Per Jam) =================
            if ($view === 'week' || $view === 'day') {
                $court->load(['timeSlots']);

                $schedules = $court->schedules()
                    ->whereBetween('date', [$startDate, $endDate])
                    ->with(['statusType'])
                    ->get();

                $timezone = 'Asia/Jakarta';
                $slots = collect();

                $period = CarbonPeriod::create($startDate, $endDate);

                foreach ($period as $date) {
                    $dateString = $date->toDateString();
                    $dayType    = $date->isWeekend() ? 'Weekend' : 'Weekday';

                    $relevantSlots = $court->timeSlots->where('day_type', $dayType);

                    foreach ($relevantSlots as $timeslot) {
                        $status = $schedules->first(
                            fn($s) =>
                            $s->date === $dateString && $s->time_slot_id === $timeslot->id
                        );

                        $startDateTime = Carbon::parse($dateString . ' ' . $timeslot->start_time, $timezone);
                        $endDateTime   = Carbon::parse($dateString . ' ' . $timeslot->end_time, $timezone);

                        if ($endDateTime->lt($startDateTime)) {
                            $endDateTime->addDay();
                        }

                        $slots->push([
                            'date'        => $dateString,
                            'timeslot_id' => $timeslot->id,
                            'status'      => $status?->statusType?->label ?? 'Tersedia',
                            'start'       => $startDateTime->toIso8601String(),
                            'end'         => $endDateTime->toIso8601String(),
                            'price'       => $timeslot->pivot->price ?? 0,
                        ]);
                    }
                }

                return response()->json([
                    'view'    => $view,
                    'summary' => [],
                    'slots'   => $slots->values(),
                ]);
            }

            return response()->json(['view' => $view, 'summary' => [], 'slots' => []]);
        } catch (\Throwable $e) {
            Log::error("getCalendarData error: " . $e->getMessage());
            return response()->json(['error' => true, 'message' => $e->getMessage()], 500);
        }
    }

    public function getCalendarMonth(Request $request, Venue $venue, Court $court)
    {
        $this->authorize('view', $venue);
        $this->authorize('view', $court);
        $this->ensureCourtInVenue($court, $venue);

        $slotDefinitions = $court->timeSlots()
            ->selectRaw('day_type, count(*) as total')
            ->groupBy('day_type')
            ->pluck('total', 'day_type');

        $start = Carbon::parse($request->query('start', now()->startOfMonth()->toDateString()))->toDateString();
        $end   = Carbon::parse($request->query('end', now()->endOfMonth()->toDateString()))->toDateString();

        $dbSummary = $court->schedules()
            ->whereBetween('date', [$start, $end])
            ->selectRaw(
                'date, 
                SUM(CASE WHEN status_id = ? THEN 1 ELSE 0 END) as booked,
                SUM(CASE WHEN status_id = ? THEN 1 ELSE 0 END) as event,
                SUM(CASE WHEN status_id = ? THEN 1 ELSE 0 END) as maintenance',
                [$bookedId, $eventId, $maintenanceId]
            )
            ->groupBy('date')
            ->get()
            ->keyBy('date');

        $period = new \DatePeriod(
            Carbon::parse($start),
            new \DateInterval('P1D'),
            Carbon::parse($end)->addDay()
        );

        $summary = collect();

        foreach ($period as $date) {
            $d = $date->format('Y-m-d');
            $carbonDate = Carbon::instance($date);

            $dayType = $carbonDate->isWeekend() ? 'Weekend' : 'Weekday';

            $maxSlotsForThisDay = $slotDefinitions[$dayType] ?? 0;

            $day = $dbSummary->get($d);
            $booked = (int) ($day->booked ?? 0);
            $event  = (int) ($day->event ?? 0);
            $maint  = (int) ($day->maintenance ?? 0);

            $summary->push([
                'date'        => $d,
                'day_type'    => $dayType,
                'booked'      => $booked,
                'event'       => $event,
                'maintenance' => $maint,
                'available'   => max($maxSlotsForThisDay - ($booked + $event + $maint), 0),
            ]);
        }

        return response()->json([
            'view'    => 'month',
            'summary' => $summary,
        ]);
    }

    public function getCalendarWeekDays(Request $request, Venue $venue, Court $court)
    {
        $this->authorize('view', $venue);
        $this->authorize('view', $court);
        $this->ensureCourtInVenue($court, $venue);

        $start = Carbon::parse($request->query('start'))->toDateString();
        $end   = Carbon::parse($request->query('end'))->toDateString();
        $timezone = 'Asia/Jakarta';

        $court->load([
            'timeSlots',
            'schedules' => fn($q) => $q
                ->whereBetween('date', [$start, $end])
                ->with(['statusType']),
        ]);

        $period = new \DatePeriod(
            Carbon::parse($start),
            new \DateInterval('P1D'),
            Carbon::parse($end)->addDay()
        );

        $slots = collect();

        foreach ($period as $date) {
            $carbonDate = Carbon::instance($date);
            $dateStr = $carbonDate->toDateString();

            foreach ($court->timeSlots as $timeslot) {
                $status = $court->schedules
                    ->first(fn($s) => $s->date === $dateStr && $s->time_slot_id === $timeslot->id);

                $startTime = $timeslot->start_time;
                $endTime   = $timeslot->end_time;

                $startDateTime = Carbon::parse($dateStr . ' ' . $startTime, $timezone);
                $endDateTime   = Carbon::parse($dateStr . ' ' . $endTime, $timezone);

                if ($endDateTime->lt($startDateTime)) {
                    $endDateTime->addDay();
                }

                $slots->push([
                    'date'        => $dateStr,
                    'day_type'    => $carbonDate->isWeekend() ? 'Weekend' : 'Weekday',
                    'timeslot_id' => $timeslot->id,
                    'status'      => $status?->statusType?->label ?? 'Tersedia',
                    'start'       => $startDateTime->toIso8601String(),
                    'end'         => $endDateTime->toIso8601String(),
                    'price'       => (int) ($timeslot->pivot->price ?? 0),
                ]);
            }
        }

        return response()->json([
            'view'  => $request->query('view', 'week'),
            'slots' => $slots->values(),
        ]);
    }

    protected function syncTimeSlots(Court $court, array $timeslotIds, array $prices)
    {
        $syncData = [];

        foreach ($timeslotIds as $id) {
            $price = $prices[$id] ?? 0;
            $syncData[$id] = ['price' => (int) $price];
        }

        $court->timeSlots()->sync($syncData);
    }
}
