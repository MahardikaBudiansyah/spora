<?php

namespace App\Models;

use App\Models\Invoice;
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
        'amount',
        'payment_status',
    ];

    public function invoice()
    {
        return $this->belongsTo(Invoice::class, 'invoice_id', 'id');
    }

    public function detail()
    {
        return $this->hasOne(PaymentDetail::class);
    }
}
