<?php

namespace App\Http\Controllers\Merchant;

use App\Enums\MerchantStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Merchant\BookingStoreRequest;
use App\Http\Resources\BookingResource;
use App\Http\Resources\CourtAvailabilityResource;
use App\Http\Resources\VenueResource;
use App\Models\Booking;
use App\Models\Court;
use App\Models\CourtStatusType;
use App\Models\Staff;
use App\Models\Venue;
use App\Services\Booking\BookingFlowService;
use App\Services\Booking\BookingService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class MerchantBookingController extends Controller
{
    protected $bookingFlowService;
    protected $bookingService;

    public function __construct(
        BookingFlowService $bookingFlowService,
        BookingService $bookingService,
    ) {
        $this->bookingFlowService = $bookingFlowService;
        $this->bookingService = $bookingService;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', Booking::class);

        $merchant = $request->user('merchant');
        $bookings = $this->bookingService->getAllByMerchant($merchant->id, 10);

        return Inertia::render('Merchant/Bookings/Index', [
            'merchant' => [
                'id' => $merchant->id,
                'name' => $merchant->name,
            ],
            'bookings' => BookingResource::collection($bookings),
            'venues' => $merchant->venues()->select('id', 'name', 'slug')->get(),
            'can_create' => auth('merchant')->user()->status === MerchantStatus::APPROVED,
        ]);
    }

    public function create(Request $request)
    {
        $this->authorize('create', Booking::class);

        $merchant = $request->user('merchant');

        return Inertia::render('Merchant/Bookings/Create', [
            'merchant' => $merchant->only('id', 'name'),
            'venues'   => VenueResource::collection($merchant->venuesWithAddresses()->with(['paymentPolicies'])->get()),
            'courts' => [],
        ]);
    }

    public function getCourtsByVenue(Request $request, Venue $venue)
    {
        if ($venue->merchant_id !== $request->user('merchant')->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $date = $request->query('date') ?? now()->toDateString();
        $dayOfWeek = date('N', strtotime($date));
        $dayType = ($dayOfWeek >= 6) ? 'weekend' : 'weekday';

        $courts = Court::where('venue_id', $venue->id)
            ->with([
                'surface',
                'timeSlots' => function ($q) use ($dayType) {
                    $q->wherePivot('day_type', $dayType)->orderBy('start_time');
                },
                'schedules' => fn($q) => $q->where('date', $date)->with('statusType'),
            ])->get();

        $defaultStatus = CourtStatusType::where('label', 'Tersedia')->first();
        $fullStatusMap = $courts->mapWithKeys(function ($court) {
            return [$court->id => $court->schedules->keyBy('time_slot_id')];
        });

        $operators = Staff::query()
            ->select('staff.id', 'staff.name')
            ->join('operator_venues', 'staff.id', '=', 'operator_venues.staff_id')
            ->join('operator_assignments', 'operator_venues.id', '=', 'operator_assignments.operator_venue_id')
            ->where('operator_venues.venue_id', $venue->id)
            ->where('staff.status', 'active')
            ->where('operator_assignments.date', $date)
            ->where('operator_assignments.is_active', true)
            ->get();

        return response()->json([
            'venue'     => new VenueResource($venue),
            'courts'    => CourtAvailabilityResource::collection($courts)->additional([
                'status_map'     => $fullStatusMap,
                'default_status' => $defaultStatus
            ]),
            'operators' => $operators,
            'day_type'  => $dayType
        ]);
    }

    public function store(BookingStoreRequest $request)
    {
        $this->authorize('create', Booking::class);

        try {
            $venue = Venue::findOrFail($request->venue_id);

            $booking = $this->bookingFlowService->handleOfflineBooking(
                $request->validated(),
                $venue
            );

            return redirect()->route('merchant.bookings.index')->with('message', 'Booking berhasil dibuat!');
        } catch (\Throwable $e) {
            Log::error('Booking failed (Merchant Scope)', [
                'message' => $e->getMessage(),
            ]);

            return redirect()->back()->withInput()->with('error', $e->getMessage());
        }
    }
}
