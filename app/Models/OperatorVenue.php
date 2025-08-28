<?php

namespace App\Models;

use App\Models\Shift;
use App\Models\Staff;
use App\Models\Venue;
use App\Models\OperatorAssignment;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class OperatorVenue extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'operator_venues';

    protected $fillable = [
        'staff_id',
        'venue_id',
    ];

    public function staff()
    {
        return $this->belongsTo(Staff::class);
    }

    public function venue()
    {
        return $this->belongsTo(Venue::class);
    }

    public function shift()
    {
        return $this->belongsTo(Shift::class);
    }

    public function assignments()
    {
        return $this->hasMany(OperatorAssignment::class);
    }
    
}
