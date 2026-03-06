<?php

namespace App\Models;

use App\Models\User;
use App\Models\Court;
use App\Models\Venue;
use App\Models\TimeSlot;
use App\Models\CartHistory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Cart extends Model
{
    use HasFactory;

    protected $table = 'carts';

    protected $fillable = [
        'user_id',
        'venue_id',
        'court_id',
        'time_slot_id',
        'price',
        'day_type',
        'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function venue()
    {
        return $this->belongsTo(Venue::class);
    }

    public function court()
    {
        return $this->belongsTo(Court::class);
    }

    public function timeSlot()
    {
        return $this->belongsTo(TimeSlot::class);
    }

}
