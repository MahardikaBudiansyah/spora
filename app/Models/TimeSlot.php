<?php

namespace App\Models;

use App\Models\Cart;
use App\Models\Court;
use App\Models\CourtSchedule;
use App\Models\BookingDetail;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TimeSlot extends Model
{
    use HasFactory;

    protected $table = 'time_slots';

    protected $fillable = [
        'start_time',
        'end_time',
    ];

    protected $casts = [
        'start_time' => 'string',
        'end_time'   => 'string',
    ];

    protected $appends = ['formatted_range'];

    public function getFormattedRangeAttribute()
    {
        return substr($this->start_time, 0, 5) . ' - ' . substr($this->end_time, 0, 5);
    }

    public function courts()
    {
        return $this->belongsToMany(Court::class, 'court_time_slot', 'time_slot_id', 'court_id');
    }

    public function schedules()
    {
        return $this->hasMany(CourtSchedule::class, 'time_slot_id');
    }

    public function carts()
    {
        return $this->hasMany(Cart::class);
    }

    public function bookingDetails()
    {
        return $this->hasMany(BookingDetail::class, 'time_slot_id', 'id');
    }

}
