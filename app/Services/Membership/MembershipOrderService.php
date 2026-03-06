<?php

namespace App\Services\Membership;

use Log;
use Carbon\Carbon;
use App\Enums\OrderType;
use App\Helpers\OrderHelper;
use App\Models\MembershipCard;
use App\Enums\NotificationType;
use App\Models\MembershipOrder;
use App\Models\MembershipPackage;
use Illuminate\Support\Facades\DB;
use App\Enums\MembershipOrderStatus;
use App\Services\System\NotificationService;
use Illuminate\Validation\ValidationException;

class MembershipOrderService
{
    protected MembershipCardService $cardService;
    protected NotificationService $notificationService;

    public function __construct(
        MembershipCardService $cardService,
        NotificationService $notificationService,
    )
    {
        $this->cardService = $cardService;
        $this->notificationService = $notificationService;
    }

    public function getAllByMerchant(int $merchantId, int $perPage = 10)
    {
        return MembershipOrder::with([
            'membershipCard.user',
            'membershipPackage.venue',
            'membershipPackage.discounts', 
            'membershipPackage.others', 
            'invoice'
        ])
        ->whereHas('membershipPackage.venue', fn($q) => $q->where('merchant_id', $merchantId))
        ->latest()
        ->paginate($perPage)
        ->withQueryString();
    }

    public function getAllByVenue(int $venueId, int $perPage = 10)
    {
        return MembershipOrder::with([
            'membershipCard.user',
            'membershipPackage.discounts',
            'membershipPackage.others',
            'invoice'
        ])
        ->whereHas('membershipPackage', fn($q) => $q->where('venue_id', $venueId))
        ->latest()
        ->paginate($perPage)
        ->withQueryString();
    }

    public function createOrder(array $data, MembershipCard $card): MembershipOrder
    {
        $package = MembershipPackage::with(['venue.paymentPolicies', 'discounts'])->findOrFail($data['package_id']); 
        $venue = $package->venue;
        $policy = $venue->getPolicyFor(OrderType::MEMBERSHIP);

        $inputStartDate = $data['start_date'] ?? null;
        $dates = $this->calculateOrderDates($card, $package->duration_months, $inputStartDate);

        $shouldQueue = $dates['is_renewal']; 
        $status = MembershipOrderStatus::PENDING;

        $pricing = $this->calculatePrice($package, $data);

        $benefit = $package->discounts->first(); 

        $orderNo = OrderHelper::generateOrderNo(
            prefix: 'MEM',
            venueId: $venue->id,
            userId: $card->user_id ?? null
        );

        $order = MembershipOrder::create([
            'order_no' => $orderNo,
            'membership_card_id' => $card->id,
            'membership_package_id' => $package->id,
            'venue_id' => $venue->id,
            'venue_payment_policy_id' => $policy?->id,
            'operator_assignment_id' => $data['operator_assignment_id'] ?? null,
            
            'venue_name_snapshot' => $venue->name,
            'operator_name_snapshot' => $data['operator_name'] ?? null,

            'member_no_snapshot' => $card->member_no,
            'member_name_snapshot' => $card->name,
            'member_number_phone_snapshot' => $card->phone_number,

            'package_name_snapshot' => $package->name,
            'duration_month_snapshot' => $package->duration_months,
            'discount_type_snapshot' => $benefit?->discount_type,
            'discount_value_snapshot' => $benefit?->discount_value,
            'discount_limit_snapshot' => $benefit?->discount_limit,

            'dp_enabled_snapshot' => $policy?->enable_dp ?? false,
            'dp_type_snapshot' => $policy?->dp_type,
            'dp_value_snapshot' => $policy?->dp_value,
            // ----------------------

            'total_price' => $pricing['total'],
            'start_date' => $dates['start_date']->toDateString(),
            'end_date' => $dates['end_date']->toDateString(),
            'status' => $status, 
            'is_queued' => $shouldQueue,
            'remaining_discount_limits' => $this->calculateRemainingDiscounts($package),
        ]);

        Log::info("[MEMBERSHIP_ORDER_CREATED]", [
            'order_id'   => $order->id,
            'order_no'   => $order->order_no,
            'user_id'    => $card->user_id,
            'package'    => $order->package_name_snapshot,
            'status'     => $order->status,
            'is_queued'  => $order->is_queued,
            'start_date' => $order->start_date,
            'end_date'   => $order->end_date,
        ]);

        return $order;
    }

    public function previewDates(MembershipCard $card, int $durationMonths, ?Carbon $inputStartDate = null): array
    {
        return $this->calculateOrderDates($card, $durationMonths, $inputStartDate);
    }

