<?php

namespace App\Models;

use App\Models\Venue;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Facility extends Model
{
    use HasFactory;
    
    protected $table = 'facilities';

    protected $fillable = [
        'name',
        'icon',
    ];

    protected $appends = ['icon_url'];

    public function getIconUrlAttribute()
    {
        return asset($this->icon); // menghasilkan URL lengkap dari path icon
    }

    public function venues()
    {
        return $this->belongsToMany(Venue::class, 'facility_venue', 'facility_id', 'venue_id');
    }
}
