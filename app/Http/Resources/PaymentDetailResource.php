<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentDetailResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'provider' => $this->payment_provider,
            'channel' => $this->payment_channel, 
            'reference_no' => $this->reference_no,
            'payer_name' => $this->payer_name,
            'payment_date' => $this->payment_date ? $this->payment_date->format('d M Y H:i') : null,
            'proof_url' => $this->proof_of_payment ? asset('storage/' . $this->proof_of_payment) : null,
        ];
    }
}
