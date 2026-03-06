<?php

namespace App\Http\Controllers\Merchant;

use Str;
use Carbon\Carbon;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Court;
use App\Models\Staff;
use App\Models\Venue;
use App\Models\Booking;
use App\Models\TimeSlot;
use App\Helpers\OrderHelper;
use App\Models\CourtSurface;
use Illuminate\Http\Request;
use App\Models\CourtSchedule;
use App\Helpers\InvoiceHelper;
use App\Models\BookingCustomer;
use App\Models\CourtStatusType;
use App\Helpers\NumberPhoneHelper;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Resources\VenueResource;
use App\Http\Resources\BookingResource;
use App\Services\Booking\BookingService;
use App\Services\Booking\BookingFlowService;
use App\Http\Controllers\Merchant\Controller;
use Illuminate\Validation\ValidationException;
use App\Http\Resources\CourtAvailabilityResource;
use App\Http\Requests\Merchant\BookingStoreRequest;

class VenueBookingController extends Controller
{
    protected $bookingFlowService;
    protected $bookingService;

    public function __construct(
        BookingFlowService $bookingFlowService,
        BookingService $bookingService,
    ){
        $this->bookingFlowService = $bookingFlowService;
        $this->bookingService = $bookingService;
    }

    public function index(Request $request, Venue $venue)
    {
        $this->authorize('view', $venue);   
        $this->authorize('viewAny', Booking::class);

        $bookings = $this->bookingService->getByVenue($venue->id, 10);

        return Inertia::render('Merchant/Venue/Bookings/Index', [
            'bookings' => BookingResource::collection($bookings),
            'venue' => [
                'id' => $venue->id,
                'name' => $venue->name,
                'slug' => $venue->slug,
            ],
        ]);
    }

    public function create(Request $request, Venue $venue)
    {
        $this->authorize('view', $venue);

        $date = $request->query('date') ?? now()->toDateString();
        $dayOfWeek = date('N', strtotime($date)); 
        $dayType = ($dayOfWeek >= 6) ? 'weekend' : 'weekday';

        $courts = Court::where('venue_id', $venue->id)
            ->with([
                'surface',
                'timeSlots' => function ($q) use ($dayType) {
                    $q->wherePivot('day_type', $dayType)->orderBy('start_time');
                },
                'schedules' => fn ($q) => $q->where('date', $date)->with('statusType'),
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

        return Inertia::render('Merchant/Venue/Bookings/Create', [
            'venue'    => new VenueResource($venue->loadMissing(['addresses.village', 'addresses.district', 'addresses.city', 'addresses.province', 'paymentPolicies',])),
            'courts'   => CourtAvailabilityResource::collection($courts)->additional([
                'status_map'     => $fullStatusMap,
                'default_status' => $defaultStatus
            ]),
            'operators' => $operators,
        ]);
    }

    public function store(BookingStoreRequest $request, Venue $venue)
    {
        $this->authorize('create', Booking::class);

        try {
            $booking = $this->bookingFlowService->handleOfflineBooking(
                $request->validated(), 
                $venue
            );

            return response()->json([
                'success'    => true,
                'booking_id' => $booking->id,
                'order_no'   => $booking->order_no,
                'message'    => 'Booking berhasil dibuat.'
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'errors'  => $e->errors(),
            ], 422);
        } catch (\Throwable $e) {
            Log::error('Booking failed (Venue Scope)', [
                'venue_id' => $venue->id,
                'message'  => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'error'   => 'Terjadi kesalahan sistem saat memproses booking.',
            ], 500);
        }
    }


}
