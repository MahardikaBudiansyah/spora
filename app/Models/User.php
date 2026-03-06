<?php

namespace App\Models;

use App\Enums\UserStatus;
use App\Models\BookingCustomer;
use App\Models\Cart;
use App\Models\MembershipCard;
use App\Models\TimeSlot;
use App\Traits\HasAddress;
use App\Traits\HasNotifications;
use App\Traits\HasPassword;
use App\Traits\HasStatusHistory;
use App\Traits\HasUniqueField;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes, HasUniqueField, HasPassword,  HasStatusHistory, HasAddress, HasNotifications {
        HasNotifications::notifications insteadof Notifiable;
        HasNotifications::readNotifications insteadof Notifiable;
        HasNotifications::unreadNotifications insteadof Notifiable;
        Notifiable::notifications as laravelNotifications;
        Notifiable::unreadNotifications as laravelUnreadNotifications;
    }

    protected $fillable = [
        'name',
        'username',
        'email',
        'email_verified_at',
        'password',
        'phone_number',
        'phone_verified_at',
        'avatar_path',
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
        'status' => UserStatus::class,
        'email_verified_at' => 'datetime',
        'phone_verified_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    protected $attributes = [
        'is_active' => true,
    ];

    public function syncStatus()
    {
        if ($this->status === UserStatus::BANNED) {
            $this->is_active = false;
            return;
        }

        $this->status = ($this->email_verified_at && $this->phone_verified_at)
            ? UserStatus::VERIFIED
            : UserStatus::PENDING;
    }

    public function membershipCards()
    {
        return $this->hasMany(MembershipCard::class);
    }

    public function timeSlots()
    {
        return $this->belongsToMany(TimeSlot::class, 'carts')
            ->withPivot(['court_id', 'price'])
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
