<?php

namespace App\Models;

use App\Models\Venue;
use App\Models\Address;
use App\Models\Merchant;
use App\Models\StaffRole;
use App\Traits\HasPassword;
use Illuminate\Support\Str;
use App\Models\Notification;
use App\Models\StaffProfile;
use App\Traits\HasUniqueField;
use App\Models\MerchantStaffRole;
use App\Models\OperatorAssignment;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Cviebrock\EloquentSluggable\Sluggable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Staff extends Authenticatable
{
    use HasFactory, Notifiable, SoftDeletes, HasUniqueField, HasPassword;

    protected $table = 'staff';

    protected $fillable = [
        'merchant_id',
        'merchant_staff_role_id',
        'name',
        'username',
        'phone_number',
        'email',
        'password',
        'status',
        'is_active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $uniqueFields = [
        'username' => 'name',
    ];

    const STATUS_ACTIVE = 'active';
    const STATUS_INACTIVE = 'inactive';
    const STATUS_RESIGNED = 'resigned';

    protected $attributes = [
        'status' => self::STATUS_ACTIVE,
        'is_active' => true, 
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function getRouteKeyName()
    {
        return 'username';
    }

    public function merchant()
    {
        return $this->belongsTo(Merchant::class, 'merchant_id');
    }

    public function addresses()
    {
        return $this->morphMany(Address::class, 'addressable');
    }

    public function merchantStaffRole()
    {
        return $this->belongsTo(MerchantStaffRole::class, 'merchant_staff_role_id');
    }

    public function role()
    {
        return $this->hasOneThrough(
            StaffRole::class,
            MerchantStaffRole::class,
            'id',                   // Foreign key di MerchantStaffRole
            'id',                   // Foreign key di StaffRole
            'merchant_staff_role_id', // Local key di Staff
            'staff_role_id'         // Local key di MerchantStaffRole
        );
    }

    public function hasRole($roles): bool
    {
        // Pastikan bisa menerima string atau array
        if (is_string($roles)) {
            $roles = [$roles];
        }

        return in_array(
            $this->merchantStaffRole?->staffRole?->name ?? '',
            $roles
        );
    }

    public function isOperator(): bool
    {
        return $this->hasRole('operator');
    }

    public function isActive(): bool
    {
        return $this->status === self::STATUS_ACTIVE;
    }


    public function profiles()
    {
        return $this->hasMany(StaffProfile::class, 'staff_id');
    }

    public function operatorAssignments()
    {
        return $this->hasMany(OperatorAssignment::class);
    }

    public function notifications()
    {
        return $this->morphMany(Notification::class, 'notifiable');
    }
}
