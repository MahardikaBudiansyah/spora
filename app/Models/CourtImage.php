<?php

namespace App\Models;

use App\Models\Court;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CourtImage extends Model
{
    protected $fillable = [
        'court_id', 
        'image_path', 
        'is_featured', 
        'order'
    ];

    public function court()
    {
        return $this->belongsTo(Court::class);
    }
}