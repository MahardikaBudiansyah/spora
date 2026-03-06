<?php

namespace App\Models;

use App\Enums\AdminStatus;
use App\Models\AdminProfile;
use App\Models\PlatformProfile;
use App\Traits\HasNotifications;
use App\Traits\HasPassword;
use App\Traits\HasStatusHistory;
use Cviebrock\EloquentSluggable\Sluggable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Admin extends Authenticatable
{
    use HasFactory, Notifiable, Sluggable, HasPassword, SoftDeletes, HasStatusHistory, HasNotifications {
        HasNotifications::notifications insteadof Notifiable;
        HasNotifications::readNotifications insteadof Notifiable;
        HasNotifications::unreadNotifications insteadof Notifiable;
        Notifiable::notifications as laravelNotifications;
        Notifiable::unreadNotifications as laravelUnreadNotifications;
    }

    protected $guard = 'admin';

    protected $fillable = [
        'name',
        'email',
        'password',
        'avatar_path',
        'role',
        'status',
        'is_active',
        'slug',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'status' => AdminStatus::class,
        'is_active' => 'boolean',
    ];

    protected $attributes = [
        'status' => AdminStatus::ACTIVE,
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

    public function profile()
    {
        return $this->hasOne(AdminProfile::class);
    }

    public function platformProfile()
    {
        return $this->hasOne(PlatformProfile::class);
    }
}