    protected function calculateOrderDates(MembershipCard $card, int $durationMonths, ?Carbon $inputStartDate = null): array
    {
        $lastOrder = $card->orders()
            ->whereIn('status', [
                MembershipOrderStatus::ACTIVE, 
                MembershipOrderStatus::QUEUED
            ])
            ->orderBy('end_date', 'desc')
            ->first();
        
        $startDate = Carbon::today()->startOfDay();
        $isRenewal = false;

        if ($lastOrder) {
            $autoStartDate = (new Carbon($lastOrder->end_date))->addDay()->startOfDay();
            
            if ($inputStartDate && $inputStartDate->lessThan($autoStartDate)) {
                $startDate = $autoStartDate;
                $isRenewal = true;

            } else if ($inputStartDate && $inputStartDate->greaterThanOrEqualTo($autoStartDate)) {
                $startDate = $inputStartDate;
                $isRenewal = true;

            } else {
                $startDate = $autoStartDate;
                $isRenewal = true;
            }

        } else {
            if ($inputStartDate) {
                $startDate = $inputStartDate;
            } else {
                $startDate = Carbon::today()->startOfDay();
            }
            $isRenewal = false;
        } 

        $endDate = (new Carbon($startDate))
            ->addMonths($durationMonths)
            ->subDay()
            ->endOfDay();
        
        return [
            'start_date' => $startDate,
            'end_date' => $endDate,
            'is_renewal' => $isRenewal,
        ];
    }

    public function getPackage(int $packageId): MembershipPackage
    {
        return MembershipPackage::with('discounts')->findOrFail($packageId);
    }

    private function calculatePrice(MembershipPackage $package, array $data): array
    {
        $qty = $data['qty'] ?? 1;
        $subtotal = $package->price * $qty;
        $discount = $data['discount'] ?? 0;

        return [
            'subtotal' => $subtotal,
            'discount' => $discount,
            'total' => max(0, $subtotal - $discount),
        ];
    }

    public function autoActivateQueuedMemberships(): int
    {
        $activatedCount = 0;

        MembershipOrder::where('status', MembershipOrderStatus::QUEUED)
            ->where('start_date', '<=', now()->toDateString())
            ->chunk(100, function ($queuedOrders) use (&$activatedCount) {
                foreach ($queuedOrders as $order) {
                    $anyActive = MembershipOrder::where('membership_card_id', $order->membership_card_id)
                        ->where('status', MembershipOrderStatus::ACTIVE)
                        ->exists();

                    if (!$anyActive && $order->invoice?->status === 'paid') {
                        $order->update(['status' => MembershipOrderStatus::ACTIVE]);
                        $activatedCount++;

                        if ($order->membershipCard->user) {
                            $this->notificationService->send(
                                $order->membershipCard->user,
                                NotificationType::MEMBERSHIP_ACTIVATED,
                                [
                                    'order_no' => $order->order_no,
                                    'message' => "Membership {$order->package_name_snapshot} Anda sudah aktif per hari ini!",
                                    'start_date' => $order->start_date
                                ]
                            );
                        }
                    }
                }
            });

        return $activatedCount;
    }

    public function autoExpireMemberships(): int
    {
        $expiredOrders = MembershipOrder::with('membershipCard.user')
            ->where('status', MembershipOrderStatus::ACTIVE)
            ->where('end_date', '<', now()->toDateString())
            ->get();

        foreach ($expiredOrders as $order) {
            $order->update(['status' => MembershipOrderStatus::EXPIRED]);

            if ($order->membershipCard->user) {
                $this->notificationService->send(
                    $order->membershipCard->user,
                    NotificationType::MEMBERSHIP_EXPIRED,
                    [
                        'order_no' => $order->order_no,
                        'message' => "Masa berlaku membership {$order->package_name_snapshot} Anda telah berakhir.",
                    ]
                );
            }
        }

        return $expiredOrders->count();
    }

    public function cancelOrder(MembershipOrder $order)
    {
        $order->update(['status' => MembershipOrderStatus::CANCELLED]);
    }

    public function calculateRemainingDiscounts(MembershipPackage $package): int
    {
        return (int) ($package->discounts->first()?->discount_limit ?? 0);
    }

    public function consumeDiscountLimit(int $orderId, int $usageCount)
    {
        if ($usageCount <= 0) return;

        DB::transaction(function () use ($orderId, $usageCount) {
            $order = MembershipOrder::with('membershipCard.user')
                ->lockForUpdate()
                ->findOrFail($orderId);

            if ($order->remaining_discount_limits < $usageCount) {
                throw new \Exception("Gagal melakukan pemesanan: Sisa kuota membership tidak mencukupi.");
            }

            $order->decrement('remaining_discount_limits', $usageCount);
            
            $order->refresh(); 

            Log::info("[MEMBERSHIP] Kuota terpakai", [
                'order_no' => $order->order_no,
                'consumed' => $usageCount,
                'remaining_after' => $order->remaining_discount_limits
            ]);

            if ($order->membershipCard->user && $order->remaining_discount_limits <= 2 && $order->remaining_discount_limits > 0) {
                $this->notificationService->send(
                    $order->membershipCard->user,
                    NotificationType::PAYMENT_REMINDER, 
                    [
                        'order_no' => $order->order_no,
                        'message'  => "Halo {$order->membershipCard->user->name}, kuota member Anda tinggal {$order->remaining_discount_limits}. Jangan lupa top-up ya!",
                        'remaining'=> $order->remaining_discount_limits
                    ]
                );
            }
        });
    }

    public function restoreDiscountLimit(int $orderId, int $count)
    {
        if ($count <= 0) return;

        $order = MembershipOrder::findOrFail($orderId);
        $order->increment('remaining_discount_limits', $count);
        
        Log::info("[MEMBERSHIP] Kuota dikembalikan", [
            'order_no' => $order->order_no, 
            'count' => $count,
            'new_balance' => $order->remaining_discount_limits
        ]);
    }

}
