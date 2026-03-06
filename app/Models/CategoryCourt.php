<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class CategoryCourt extends Pivot
{
    protected $table = 'category_court'; 
    
    protected $fillable = [
        'court_id',
        'category_id',
        'is_primary',
        'order',
        'notes',
    ];
}
