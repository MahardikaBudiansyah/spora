<?php

namespace App\Http\Controllers\Merchant;

use Str;
use Carbon\Carbon;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Field;
use App\Models\Staff;
use App\Models\Venue;
use App\Models\Booking;
use App\Models\TimeSlot;
use App\Models\FieldType;
use App\Models\SlotStatus;
use App\Helpers\OrderHelper;
use Illuminate\Http\Request;
use App\Helpers\InvoiceHelper;
use App\Models\BookingCustomer;
use App\Models\SlotStatusLabel;
use App\Helpers\NumberPhoneHelper;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Merchant\Controller;
use App\Services\Booking\BookingMerchantService;
use App\Http\Requests\Merchant\BookingStoreRequest;

class BookingController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Venue::class, 'venue');
    }

    public function index(Request $request, Venue $venue)
    {
        $bookings = Booking::with([
            'venue.paymentType',
            'details.field',
            'details.timeSlot',
            'customers',
            'invoice.payments.detail',
        ])
            ->where('venue_id', $venue->id)
            ->latest()
            ->paginate(10)
            ->withQueryString();

        $currentPage = $bookings->currentPage();
        $perPage = $bookings->perPage();

        $bookings->getCollection()->transform(function ($booking, $index) use ($currentPage, $perPage) {
            $paidAmount = 0;
            $remainingAmount = 0;
            $invoice = $booking->invoice;

            if ($invoice) {
                $paidAmount = $invoice->payments
                    ->where('payment_status', 'paid')
                    ->sum('amount');

                $totalAmount = $invoice->total_amount;
                $remainingAmount = max($totalAmount - $paidAmount, 0);
            }

            return [
                'number' => ($currentPage - 1) * $perPage + $index + 1,
                'id' => $booking->id,
                'order_no' => $booking->order_no,
                'venue_id' => $booking->venue_id,
                'status' => $booking->status,
                'invoice_status' => $invoice?->status ?? '-',
                'total_original_price' => $booking->total_original_price,
                'total_discount' => $booking->total_discount,
                'total_price' => $booking->total_price,
                'paid_amount' => $paidAmount,
                'remaining_amount' => $remainingAmount,
                'slug' => $booking->slug,
                'created_at' => $booking->created_at,

                'customers' => $booking->customers?->map(fn($customer) => [
                    'id' => $customer->id,
                    'booking_id' => $customer->booking_id,
                    'user_id' => $customer->user_id,
                    'name' => $customer->name,
                    'phone_number' => $customer->phone_number,
                ]) ?? [],

                'payment_rule' => $booking->venuePaymentType ? [
                    'enable_dp' => $booking->venuePaymentType->enable_dp,
                    'dp_type' => $booking->venuePaymentType->dp_type,
                    'dp_value' => $booking->venuePaymentType->dp_value,
                    'apply_to_merchant' => $booking->venuePaymentType->apply_to_merchant,
                ] : null,

                'details' => $booking->details?->map(fn($detail) => [
                    'id' => $detail->id,
                    'field_id' => $detail->field_id,
                    'field_name' => $detail->field?->name,
                    'time_slot_id' => $detail->time_slot_id,
                    'time_slot' => $detail->timeSlot?->name,
                    'original_price' => $detail->original_price,
                    'discount_amount' => $detail->discount_amount,
                    'final_price' => $detail->final_price,
                    'booking_date' => $detail->booking_date,
                ]) ?? [],

                'invoice' => $invoice ? [
                    'id' => $invoice->id,
                    'invoice_no' => $invoice->invoice_no,
                    'total_amount' => $invoice->total_amount,
                    'status' => $invoice->status,
                    'due_date' => $invoice->due_date,
                    'payments' => $invoice->payments?->map(fn($payment) => [
                        'id' => $payment->id,
                        'method' => $payment->payment_method,
                        'type' => $payment->payment_type,
                        'gateway_order_id' => $payment->gateway_order_id,
                        'amount' => $payment->amount,
                        'status' => $payment->payment_status,
                        'detail' => $payment->detail ? [
                            'provider' => $payment->detail->payment_provider,
                            'channel' => $payment->detail->payment_channel,
                            'reference_no' => $payment->detail->reference_no,
                            'payer_name' => $payment->detail->payer_name,
                            'payment_date' => $payment->detail->payment_date,
                            'proof' => $payment->detail->proof_of_payment,
                        ] : null,
                    ]),
                ] : null,
            ];
        });

        return Inertia::render('Merchant/Venue/Booking/Index', [
            'bookings' => $bookings,
            'venue' => [
                'id' => $venue->id,
                'name' => $venue->name,
                'slug' => $venue->slug,
            ],
        ]);
    }





    public function create(Request $request, Venue $venue)
    {
        $venue->load('addresses');
        $fieldId = $request->input('field');
        $date = $request->query('date') ?? now()->toDateString();

        $fields = Field::where('venue_id', $venue->id)->get();
        
        $fields->load([
            'timeslots' => fn ($q) => $q->orderBy('name'),
            'type',
            'venue',
            'slotStatuses' => fn ($q) => $q->where('date', $date)->with('slotStatusLabel'),
        ]);
        


        foreach ($fields as $field) {
            $statusMap = $field->slotStatuses->keyBy('time_slot_id');
            // lakukan sesuatu dengan $statusMap
        }

        $defaultStatus = SlotStatusLabel::where('label', 'Tersedia')->first();

        $operators = Staff::query()
            ->select('staff.id', 'staff.name')
            ->join('operator_venues', 'staff.id', '=', 'operator_venues.staff_id')
            ->join('operator_assignments', 'operator_venues.id', '=', 'operator_assignments.operator_venue_id')
            ->where('operator_venues.venue_id', $venue->id)
            ->where('staff.status', 'active')
            ->where('operator_assignments.date', $date)
            ->where('operator_assignments.is_active', true)
            ->get();

        return Inertia::render('Merchant/Venue/Booking/Create', [
            'venue' => [
                'id' => $venue->id,
                'name' => $venue->name,
                'phone_number' => $venue->phone_number,
                'slug' => $venue->slug,
                'addresses' => $venue->addresses->map(function ($addr) {
                    return [
                        'id' => $addr->id,
                        'address' => $addr->address,
                        'type' => $addr->type,
                        'branch_name' => $addr->branch_name,
                        'province_code' => $addr->province_code,
                        'province_name' => $addr->province?->name,
                        'city_code' => $addr->city_code,
                        'city_name' => $addr->city?->name,
                        'district_code' => $addr->district_code,
                        'district_name' => $addr->district?->name,
                        'village_code' => $addr->village_code,
                        'village_name' => $addr->village?->name,
                        'postal_code' => $addr->postal_code,
                        'latitude' => $addr->latitude,
                        'longitude' => $addr->longitude,
                    ];
                }),
            ],
            'fields' => $fields->map(function ($field) use ($defaultStatus) {
                $statusMap = $field->slotStatuses->keyBy('time_slot_id');

                return [
                    'id' => $field->id,
                    'name' => $field->name,
                    'field_type' => $field->type->name,
                    'timeslot_ids' => $field->timeslots->pluck('id'),
                    'prices' => $field->timeslots->mapWithKeys(fn ($ts) => [
                        $ts->id => $ts->pivot->price,
                    ]),
                    'slots' => $field->timeslots->map(function ($ts) use ($statusMap, $defaultStatus) {
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
            'operators' => $operators, 
            'fieldTypes' => FieldType::all(['id', 'name']),
            'slotStatusLabels' => SlotStatusLabel::all(['id', 'label']),
            'timeslots' => TimeSlot::orderBy('name')->get(['id', 'name']),
            'date' => $date,
        ]);
    }


    public function store(BookingStoreRequest $request, Venue $venue, BookingMerchantService $bookingService)
    {
        try {
            $booking = $bookingService->create($request->validated(), $venue, $request);

            return response()->json([
                'success'    => true,
                'booking_id' => $booking->id,
                'order_no'   => $booking->order_no,
            ]);
        } catch (\Throwable $e) {
            \Log::error('Booking failed (merchant)', [
                'venue_id' => $venue->id,
                'message'  => $e->getMessage(),
                'trace'    => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function searchCustomer(Request $request, Venue $venue)
    {
        $this->authorize('view', $venue);

        $phone = $request->query('phone');

        if (!$phone) {
            return response()->json(['error' => 'Phone number required'], 422);
        }

        $normalizedPhone = NumberPhoneHelper::normalize($phone);

        $users = User::where('phone_number', 'like', $normalizedPhone . '%')
            ->limit(10)
            ->get();

        $customers = BookingCustomer::where('phone_number', 'like', $normalizedPhone . '%')
            ->limit(10)
            ->get();

        $results = collect($users)
            ->merge($customers)
            ->unique('phone_number')
            ->take(10)
            ->map(fn($cust) => [
                'user_id' => $cust->id ?? $cust->user_id,
                'name' => $cust->name,
                'email' => $cust->email,
                'phone_number' => $cust->phone_number,
            ])
            ->values();

        return response()->json($results);
    }



}
