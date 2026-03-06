<?php

namespace App\Http\Controllers\Merchant;

// Tambahkan import Log
use Illuminate\Support\Facades\Log; 
use DB;
use Carbon\Carbon;
use App\Models\User;
use App\Models\Venue;
use App\Models\Booking;
use Illuminate\Http\Request;
use App\Models\MembershipCard;
use App\Helpers\NumberPhoneHelper;
use App\Http\Resources\BookingResource;
use App\Http\Controllers\Merchant\Controller;
use App\Http\Resources\MembershipCardResource;

class CustomerUtilityController extends Controller
{
    public function searchCustomer(Request $request)
    {
        try {
            $venueId = $request->query('venue_id');
            $phone = $request->query('phone');

            if (!$phone || !$venueId) return response()->json([]);

            $normalizedPhone = NumberPhoneHelper::normalize($phone);

            $results = MembershipCard::with(['user', 'latestOrder'])
                ->where('venue_id', $venueId)
                ->where('phone_number', 'like', $normalizedPhone . '%')
                ->limit(10)
                ->get()
                ->map(function ($card) {
                    return [
                        'user_id'      => $card->user_id, 
                        'name'         => $card->name ?? $card->user?->name,
                        'email'        => $card->email ?? $card->user?->email,
                        'phone_number' => $card->phone_number,
                        'member_no'    => $card->member_no,
                        'active_until' => $card->latestOrder?->end_date,
                        'last_package' => $card->latestOrder?->membershipPackage?->name,
                        'source'       => 'membership'
                    ];
                });

            if ($results->isEmpty()) {
                $results = User::where('phone_number', 'like', $normalizedPhone . '%')
                    ->limit(5)
                    ->get()
                    ->map(fn($u) => [
                        'user_id'      => $u->id,
                        'name'         => $u->name,
                        'email'        => $u->email,
                        'phone_number' => $u->phone_number,
                        'member_no'    => null,
                        'source'       => 'global_user'
                    ]);
            }

            return response()->json($results);
            
        } catch (\Exception $e) {
            Log::error("SearchCustomer Error: " . $e->getMessage(), [
                'line' => $e->getLine(),
                'file' => $e->getFile(),
                'params' => $request->all()
            ]);
            return response()->json(['error' => $e->getMessage(), 'line' => $e->getLine()], 500);
        }
    }

    public function checkCustomer(Request $request)
    {
        // Log info awal untuk debug parameter
        Log::info("Checking customer started", $request->only(['phone', 'email', 'venue_id']));

        try {    
            $venueId = $request->query('venue_id');
            $phone   = $request->query('phone');
            $email   = $request->query('email');

            if (!$venueId) return response()->json(['error' => 'Venue ID diperlukan'], 422);

            $normalizedPhone = $phone ? NumberPhoneHelper::normalize($phone) : null;
            
            // 1. Cari User Online
            $userByPhone = $normalizedPhone ? User::where('phone_number', $normalizedPhone)->first() : null;
            $userByEmail = ($email && str_contains($email, '@')) ? User::where('email', $email)->first() : null;

            // 2. Cek Konflik Identitas
            if ($userByEmail && $userByPhone && ($userByPhone->id !== $userByEmail->id)) {
                Log::warning("Identity Conflict detected", ['phone' => $normalizedPhone, 'email' => $email]);
                return response()->json([
                    'is_identity_conflict' => true,
                    'phone_number' => $userByEmail->phone_number,
                ]);
            }

            $user = $userByPhone ?? $userByEmail;

            // 3. Ambil Data Membership
            $card = MembershipCard::with([
                'user', 
                'latestOrder', 
                'latestOrder.membershipPackage', 
                'latestOrder.membershipPackage.discounts'
            ])
                ->where('venue_id', $venueId)
                ->where(function ($q) use ($user, $normalizedPhone) {
                    if ($user) {
                        $q->where('user_id', $user->id);
                        if ($normalizedPhone) {
                            $q->orWhere('phone_number', $normalizedPhone);
                        }
                    } elseif ($normalizedPhone) {
                        $q->where('phone_number', $normalizedPhone);
                    } else {
                        $q->whereRaw('1 = 0');
                    }
                })
                ->latest()
                ->first();

            $lastBooking = Booking::with([
                'details.court', 
                'invoice.payments', 
                'venue',
                'operatorAssignment.operator'
            ])
                ->where('venue_id', $venueId)
                ->whereHas('customers', function($q) use ($user, $normalizedPhone) {
                    $q->where(function($inner) use ($user, $normalizedPhone) {
                        if ($user) {
                            $inner->where('user_id', $user->id);
                            if ($normalizedPhone) {
                                $inner->orWhere('phone_number', $normalizedPhone);
                            }
                        } elseif ($normalizedPhone) {
                            $inner->where('phone_number', $normalizedPhone);
                        }
                    });
                })
                ->latest()
                ->first();


            Log::info("Debug Data", [
                'card_exists' => !is_null($card),
                'booking_exists' => !is_null($lastBooking),
                'user_id' => $user?->id
            ]);

            $cardResource = $card 
                ? MembershipCardResource::make($card)->resolve() 
                : null;
            $bookingResource = $lastBooking 
                ? BookingResource::make($lastBooking)->resolve() 
                : null;

            if ($lastBooking) {
                Log::info("Booking Found for UI", [
                    'order_no' => $lastBooking->order_no,
                    'has_invoice' => !is_null($lastBooking->invoice),
                    'payment_count' => $lastBooking->invoice ? $lastBooking->invoice->payments->count() : 0,
                    'payment_sum' => $lastBooking->invoice ? $lastBooking->invoice->payments->sum('amount') : 0,
                ]);
            }

            return response()->json([
                'user_id'               => $user?->id,
                'is_already_member'     => !is_null($card),
                'member_no'             => $card?->member_no,
                'name'                  => $cardResource['customer']['name'] ?? $card?->name ?? $user?->name,
                'email'                 => $cardResource['customer']['email'] ?? $card?->email ?? $user?->email,
                'phone_number'          => $cardResource['customer']['phone_number'] ?? $card?->phone_number ?? $user?->phone_number ?? $normalizedPhone,
                'has_active_membership' => $cardResource['has_active_membership'] ?? false,
                'active_until'          => ($card?->latestOrder?->end_date) ? Carbon::parse($card->latestOrder->end_date)->format('Y-m-d') : null,
                'active_until_label'    => $cardResource['expired_at'] ?? null,
                'last_package'          => $cardResource['last_package_name'] ?? $card?->latestOrder?->membershipPackage?->name,
                'membership_benefit'    => $cardResource['membership_benefit'] ?? null,
                'last_booking'          => $bookingResource,
                'found_via'             => $userByPhone ? 'phone' : ($userByEmail ? 'email' : 'none'),
                'is_identity_conflict'  => false,
            ]);

        } catch (\Exception $e) {
            Log::error("CheckCustomer Failed!", [
                'message' => $e->getMessage(),
                'file'    => $e->getFile(),
                'line'    => $e->getLine(),
                'trace'   => $e->getTraceAsString() 
            ]);

            return response()->json([
                'error' => 'Internal Server Error',
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ], 500);
        }
    }
}