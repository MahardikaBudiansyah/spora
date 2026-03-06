<?php

namespace App\Models;

use App\Models\Court;
use App\Models\TimeSlot;
use App\Models\CourtStatusType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CourtSchedule extends Model
{
    use HasFactory;

    protected $table = 'court_schedules';

    protected $fillable = [
        'court_id',
        'time_slot_id',
        'status_id',
        'date',
    ];

    public function statusType()
    {
        return $this->belongsTo(CourtStatusType::class, 'status_id', 'id');
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
