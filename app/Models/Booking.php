<?php

namespace App\Models;

use App\Models\Staff;
use App\Models\Venue;
use App\Models\Review;
use App\Models\Invoice;
use App\Models\Payment;
use App\Enums\BookingStatus;
use App\Models\BookingDetail;
use App\Models\OperatorVenue;
use App\Models\BookingCustomer;
use App\Models\OperatorAssignment;
use Illuminate\Database\Eloquent\Model;
use Cviebrock\EloquentSluggable\Sluggable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Booking extends Model
{
    use HasFactory, Sluggable, SoftDeletes;

    protected $table = 'bookings';

    protected $fillable = [
        'order_no',
        'venue_id',
        'venue_payment_policy_id',
        'operator_assignment_id',   
        'total_original_price',
        'total_discount',
        'total_price',
        'status',
        'slug',
        'venue_name_snapshot',
        'operator_name_snapshot',
        'member_no_snapshot', 
        'customer_name_snapshot',
        'customer_phone_number_snapshot',
        'customer_email_snapshot',
        'dp_enabled_snapshot',
        'dp_value_snapshot',
        'dp_type_snapshot',
        'full_payment_days_before_snapshot',
    ];

    protected $casts = [
        'status' => BookingStatus::class,
        
        'total_original_price' => 'decimal:2',
        'total_discount'       => 'decimal:2',
        'total_price'          => 'decimal:2',
        
        'dp_enabled_snapshot' => 'boolean',
        'dp_value_snapshot'   => 'decimal:2',
        
        'full_payment_days_before_snapshot' => 'integer',
        
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function sluggable(): array
    {
        return [
            'slug' => [
                'source' => 'order_no'
            ]
        ];
    }

    public function getRouteKeyName()
    {
        return 'slug';
    }

    public function venue()
    {
        return $this->belongsTo(Venue::class, 'venue_id', 'id');
    }

    public function invoice()
    {
        return $this->morphOne(Invoice::class, 'order');
    }

    public function latestPayment()
    {
        return $this->hasOneThrough(
            Payment::class,
            Invoice::class,
            'order_id',   // Foreign key on invoices
            'invoice_id', // Foreign key on payments
            'id',         // Local key on bookings
            'id'          // Local key on invoices
        )->where('invoices.order_type', self::class)
        ->latestOfMany(); // ambil payment terakhir
    }


    public function getOrderLabelAttribute() { 
        return "Booking"; 
    }
    
    public function details()
    {
        return $this->hasMany(BookingDetail::class);
    }

    public function customer()
    {
        return $this->hasOne(BookingCustomer::class);
    }

    public function customers()
    {
        return $this->hasMany(BookingCustomer::class);
    }

    public function review()
    {
        return $this->hasOne(Review::class);
    }

    protected $with = ['operatorAssignment.operatorVenue.staff'];

    public function operatorAssignment()
    {
        return $this->belongsTo(OperatorAssignment::class, 'operator_assignment_id');
    }

    public function getOperatorAttribute()
    {
        return $this->operatorAssignment?->operatorVenue?->staff;
    }

}
