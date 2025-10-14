<?php

namespace App\Models;

use App\Models\Staff;
use App\Models\Venue;
use App\Models\Invoice;
use App\Models\Payment;
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
        'venue_payment_type_id',
        'operator_assignment_id',   
        'status',
        'total_original_price',
        'total_discount',
        'total_price',
        'slug',
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

    protected $with = ['operatorAssignment.operatorVenue.staff'];

    public function operatorAssignment()
    {
        return $this->belongsTo(OperatorAssignment::class, 'operator_assignment_id');
    }

    public function getOperatorAttribute()
    {
        return $this->operatorAssignment?->operatorVenue?->staff;
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

    public function customers()
    {
        return $this->hasMany(BookingCustomer::class);
    }

}
