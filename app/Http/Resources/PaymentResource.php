<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use App\Http\Resources\PaymentDetailResource;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
{

    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'method' => $this->payment_method,
            'type' => $this->payment_type,
            'gateway_order_id' => $this->gateway_order_id,
            'amount' => (float) $this->amount,
            'status' => $this->payment_status,
            'created_at' => $this->created_at->format('d M Y H:i'),
            'detail' => new PaymentDetailResource($this->whenLoaded('detail')),
        ];
    }
}
