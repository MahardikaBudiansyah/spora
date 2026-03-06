<?php

namespace App\Models;

use App\Models\Court;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CourtSurface extends Model
{
    use HasFactory;

    protected $table = 'court_surfaces';
    
    protected $fillable = [
        'name',
    ];

    public function courts()
    {
        return $this->hasMany(Court::class, 'court_surface_id','id');
    }
}
