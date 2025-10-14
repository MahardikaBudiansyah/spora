<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Models\Cart;
use App\Models\Address;
use App\Models\TimeSlot;
use App\Models\Membership;
use App\Traits\HasPassword;
use App\Models\Notification;
use App\Models\MembershipUser;
use App\Traits\HasUniqueField;
use App\Models\BookingCustomer;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Cviebrock\EloquentSluggable\Sluggable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes, HasUniqueField, HasPassword;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'username',
        'email',
        'email_verified_at',
        'password',
        'phone_number',
        'phone_verified_at',
        'photo',
        'status',
        'is_active',
    ];

    protected $uniqueFields = [
        'username' => 'name',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'phone_verified_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    protected $attributes = [
        'is_active' => true, 
    ];

    public function addresses()
    {
        return $this->morphMany(Address::class, 'addressable');
    }

    public function membershipUsers()
    {
        return $this->hasMany(MembershipUser::class);
    }
      // untuk akses cepat semua membership aktif
    public function activeMemberships()
    {
        return $this->hasManyThrough(
            Membership::class,
            MembershipUser::class,
            'user_id',             // Foreign key di membership_users → users.id
            'membership_user_id',  // Foreign key di memberships → membership_users.id
            'id',                  // Local key di users
            'id'                   // Local key di membership_users
        )->where('status', 'active');

    }

    public function timeSlots()
    {
        return $this->belongsToMany(TimeSlot::class, 'carts')
                    ->withPivot(['field_id', 'price']) // sesuaikan dengan kolom yang ada
                    ->withTimestamps();
    }

    public function carts()
    {
        return $this->hasMany(Cart::class);
    }

    public function bookingCustomers()
    {
        return $this->hasMany(BookingCustomer::class, 'user_id', 'id');
    }

    public function notifications()
    {
        return $this->morphMany(Notification::class, 'notifiable');
    }
}
