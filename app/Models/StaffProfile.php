<?php

namespace App\Models;

use App\Enums\Gender;
use App\Models\Staff;
use App\Traits\HasAddress;
use App\Traits\HasSocialMedia;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class StaffProfile extends Model
{
    use HasFactory,
        SoftDeletes,
        HasAddress,
        HasSocialMedia;

    protected $table = 'staff_profiles';

    protected $fillable = [
        'staff_id',
        'nik',
        'avatar_path',
        'date_of_birth',
        'gender',

    ];

    protected $casts = [
        'gender' => Gender::class,
    ];

    public function staff()
    {
        return $this->belongsTo(Staff::class);
    }
}
