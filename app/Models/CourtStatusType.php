<?php

namespace App\Models;

use App\Enums\CourtStatus;
use App\Models\CourtSchedule;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CourtStatusType extends Model
{
    use HasFactory;

    protected $table = 'court_status_types';
    
    protected $fillable = [
        'name',
        'label',
    ];

    public function schedules()
    {
        return $this->hasMany(CourtSchedule::class, 'status_id','id');
    }

    public function isAvailable(): bool
    {
        return $this->name === CourtStatus::AVAILABLE->value;
    }

    public function isBooked(): bool
    {
        return $this->name === CourtStatus::BOOKED->value;
    }
}
