<?php

namespace App\Models;

use App\Models\Notification;
use App\Traits\HasUniqueField;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Cviebrock\EloquentSluggable\Sluggable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Admin extends Authenticatable
{
    use HasFactory, Notifiable, SoftDeletes, HasUniqueField;

    protected $guard = 'admin';

    protected $fillable = [
        'name',
        'username',
        'phone_number',
        'email',
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
        'password' => 'hashed',
    ];

    protected $attributes = [
        'status' => true, 
    ];

    public function notifications()
    {
        return $this->morphMany(Notification::class, 'notifiable');
    }
}
