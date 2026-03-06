<?php

namespace App\Models;

use App\Enums\Gender;
use App\Models\Admin;
use App\Models\Address;
use App\Traits\HasAddress;
use App\Traits\HasSocialMedia;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AdminProfile extends Model
{
    use HasFactory,
        SoftDeletes,
        HasAddress,
        HasSocialMedia;

    protected $table = 'admin_profiles';

    protected $fillable = [
        'admin_id',
        'nik',
        'full_name',
        'phone_number',
        'date_of_birth',
        'gender',
        'photo_path',
        'ktp_photo_path',
        'selfie_photo_path',
    ];

    protected $casts = [
        'gender' => Gender::class,
        'date_of_birth' => 'date',
    ];

    public function admin()
    {
        return $this->belongsTo(Admin::class);
    }
}
