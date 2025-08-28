<?php

namespace App\Models;

use App\Models\Field;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class FieldType extends Model
{
    use HasFactory;

    protected $table = 'field_types';
    
    protected $fillable = [
        'name',
    ];

    public function fields()
    {
        return $this->hasMany(Field::class, 'field_type_id','id');
    }
}
