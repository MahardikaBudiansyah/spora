<?php

namespace App\Models;

use App\Models\Venue;
use App\Models\Invoice;
use App\Models\BookingDetail;
use App\Models\BookingCustomer;
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
        'status',
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

    public function venue()
    {
        return $this->belongsTo(Venue::class, 'venue_id', 'id');
    }

    public function invoices()
    {
        return $this->morphMany(Invoice::class, 'order');
    }

    public function getOrderLabelAttribute() { 
        return "Booking"; 
    }
    
    public function details()
    {
        return $this->hasMany(BookingDetail::class, 'booking_id', 'id');
    }

    public function customers()
    {
        return $this->hasMany(BookingCustomer::class, 'booking_id', 'id');
    }
}
