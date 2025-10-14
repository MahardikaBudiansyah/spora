<?php

namespace App\Models;

use App\Models\Notification;
use App\Traits\HasUniqueField;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Cviebrock\EloquentSluggable\Sluggable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Admin extends Model
{
    use HasFactory, Notifiable, SoftDeletes, HasUniqueField;

    protected $guard = 'admin';

    protected $fillable = [
        'name',
        'username',
        'email',
        'email_verified_at',
        'password',
        'status',
    ];

    protected $guarded=[];

    protected $uniqueFields = [
        'username' => 'name',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function notifications()
    {
        return $this->morphMany(Notification::class, 'notifiable');
    }
}
