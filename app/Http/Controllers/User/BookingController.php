<?php

namespace App\Http\Controllers\User;

use Log;
use Carbon\Carbon;
use App\Models\Cart;
use Inertia\Inertia;
use App\Models\Field;
use App\Models\Venue;
use App\Models\Booking;
use App\Models\TimeSlot;
use App\Models\Membership;
use Illuminate\Http\Request;
use App\Models\MembershipUser;
use Illuminate\Support\Facades\Auth;
use App\Services\Billing\PricingService;
use App\Http\Controllers\User\Controller;
use App\Services\Billing\DiscountService;
use App\Services\Booking\BookingUserService;
use App\Http\Requests\User\BookingStoreRequest;

class BookingController extends Controller
{
    private function getUser()
    {
        return Auth::guard('web')->user();
    }

    public function create(Request $request)
    {
        $user = $this->getUser();

        $carts = Cart::with([
            'venue.addresses.district',
            'venue.addresses.city',
            'venue.paymentType',
            'field',
            'timeSlot'
        ])
        ->where('user_id', $user->id)
        ->get();

        $venueId = $carts->first()->venue_id ?? null;

        $activeMembership = Membership::activeForUserVenue($user->id, $venueId)->first();

        $remainingLimit = $activeMembership?->remaining_discount_limits;

        // Map cart untuk menghitung harga & discount
        $cartItems = $carts->map(function ($cart) use ($activeMembership, &$remainingLimit) {
            $originalPrice = (float) $cart->price;
            $discountAmount = 0;

            if ($activeMembership && $remainingLimit && $remainingLimit > 0) {
                $benefit = $activeMembership->membershipPackage->discounts->first();
                if ($benefit) {
                    if ($benefit->discount_type === 'percentage') {
                        $discountAmount = ($originalPrice * $benefit->discount_value) / 100;
                    } else {
                        $discountAmount = min($benefit->discount_value, $originalPrice);
                    }

                    // kurangi remaining limit setelah dipakai
                    if ($remainingLimit !== null) {
                        $remainingLimit--;
                    }
                }
            }

            $finalPrice = max(0, $originalPrice - $discountAmount);

            $venuePaymentType = $cart->venue?->paymentType ? [
                'enable_dp' => $cart->venue->paymentType->enable_dp,
                'dp_type'   => $cart->venue->paymentType->dp_type,
                'dp_value'  => $cart->venue->paymentType->dp_value,
                'is_active' => $cart->venue->paymentType->is_active,
                'full_payment_days_before' => $cart->venue->paymentType->full_payment_days_before,
                'max_full_payment_days'    => $cart->venue->paymentType->max_full_payment_days,
            ] : null;
            
            return [
                'cart_id'        => $cart->id,
                'field_id'       => $cart->field_id,
                'field_name'     => $cart->field->name,
                'timeslot_id'    => $cart->timeSlot?->id,
                'timeslot_name'  => $cart->timeSlot?->name,
                'booking_date'   => $cart->date,
                'original_price' => $originalPrice,
                'discount_amount'=> $discountAmount,
                'final_price'    => $finalPrice,
                'paymentType'    => $venuePaymentType,
                'discount_usage' => $activeMembership ? [
                    'used'  => $activeMembership->membershipPackage->discounts->first()?->discount_limit !== null && $remainingLimit !== null
                                ? ($activeMembership->membershipPackage->discounts->first()->discount_limit - $remainingLimit)
                                : 0,
                    'limit' => $activeMembership->membershipPackage->discounts->first()?->discount_limit ?? 0,
                ] : null,
            ];
        });

        // Hitung summary total
        $originalTotal  = $cartItems->sum('original_price');
        $discountAmount = $cartItems->sum('discount_amount');
        $finalTotal     = $cartItems->sum('final_price');

        // Grouping data untuk tampilan (venue > date > field)
        $grouped = $carts->groupBy('venue_id')->map(function ($venueGroup) {
            $venue = $venueGroup->first()->venue;
            $address = $venue->addresses()->with(['district', 'city'])->first();

            // Ambil paymentType yang terbaru
            $pt = $venue->paymentType;

            $paymentTypes = $pt ? [
                [
                    'enable_dp'                 => $pt->enable_dp,
                    'dp_type'                   => $pt->dp_type,
                    'dp_value'                  => $pt->dp_value,
                    'apply_to_merchant'         => $pt->apply_to_merchant,
                    'is_active'                 => $pt->is_active,
                    'full_payment_days_before'  => $pt->full_payment_days_before,
                    'max_full_payment_days'     => $pt->max_full_payment_days,
                ]
            ] : [];

            // Group per tanggal
            $dates = $venueGroup->groupBy('date')->map(function ($dateGroup, $date) {
                $fields = $dateGroup->groupBy('field_id')->map(function ($fieldGroup) {
                    return [
                        'field' => $fieldGroup->first()->field,
                        'timeslots' => $fieldGroup->map(function ($item) {
                            return [
                                'cart_id'     => $item->id,
                                'timeslot_id' => $item->timeSlot->id,
                                'name'        => $item->timeSlot->name,
                                'price'       => (float) $item->price,
                            ];
                        })->values(),
                    ];
                })->values();

                return [
                    'date'   => $date,
                    'fields' => $fields,
                ];
            })->values();

            return [
                'venue' => [
                    'id'      => $venue->id,
                    'name'    => $venue->name,
                    'slug'    => $venue->slug,
                    'address' => $address ? [
                        'district' => $address->district?->name,
                        'city'     => $address->city?->name,
                    ] : null,
                ],
                'paymentType' => $paymentTypes,
                'dates' => $dates,
            ];
        })->values();

        return Inertia::render('User/Booking/Create', [
            'user' => [
                'id'           => $user->id,
                'name'         => $user->name,
                'email'        => $user->email,
                'phone_number' => $user->phone_number,
                'photo'        => $user->photo,
                'membership'   => $activeMembership ? [
                    'id'              => $activeMembership->id,
                    'order_no'        => $activeMembership->order_no,
                    'package_name'    => $activeMembership->membershipPackage->name,
                    'package_id'      => $activeMembership->membershipPackage->id,
                    'venue_id'        => $activeMembership->membershipUser->venue_id,
                    'venue_name'      => $activeMembership->membershipUser->venue?->name,
                    'member_no'       => $activeMembership->membershipUser->member_no,
                    'start_date'      => $activeMembership->start_date,
                    'end_date'        => $activeMembership->end_date,
                    'status'          => $activeMembership->status,
                    'total_price'     => (float) $activeMembership->total_price,
                    'discount' => [
                        'type'   => $activeMembership->membershipPackage->discounts->first()?->discount_type,
                        'value'  => $activeMembership->membershipPackage->discounts->first()?->discount_value ?? 0,
                        'limit'  => $activeMembership->membershipPackage->discounts->first()?->discount_limit ?? 0,
                        'used'   => ($activeMembership->membershipPackage->discounts->first()?->discount_limit ?? 0)
                                    - ($activeMembership->remaining_discount_limits ?? 0),
                        'remain' => $activeMembership->remaining_discount_limits ?? 0,
                    ],
                ] : null,
            ],
            'carts'   => $grouped,
            'items'   => $cartItems,
            'summary' => [
                'original_total'  => $originalTotal,
                'discount_amount' => $discountAmount,
                'final_total'     => $finalTotal,
            ],
        ]);

    }
    
