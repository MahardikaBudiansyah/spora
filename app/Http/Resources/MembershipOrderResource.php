<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use App\Http\Resources\VenueResource;
use App\Http\Resources\InvoiceResource;
use App\Http\Resources\PaymentResource;
use Illuminate\Http\Resources\Json\JsonResource;

class MembershipOrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $user = $this->membershipCard?->user;
        $card = $this->membershipCard;

        $invoice = $this->relationLoaded('invoice') ? $this->invoice : null;
        $paidAmount = 0;
        if ($invoice && $invoice->relationLoaded('payments')) {
            $paidAmount = $invoice->payments
                ->filter(function ($payment) {
                    $status = $payment->payment_status instanceof \UnitEnum 
                        ? $payment->payment_status->value 
                        : $payment->payment_status;

                    return in_array(strtolower($status), ['paid', 'success', 'settlement']);
                })
                ->sum('amount');
        }

        $totalPrice = (float) ($this->total_price ?? 0);

        return [
            'id' => $this->id,
            'order_no' => $this->order_no,
            'slug' => $this->slug,
            'status' => $this->status,
            'is_queued' => (bool) $this->is_queued,
            
            'member' => [
                'id' => $this->membership_card_id,
                'member_no' => $this->member_no_snapshot,
                'name' => $this->member_name_snapshot ?? $this->membershipCard?->user?->name ?? $this->membershipCard?->customer_name ?? '-',
                'phone' => $this->member_number_phone_snapshot ?? $this->membershipCard?->user?->phone_number ?? $this->membershipCard?->customer_phone ?? '-',
            ],

            'venue' => $this->relationLoaded('venue') 
                ? new VenueResource($this->venue) 
                : [
                    'id'            => $this->venue_id,
                    'name'          => $this->venue_name_snapshot ?? '-',
                    'short_address' => null, 
                    'image'         => asset('assets/images/court-default.jpg'),
                ],

            'package' => [
                'id' => $this->membership_package_id,
                'name' => $this->package_name_snapshot ?? $this->membershipPackage?->name ?? '-',
                'duration_months' => $this->duration_month_snapshot,
                'total_price' => (float) $this->total_price,
                'discount' => [
                    'type' => $this->discount_type_snapshot,
                    'value' => (float) $this->discount_value_snapshot,
                    'limit' => $this->discount_limit_snapshot,
                    'remaining_limit' => $this->remaining_discount_limits,
                ],
            ],

            'pricing' => [
                'total_bill'       => $totalPrice,
                'paid_amount'      => $paidAmount,
                'remaining_amount' => (float) max($totalPrice - $paidAmount, 0),
            ],

            'payment_policy' => [
                'dp_enabled' => (bool) $this->dp_enabled_snapshot,
                'dp_type' => $this->dp_type_snapshot, 
                'dp_value' => (float) $this->dp_value_snapshot,
                'full_payment_deadline_days' => $this->full_payment_days_before_snapshot,
            ],

            'period' => [
                'start_date' => $this->start_date ? $this->start_date : null,
                'end_date' => $this->end_date ? $this->end_date : null,
                'raw_start_date' => $this->start_date ? $this->start_date : null,
                'raw_end_date' => $this->end_date ? $this->end_date : null,
            ],

            'operator' => [
                'id' => $this->operator_assignment_id,
                'name' => $this->operator_name_snapshot ?? optional(optional($this->operatorAssignment)->operator)->name ?? '-',
            ],

            'invoice' => new InvoiceResource($this->whenLoaded('invoice')),
            'invoice_status' => $this->relationLoaded('invoice') ? $this->invoice->status : "-",

            'latest_payment' => $this->relationLoaded('latest_payment') 
                ? new PaymentResource($this->latest_payment) 
                : null,
            
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}