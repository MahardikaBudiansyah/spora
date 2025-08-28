<?php

namespace App\Models;

use App\Models\Field;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class FieldImage extends Model
{
    protected $fillable = [
        'field_id', 
        'image_path', 
        'is_featured', 
        'order'
    ];

    public function field()
    {
        return $this->belongsTo(Field::class);
    }
}