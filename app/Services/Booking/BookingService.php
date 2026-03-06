<?php

namespace App\Services\Booking;

use DB;
use Log;
use Carbon\Carbon;
use App\Models\Court;
use App\Models\Venue;
use App\Models\Booking;
use App\Models\Invoice;
use App\Enums\OrderType;
use App\Models\TimeSlot;
use App\Enums\CourtStatus;
use App\Models\Membership;
use App\Enums\BookingStatus;
use App\Helpers\OrderHelper;
use App\Models\CourtSchedule;
use App\Models\CourtStatusType;
use App\Models\MembershipOrder;
use App\Models\VenuePaymentType;
use App\Helpers\NumberPhoneHelper;
use Illuminate\Support\Facades\Auth;
use App\Services\Billing\InvoiceService;
use App\Services\Billing\PaymentService;
use App\Services\System\NotificationService;
use App\Services\Membership\MembershipOrderService;

class BookingService
{
    protected MembershipOrderService $membershipOrderService;

    public function __construct(
        MembershipOrderService $membershipOrderService,
    ) {
        $this->membershipOrderService = $membershipOrderService;
    }

    public function getAllByMerchant($merchantId, $perPage = 10)
    {
        return Booking::query()
            ->whereHas('venue', function ($query) use ($merchantId) {
                $query->where('merchant_id', $merchantId);
            })
            ->with([
                'venue:id,name', 
                'customers',
                'invoice.payments.detail', 
                'details'
            ])
            ->latest()
            ->paginate($perPage)
            ->withQueryString();
    }
    

    public function getByVenue($venueId, $perPage = 10)
    {
        return Booking::with([
                'venue.paymentPolicies',
                'details.court',
                'details.timeSlot',
                'customers',
                'invoice.payments.detail',
            ])
            ->where('venue_id', $venueId)
            ->latest()
            ->paginate($perPage)
            ->withQueryString();
    }

    public function validateCourtsAvailability(array $details)
    {
        $bookedStatusId = CourtStatusType::where('name', CourtStatus::BOOKED->value)->value('id');

        foreach ($details as $item) {
            $isBooked = CourtSchedule::where([
                'court_id'     => $item['court_id'],
                'time_slot_id' => $item['time_slot_id'],
                'date'         => $item['booking_date'],
                'status_id'    => $bookedStatusId
            ])->exists();

            if ($isBooked) {
                throw new \Exception("Jadwal pada lapangan ini di tanggal {$item['booking_date']} sudah dipesan orang lain.");
            }
        }
    }

    public function createBooking(array $data, Venue $venue, ?int $userId = null): Booking
    {
        $this->validateCourtsAvailability($data['details']);

        $policy = $venue->getPolicyFor(OrderType::BOOKING);
        
        $orderNo = OrderHelper::generateOrderNo(
            prefix: 'BOOK',
            venueId: $venue->id,
            userId: $userId ?? ($data['customer_id'] ?? null)
        );

        $memberNo = null;
        if (!empty($data['membership_order_id'])) {
            $membershipOrder = MembershipOrder::find($data['membership_order_id']);
            $memberNo = $membershipOrder?->member_no_snapshot;
        }

        $booking = Booking::create([
            'order_no'              => $orderNo,
            'venue_id'              => $venue->id,
            'membership_order_id'   => $data['membership_order_id'] ?? null, 
            'venue_payment_policy_id' => $policy?->id,
            'operator_assignment_id'  => $data['operator_assignment_id'] ?? null,
            'total_original_price'    => $data['total_original_price'],
            'total_discount'          => $data['total_discount'] ?? 0,
            'total_price'             => $data['total_price'],
            'status'                  => 'pending',

            'member_no_snapshot'             => $memberNo, 
            'customer_name_snapshot'         => $data['customer_name'],
            'customer_phone_number_snapshot' => NumberPhoneHelper::normalize($data['customer_phone']),
            'customer_email_snapshot'        => $data['customer_email'] ?? Auth::user()?->email,
            
            'venue_name_snapshot'     => $venue->name,
            'dp_enabled_snapshot'     => $policy?->enable_dp ?? false,
            'dp_value_snapshot'       => $policy?->dp_value,
            'dp_type_snapshot'        => $policy?->dp_type,
            'full_payment_days_before_snapshot' => $policy?->full_payment_days_before,
        ]);

        $booking->customer()->create([
            'user_id'      => $data['customer_id'] ?? $userId,
            'name'         => $data['customer_name'],
            'phone_number' => NumberPhoneHelper::normalize($data['customer_phone']),
        ]);

        $this->processBookingDetails($booking, $data['details']);

        return $booking;
    }

