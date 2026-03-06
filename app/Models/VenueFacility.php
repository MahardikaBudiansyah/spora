<?php

namespace App\Models;

use App\Models\Venue;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class VenueFacility extends Model
{
    use HasFactory;
    
    protected $table = 'venue_facilities';

    protected $fillable = [
        'name',
        'icon',
    ];

    protected $appends = ['icon_url'];

    public function getIconUrlAttribute()
    {
        return asset($this->icon);
    }

    public function venues()
    {
        return $this->belongsToMany(Venue::class, 'facility_venue', 'venue_facility_id', 'venue_id');
    }
}
