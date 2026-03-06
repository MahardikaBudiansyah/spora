<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use App\Enums\MembershipOrderStatus;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MembershipCardResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $orders = $this->orders ?? collect();

        $activeOrder = $orders->first(function ($order) {
            $statusValue = $order->status instanceof MembershipOrderStatus 
                ? $order->status->value : $order->status;
            return $statusValue === MembershipOrderStatus::ACTIVE->value;
        });

        $queuedOrders = $orders->filter(function ($order) {
            $statusValue = $order->status instanceof MembershipOrderStatus 
                ? $order->status->value : $order->status;
            return $statusValue === MembershipOrderStatus::QUEUED->value;
        })->values();

        // Helper untuk mapping data agar konsisten
        $mapOrder = function($order) {
            if (!$order) return null;

            // Logika Fallback: Jika snapshot null, ambil dari relasi (asumsi relasi package & discounts di-load)
            $discountType = $order->discount_type_snapshot 
                ?? $order->membershipPackage?->discounts?->first()?->discount_type 
                ?? 'percentage';
                
            $discountValue = (float) ($order->discount_value_snapshot 
                ?? $order->membershipPackage?->discounts?->first()?->discount_value 
                ?? 0);

            return [
                'package_name' => $order->package_name_snapshot ?? $order->membershipPackage?->name,
                'status' => $order->status instanceof MembershipOrderStatus ? $order->status->value : $order->status,
                'status_label' => $order->status instanceof MembershipOrderStatus 
                    ? $order->status->label() 
                    : MembershipOrderStatus::from($order->status)->label(),
                'start_date' => Carbon::parse($order->start_date),
                'end_date' => Carbon::parse($order->end_date),
                'remaining_quota' => $order->remaining_discount_limits,
                'benefit' => [
                    'discount_type' => $discountType,
                    'discount_value' => $discountValue,
                ]
            ];
        };

        return [
            'id' => $this->id,
            'member_no' => $this->member_no,
            'slug' => $this->slug,
            'customer' => [
                'user_id' => $this->user_id,
                'name' => $this->user?->name ?? $this->name ?? 'Pelanggan',
                'email' => $this->user?->email ?? $this->email,
                'phone_number' => $this->user?->phone_number ?? $this->phone_number,
                'is_registered_user' => !is_null($this->user_id),
            ],
            'is_active' => (bool) $this->is_active,
            'has_active_membership' => !is_null($activeOrder),
            
            // Sekarang strukturnya identik
            'active_order' => $mapOrder($activeOrder),
            'queued_orders' => $queuedOrders->map(fn($q) => $mapOrder($q)),

            'last_package_name' => $activeOrder?->package_name_snapshot ?? 'Belum ada paket',
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at?->diffForHumans(),
        ];
    }
}