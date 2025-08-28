<?php

namespace App\Models;

use App\Models\Shift;
use App\Models\Staff;
use App\Models\Venue;
use App\Models\OperatorVenue;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class OperatorAssignment extends Model
{
    use HasFactory;

    protected $table = 'operator_assignments';

    protected $fillable = [
        'operator_venue_id',
        'shift_id',
        'date',
        'is_active',
    ];

    public function operatorVenue()
    {
        return $this->belongsTo(OperatorVenue::class);
    }

    public function staff()
    {
        return $this->operatorVenue()->with('staff');
    }

    public function venue()
    {
        return $this->operatorVenue()->with('venue');
    }

    public function shift()
    {
        return $this->belongsTo(Shift::class);
    }

    // Lewat relasi, kita bisa buat shortcut (akses staff/venue/shift langsung)
    // public function staff()
    // {
    //     return $this->hasOneThrough(
    //         Staff::class,
    //         OperatorVenue::class,
    //         'id',               // FK di operator_venue_shifts
    //         'id',               // PK di staff
    //         'operator_venue_shift_id', // FK di operator_assignments
    //         'staff_id'          // FK di operator_venue_shifts
    //     );
    // }

    // public function venue()
    // {
    //     return $this->hasOneThrough(
    //         Venue::class,
    //         OperatorVenue::class,
    //         'id',                // FK di operator_venue_shifts
    //         'id',                // PK di venues
    //         'operator_venue_shift_id', // FK di operator_assignments
    //         'venue_id'           // FK di operator_venue_shifts
    //     );
    // }

    // public function shift()
    // {
    //     return $this->hasOneThrough(
    //         Shift::class,
    //         OperatorVenue::class,
    //         'id',                 // FK di operator_venue_shifts
    //         'id',                 // PK di shifts
    //         'operator_venue_shift_id', // FK di operator_assignments
    //         'shift_id'            // FK di operator_venue_shifts
    //     );
    // }
    
}
