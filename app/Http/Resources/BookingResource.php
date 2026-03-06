<?php
namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Http\Resources\VenueResource;
use App\Http\Resources\InvoiceResource;
use App\Http\Resources\PaymentResource;
use App\Http\Resources\BookingDetailResource;
use App\Http\Resources\BookingCustomerResource;
use App\Http\Resources\VenuePaymentTypeResource;
use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
{
    public function toArray(Request $request): array
    {        
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

            'pricing' => [
                'total_original'   => (float) ($this->total_original_price ?? 0),
                'total_discount'   => (float) ($this->total_discount ?? 0),
                'total_bill'       => $totalPrice,
                'paid_amount'      => $paidAmount,
                'remaining_amount' => (float) max($totalPrice - $paidAmount, 0),
            ],
            
            'venue' => $this->relationLoaded('venue') 
                ? new VenueResource($this->venue) 
                : [
                    'id'            => $this->venue_id,
                    'name'          => $this->venue_name_snapshot ?? '-',
                    'short_address' => null, 
                    'image'         => asset('assets/images/court-default.jpg'),
                ],

            'operator' => [
                'id' => $this->operator_assignment_id,
                'name' => $this->operator_name_snapshot ?? optional(optional($this->operatorAssignment)->operator)->name ?? '-',
            ],

            'payment_policy' => [
                'is_dp_enabled' => (bool) $this->dp_enabled_snapshot,
                'dp_type' => $this->dp_type_snapshot,
                'dp_value' => (float) $this->dp_value_snapshot,
                'full_payment_deadline_days' => $this->full_payment_days_before_snapshot,
            ],

            'invoice' => new InvoiceResource($this->whenLoaded('invoice')),
            'invoice_status' => $this->relationLoaded('invoice') ? $this->invoice->status : "-",
            
            'latest_payment' => $this->relationLoaded('latest_payment') 
                ? new PaymentResource($this->latest_payment) 
                : null,
                

            'customers' => BookingCustomerResource::collection($this->whenLoaded('customers')),
            'customer' => [
                'id'    => $this->customer?->id ?? $this->id, 
                'name'  => $this->customer_name_snapshot ?? $this->customer?->name ?? 'Guest',
                'phone' => $this->customer_phone_number_snapshot ?? $this->customer?->phone_number,
                'email' => $this->customer_email_snapshot ?? $this->customer?->email,
                'member_no' => $this->member_no_snapshot ?? '-',
            ],
            
            'details' => BookingDetailResource::collection($this->whenLoaded('details')),
            
            'can_be_cancelled' => in_array($this->status, ['pending']),

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}