    public function store(BookingStoreRequest $request)
    {
        try {
            $validated = $request->validated();
            $user = $this->getUser();

            // Overwrite customer info dari user login
            $validated['customer'] = [
                'user_id'      => $user->id,
                'name'         => $user->name,
                'phone_number' => $user->phone_number,
            ];

            // Ambil field & venue
            $fieldId = $validated['details'][0]['field_id'] ?? null;
            $field = Field::with('venue.paymentType')->findOrFail($fieldId);
            $venue = $field->venue;

            // Pastikan payment array ada
            $validated['payment'] = $validated['payment'] ?? [];

            // Tentukan tipe pembayaran (DP/full) jika diperlukan
            $venuePaymentType = $venue->paymentType()->first();
            if ($venuePaymentType?->enable_dp) {
                $earliestBookingDate = collect($validated['details'])
                    ->min(fn($d) => Carbon::parse($d['booking_date']));
                $daysBeforePlay = now()->diffInDays(Carbon::parse($earliestBookingDate), false);

                if ($daysBeforePlay <= $venuePaymentType->full_payment_days_before) {
                    $validated['payment']['type'] = 'full_payment';
                    Log::info("DP tidak berlaku karena booking mendadak. Diubah ke full payment.", [
                        'days_before_play' => $daysBeforePlay,
                        'required_min'     => $venuePaymentType->full_payment_days_before,
                    ]);
                }
            }

            // Buat booking via service
            [$booking, $invoice, $payment, $snapToken] = app(BookingUserService::class)
                ->create($validated, $venue, $request);

            return response()->json([
                'success'      => true,
                'booking_slug' => $booking->slug,
                'invoice_no'   => $invoice->invoice_no,
                'payment_id'   => $payment['id'] ?? null,
                'snap_token'   => $snapToken,
            ]);

        } catch (\Throwable $e) {
            report($e);
            Log::error('Booking store error', [
                'message' => $e->getMessage(),
                'trace'   => $e->getTraceAsString(),
                'payload' => $request->all(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat membuat booking.',
            ], 500);
        }
    }






}