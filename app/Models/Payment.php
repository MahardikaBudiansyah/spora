<?php

namespace App\Models;

use App\Models\Invoice;
use App\Enums\PaymentType;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Models\PaymentDetail;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Payment extends Model
{
    use HasFactory;

    protected $table = 'payments';

    protected $fillable = [
        'invoice_id',
        'payment_method',
        'payment_type',
        'gateway_order_id',
        'checout_url',
        'amount',
        'payment_status',
    ];

    protected $casts = [
        'payment_method' => PaymentMethod::class,
        'payment_type' => PaymentType::class,
        'payment_status' => PaymentStatus::class,
        'amount' => 'decimal:2',
    ];


    public function invoice()
    {
        return $this->belongsTo(Invoice::class, 'invoice_id', 'id');
    }

    public function detail()
    {
        return $this->hasOne(PaymentDetail::class, 'payment_id', 'id');
    }
}
