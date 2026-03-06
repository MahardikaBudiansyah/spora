<?php

namespace App\Models;

use App\Models\Court;
use App\Models\CategoryCourt;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class cOURTCategory extends Model
{
    use HasFactory;

    protected $table = 'court_categories';
    
    protected $fillable = [
        'name',
        'label',
    ];

    public function courts()
    {
        return $this->belongsToMany(Court::class,'category_court', 'court_category_id', 'court_id')
                    ->using(CategoryCourt::class)
                    ->withPivot(['is_primary', 'order', 'notes'])
                    ->withTimestamps();
    }

}
