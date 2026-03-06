<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Http\Resources\PaymentResource;
use Illuminate\Http\Resources\Json\JsonResource;

class InvoiceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'invoice_no' => $this->invoice_no,
            'total_amount' => $this->total_amount,
            'status' => $this->status,
            'due_date' => $this->due_date 
                ? Carbon::parse($this->due_date)->format('Y-m-d') 
                : null,
            'slug' => $this->slug,
            
            'payments' => PaymentResource::collection($this->whenLoaded('payments')),
        ];
    }
}