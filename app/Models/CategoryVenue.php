<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class CategoryVenue extends Pivot
{
    protected $table = 'category_venue'; 
    
    protected $fillable = [
        'venue_id',
        'category_id',
    ];
}
