<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Models\Cart;
use App\Models\TimeSlot;
use App\Models\Membership;
use App\Traits\HasPassword;
use App\Models\BookingCustomer;
use App\Traits\HasUniqueUsername;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Cviebrock\EloquentSluggable\Sluggable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, Sluggable, SoftDeletes, HasUniqueUsername, HasPassword;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'username',
        'email',
        'password',
        'phone_number',
        'photo',
        'status',
        'slug',
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

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function membership()
    {
        return $this->belongsTo(Membership::class);
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

}
