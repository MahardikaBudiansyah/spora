<?php

namespace App\Models;

use App\Models\Shift;
use App\Models\Staff;
use App\Models\Venue;
use App\Traits\HasPassword;
use App\Models\Subscription;
use App\Models\MerchantOwner;
use App\Models\MerchantProfile;
use App\Models\MerchantStaffRole;
use App\Traits\HasUniqueUsername;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Cviebrock\EloquentSluggable\Sluggable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Merchant extends Authenticatable
{
    use HasFactory, Notifiable, Sluggable, SoftDeletes, HasUniqueUsername, HasPassword;

    protected $guard = 'merchants';

    protected $fillable = [
        'name',
        'username',
        'email',
        'email_verified_at',
        'password',
        'phone_number',
        'status',
        'slug',
        'deleted_at',
    ];


    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function sluggable(): array
    {
        return [
            'slug' => [
                'source' => 'name',
                'separator' => '-', 
                'unique' => true,
            ]
        ];
    }

    public function profile()
    {
        return $this->hasOne(MerchantProfile::class);
    }

    public function owner()
    {
        return $this->hasOne(MerchantOwner::class);
    }

    public function staff()
    {
        return $this->hasMany(Staff::class);
    }

    public function shifts()
    {
        return $this->hasMany(Shift::class);
    }

    public function staffRoles()
    {
        return $this->hasMany(MerchantStaffRole::class);
    }

    
    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }

    public function venues()
    {
        return $this->hasMany(Venue::class);
    }
}
