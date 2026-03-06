<?php

namespace App\Models;

use App\Models\Venue;
use App\Models\CategoryVenue;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class VenueCategory extends Model
{
    use HasFactory;

    protected $table = 'venue_categories';
    
    protected $fillable = [
        'name',
        'label',
    ];

    public function venues()
    {
        return $this->belongsToMany(
            Venue::class,
            'category_venue',
            'category_id',
            'venue_id'
        )
        ->using(CategoryVenue::class)
        ->withTimestamps();
    }

}
