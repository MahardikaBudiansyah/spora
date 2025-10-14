<?php

namespace App\Models;

use App\Models\Payment;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PaymentDetail extends Model
{
    use HasFactory;

    protected $table = 'payment_details';

    protected $fillable = [
        'payment_id',
        'payment_provider',
        'payment_channel',
        'reference_no',
        'payer_name',
        'payment_date',
        'proof_of_payment',
        'raw_response',
    ];

    protected $casts = [
        'raw_response' => 'array',
        'payment_date' => 'datetime',
    ];

    public function payment()
    {
        return $this->belongsTo(Payment::class, 'payment_id', 'id');
    }
}
