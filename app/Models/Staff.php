<?php

namespace App\Models;

use App\Models\Venue;
use App\Models\Address;
use App\Models\Merchant;
use App\Models\StaffRole;
use App\Traits\HasPassword;
use Illuminate\Support\Str;
use App\Models\StaffProfile;
use App\Models\MerchantStaffRole;
use App\Traits\HasUniqueUsername;

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
    use HasFactory, Notifiable, Sluggable, SoftDeletes, HasUniqueUsername, HasPassword;

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
        'slug',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $attributes = [
        'status' => self::STATUS_ACTIVE,
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

    public function getRouteKeyName()
    {
        return 'slug';
    }

    const STATUS_ACTIVE = 'active';
    const STATUS_INACTIVE = 'inactive';
    const STATUS_RESIGNED = 'resigned';

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
}