    protected function processBookingDetails(Booking $booking, array $details)
    {
        $bookedStatusId = CourtStatusType::where('name', CourtStatus::BOOKED->value)->value('id');

        foreach ($details as $item) {
            $court = Court::find($item['court_id']);
            $timeSlot = TimeSlot::find($item['time_slot_id']);

            $date = Carbon::parse($item['booking_date']);
            $dayType = $date->isWeekend() ? 'weekend' : 'weekday';

            $pivotData = DB::table('court_time_slot')
                ->where('court_id', $item['court_id'])
                ->where('time_slot_id', $item['time_slot_id'])
                ->where('day_type', $dayType)
                ->first();

            $timeRange = $timeSlot 
                ? Carbon::parse($timeSlot->start_time)->format('H:i') . ' - ' . Carbon::parse($timeSlot->end_time)->format('H:i')
                : ($item['time_range'] ?? 'Unknown');

            $booking->details()->create([
                'court_id'                  => $item['court_id'],
                'time_slot_id'              => $item['time_slot_id'],
                'booking_date'              => $item['booking_date'],
                'original_price'            => $item['original_price'],
                'discount_amount'           => $item['discount_amount'] ?? 0,
                'final_price'               => $item['final_price'],
                'is_membership_price'       => ($item['discount_amount'] ?? 0) > 0, 
                'court_name_snapshot'       => $item['court_name'] ?? $court?->name,
                'time_slot_name_snapshot'   => $timeRange,
                'day_type_snapshot'         => $pivotData->day_type ?? $dayType,
            ]);

            $schedule = CourtSchedule::where([
                'court_id'     => $item['court_id'],
                'time_slot_id' => $item['time_slot_id'],
                'date'         => $item['booking_date'],
            ])->first();

            if ($schedule && $schedule->status_id == $bookedStatusId) {
                throw new \Exception("Maaf, lapangan ini baru saja dipesan oleh orang lain. Silakan pilih waktu lain.");
            }

            if ($schedule) {
                $schedule->update(['status_id' => $bookedStatusId]);
            } else {
                CourtSchedule::create([
                    'court_id'     => $item['court_id'],
                    'time_slot_id' => $item['time_slot_id'],
                    'date'         => $item['booking_date'],
                    'status_id'    => $bookedStatusId
                ]);
            }
        }
    }

    public function updateStatusAfterPayment(Booking $booking, float $paidAmount)
    {
        if ($paidAmount >= $booking->total_price) {
            $booking->update(['status' => 'confirmed']);
            return;
        } 
        
        if ($booking->dp_enabled_snapshot && $paidAmount >= $this->calculateMinDp($booking)) {
            $booking->update(['status' => 'confirmed']); 
        }
    }

    protected function calculateMinDp(Booking $booking): float
    {
        if ($booking->dp_type_snapshot === 'percentage') {
            return round($booking->total_price * ($booking->dp_value_snapshot / 100));
        }
        return (float) min($booking->dp_value_snapshot, $booking->total_price);
    }

    public function handleExpiredBooking(Booking $booking)
    {
        DB::transaction(function () use ($booking) {
            $booking->update(['status' => BookingStatus::CANCELLED]);

            $availableStatusId = CourtStatusType::where('name', CourtStatus::AVAILABLE->value)->value('id');
            foreach ($booking->details as $detail) {
                CourtSchedule::where([
                    'court_id'     => $detail->court_id,
                    'time_slot_id' => $detail->time_slot_id,
                    'date'         => $detail->booking_date,
                ])->update(['status_id' => $availableStatusId]);
            }

            if ($booking->membership_order_id) {
                $count = $booking->details()->where('is_membership_price', true)->count();
                
                if ($count > 0) {
                    $this->membershipOrderService->restoreDiscountLimit(
                        $booking->membership_order_id, 
                        $count
                    );
                }
            }
            
            Log::info("[BOOKING] Expired & Quota Restored", ['booking_no' => $booking->order_no]);
        });
    }
}
