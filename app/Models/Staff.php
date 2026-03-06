<?php

namespace App\Models;

use App\Enums\StaffStatus;
use App\Models\Address;
use App\Models\Merchant;
use App\Models\MerchantStaffRole;
use App\Models\OperatorAssignment;
use App\Models\StaffProfile;
use App\Models\StaffRole;
use App\Traits\HasNotifications;
use App\Traits\HasPassword;
use App\Traits\HasStatusHistory;
use Cviebrock\EloquentSluggable\Sluggable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Staff extends Authenticatable
{
    use HasFactory, Notifiable, SoftDeletes, Sluggable, HasPassword, HasStatusHistory, HasNotifications {
        HasNotifications::notifications insteadof Notifiable;
        HasNotifications::readNotifications insteadof Notifiable;
        HasNotifications::unreadNotifications insteadof Notifiable;
        Notifiable::notifications as laravelNotifications;
        Notifiable::unreadNotifications as laravelUnreadNotifications;
    }

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

    protected $attributes = [
        'status' => StaffStatus::ACTIVE,
        'is_active' => true,
    ];

    protected $casts = [
        'satus' => StaffStatus::class,
        'is_active' => 'boolean',
    ];

    public function sluggable(): array
    {
        return [
            'username' => [
                'source' => 'name',
                'separator' => '-',
                'unique' => true,
            ]
        ];
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
            'id',
            'id',
            'merchant_staff_role_id',
            'staff_role_id'
        );
    }

    public function hasRole($roles): bool
    {
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

    public function profiles()
    {
        return $this->hasMany(StaffProfile::class, 'staff_id');
    }

    public function operatorAssignments()
    {
        return $this->hasMany(OperatorAssignment::class);
    }
}
