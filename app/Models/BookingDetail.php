<?php

namespace App\Models;

use App\Models\Court;
use App\Models\Booking;
use App\Models\TimeSlot;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class BookingDetail extends Model
{
    use HasFactory;

    protected $table = 'booking_details';

    protected $fillable = [
        'booking_id',
        'court_id',
        'time_slot_id',
        'court_name_snapshot',
        'time_slot_name_snapshot',
        'day_type_snapshot',
        'original_price',
        'discount_amount',
        'final_price',
        'booking_date',
    ];

    public function booking()
    {
        return $this->belongsTo(Booking::class, 'booking_id', 'id');
    }

    public function court()
    {
        return $this->belongsTo(Court::class, 'court_id', 'id');
    }

    public function timeSlot()
    {
        return $this->belongsTo(TimeSlot::class, 'time_slot_id', 'id');
    }
}
