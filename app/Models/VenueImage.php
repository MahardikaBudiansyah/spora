<?php

namespace App\Models;

use App\Models\Venue;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class VenueImage extends Model
{
    protected $fillable = [
        'venue_id', 
        'image_path', 
        'is_featured', 
        'order',
    ];

    public function venue()
    {
        return $this->belongsTo(Venue::class);
    }
}
