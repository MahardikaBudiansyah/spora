<?php

namespace App\Models;

use App\Models\Cart;
use App\Models\Field;
use App\Models\SlotStatus;
use App\Models\BookingDetail;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TimeSlot extends Model
{
    use HasFactory;

    protected $table = 'time_slots';

    protected $fillable = [
        'name',
    ];

    public function fields()
    {
        return $this->belongsToMany(Field::class, 'field_time_slot', 'time_slot_id', 'field_id');
    }

    public function slotStatuses()
    {
        return $this->hasMany(SlotStatus::class, 'time_slot_id');
    }

    public function carts()
    {
        return $this->hasMany(Cart::class, 'time_slot_id', 'id');
    }

    public function bookingDetails()
    {
        return $this->hasMany(BookingDetail::class, 'time_slot_id', 'id');
    }

}
