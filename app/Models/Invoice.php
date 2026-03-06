<?php

namespace App\Models;

use App\Models\Booking;
use App\Models\Payment;
use App\Enums\OrderType;
use App\Enums\InvoiceStatus;
use App\Enums\PaymentStatus;
use App\Models\MembershipCard;
use App\Models\MembershipOrder;
use Illuminate\Database\Eloquent\Model;
use Cviebrock\EloquentSluggable\Sluggable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Invoice extends Model
{
    use HasFactory, Sluggable, SoftDeletes;

    protected $table = 'invoices';

    protected $fillable = [
        'order_type',
        'order_id',
        'invoice_no',
        'total_amount',
        'status',
        'due_date',
        'slug',
    ];

    protected $casts = [
        'order_type' => OrderType::class,
        'status' => InvoiceStatus::class,
        'due_date' => 'datetime',
        'total_amount' => 'decimal:2',
    ];

    protected $appends = [
        'paid_amount', 
        'remaining_amount', 
        'customer_name', 
        'order_type_label'
    ];

    public function sluggable(): array
{
        return [
            'slug' => [
                'source' => 'invoice_no'
            ]
        ];
    }

    public function getRouteKeyName()
    {
        return 'slug';
    }

    public function order()
    {
        return $this->morphTo();
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function getPaidAmountAttribute()
    {
        return $this->payments
            ->where('payment_status', PaymentStatus::PAID)
            ->sum('amount');
    }

    public function getRemainingAmountAttribute()
    {
        return max($this->total_amount - $this->paid_amount, 0);
    }

    public function getOrderTypeLabelAttribute()
    {
        return $this->order_type ? $this->order_type->label() : '-'; 
    }

    public function getCustomerNameAttribute()
    {
        if (!$this->order) return 'Guest';

        return match($this->order_type) {
            OrderType::BOOKING => $this->order->customer_name_snapshot ?? 'N/A',
            OrderType::MEMBERSHIP => $this->order->membershipCard->name ?? 'N/A',
            default => 'N/A'
        };
    }
}