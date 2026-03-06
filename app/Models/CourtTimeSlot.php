<?php
namespace App\Models;

use App\Models\Court;
use App\Models\TimeSlot;
use Illuminate\Database\Eloquent\Model;

class CourtTimeSlot extends Model
{
    protected $table = 'court_time_slot';
    
    protected $fillable = [
        'court_id', 
        'time_slot_id', 
        'day_type', 
        'price'
    ];

    protected $casts = [
        'price' => 'float',
    ];

    public function court() 
    { 
        return $this->belongsTo(Court::class); 
    }

    public function timeSlot() 
    { 
        return $this->belongsTo(TimeSlot::class); 
    }
}