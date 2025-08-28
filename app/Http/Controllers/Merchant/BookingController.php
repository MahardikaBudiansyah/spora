<?php

namespace App\Http\Controllers\Merchant;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Field;
use App\Models\Venue;
use App\Models\Booking;
use App\Models\TimeSlot;
use App\Models\FieldType;
use Illuminate\Http\Request;
use App\Models\BookingCustomer;
use App\Models\SlotStatusLabel;
use App\Helpers\NumberPhoneHelper;
use App\Http\Controllers\Merchant\Controller;

class BookingController extends Controller
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

    public function index(Request $request, Venue $venue)
    {
        $this->authorizeVenue($venue);
        
        $bookings = Booking::with(['venue', 'invoices', 'details', 'customers'])
            ->where('venue_id', $venue->id)
            ->oldest()
            ->paginate(10)
            ->withQueryString();

        $currentPage = $bookings->currentPage();
        $perPage = $bookings->perPage();

        $bookings->getCollection()->transform(function ($booking, $index) use ($currentPage, $perPage) {
            return [
                'number' => ($currentPage - 1) * $perPage + $index + 1,
                'id' => $booking->id,
                'order_no' => $booking->order_no,
                'status' => $booking->status,
                'total_price' => $booking->total_price,
                'slug' => $booking->slug,
                'updated_at' => $booking->updated_at->format('d M Y'),
            ];
        });

        return Inertia::render('Merchant/Booking/Index', [
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
        
        $this->authorizeVenue($venue); 

        $fieldId = $request->input('field');
        $date = $request->query('date') ?? now()->toDateString();

        $fields = Field::where('venue_id', $venue->id)->get();
        
        $fields->load([
            'timeslots' => fn ($q) => $q->orderBy('name'),
            'type',
            'venue',
            'slotStatuses' => fn ($q) => $q->where('date', $date)->with('slotStatusLabel'),
        ]);
        
        // dd($fields);


       foreach ($fields as $field) {
            $statusMap = $field->slotStatuses->keyBy('time_slot_id');
            // lakukan sesuatu dengan $statusMap
        }

        $defaultStatus = SlotStatusLabel::where('label', 'Tersedia')->first();

        return Inertia::render('Merchant/Booking/Create', [
            'venue' => [
                'id' => $venue->id,
                'name' => $venue->name,
                'location' => $venue->location,
                'phone_number' => $venue->phone_number,
                'slug' => $venue->slug,
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

            'fieldTypes' => FieldType::all(['id', 'name']),
            'slotStatusLabels' => SlotStatusLabel::all(['id', 'label']),
            'timeslots' => TimeSlot::orderBy('name')->get(['id', 'name']),
            'date' => $date,
        ]);
    }

    public function searchCustomer(Request $request, Venue $venue)
    {
        $this->authorizeVenue($venue);

        $phone = $request->query('phone');

        if (!$phone) {
            return response()->json(['error' => 'Phone number required'], 422);
        }

        // normalisasi nomor hp
        $normalizedPhone = NumberPhoneHelper::normalize($phone);

        // cari user terdaftar & booking_customers sebelumnya
        $users = User::where('phone_number', 'like', $normalizedPhone . '%')->get();
        $customers = BookingCustomer::where('phone_number', 'like', $normalizedPhone . '%')->get();

        $results = collect($users)
            ->merge($customers)
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
