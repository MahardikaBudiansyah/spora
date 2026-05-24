<?php

namespace App\Http\Resources;

use App\Models\Booking;
use App\Enums\OrderType;
use App\Http\Resources\PaymentResource;
use App\Http\Resources\BookingDetailResource;
use Illuminate\Http\Resources\Json\JsonResource;

class TransactionResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'invoice_no' => $this->invoice_no,
            'amount' => [
                'total' => (float) $this->total_amount,
                'formatted' => 'Rp ' . number_format($this->total_amount, 0, ',', '.'),
            ],
            'status' => $this->status,
            'dates' => [
                'created' => $this->created_at,
                'due' => $this->due_date,
            ],

            'order_type' => $this->order_type,
            'order_detail' => $this->whenLoaded('order', function () {
                return [
                    'order_no' => $this->order->order_no,
                    'items' => $this->order_type === OrderType::BOOKING
                        ? BookingDetailResource::collection($this->order->details)
                        : null,
                ];
            }),

            'payment_history' => PaymentResource::collection($this->whenLoaded('payments')),

            'latest_payment' => $this->whenLoaded('payments', function () {
                $last = $this->payments->first();
                return $last ? new PaymentResource($last) : null;
            }),
        ];
    }
}
