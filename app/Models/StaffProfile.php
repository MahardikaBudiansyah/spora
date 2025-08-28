<?php

namespace App\Models;

use App\Models\Staff;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class StaffProfile extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'staff_profiles';

    protected $fillable = [
        'staff_id',
        'NIK',
        'address',
        'avatar',
        'date_of_birth',
    
    ];

    public function staff()
    {
        return $this->belongsTo(Staff::class);
    }
}
