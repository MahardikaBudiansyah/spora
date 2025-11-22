<?php

namespace App\Models;

use App\Models\Shift;
use App\Models\Staff;
use App\Models\Venue;
use App\Models\Address;
use App\Traits\HasPassword;
use App\Models\Notification;
use App\Models\Subscription;
use App\Models\MerchantOwner;
use App\Models\MerchantProfile;
use App\Models\MerchantStaffRole;
use App\Models\SubscriptionMerchant;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Cviebrock\EloquentSluggable\Sluggable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Merchant extends Authenticatable
{
    use HasFactory, Notifiable, Sluggable, SoftDeletes, HasPassword;

    protected $guard = 'merchants';

    protected $fillable = [
        'name',
        'email',
        'email_verified_at',
        'password',
        'phone_number',
        'status',
        'is_active',
        'slug',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_active' => 'boolean',
    ];

    protected $attributes = [
        'is_active' => true, 
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

    public function address()
    {
        return $this->morphOne(Address::class, 'addressable');
    }

    public function addresses()
    {
        return $this->morphMany(Address::class, 'addressable');
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

    // Relasi ke status langganan aktif
    public function activeSubscription()
    {
        return $this->hasOneThrough(
            SubscriptionMerchant::class,
            Subscription::class,
            'merchant_id', // Foreign key on subscriptions
            'subscription_id' // Foreign key on subscription_merchants
        )->where('subscription_merchants.is_active', true);
    }

    public function venues()
    {
        return $this->hasMany(Venue::class);
    }

    public function notifications()
    {
        return $this->morphMany(Notification::class, 'notifiable');
    }
}
