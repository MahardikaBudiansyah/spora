<?php

namespace App\Models;

use App\Models\User;
use App\Models\Venue;
use App\Models\Membership;
use Illuminate\Database\Eloquent\Model;
use Cviebrock\EloquentSluggable\Sluggable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MembershipUser extends Model
{
    use HasFactory, Sluggable, SoftDeletes;

    protected $table = 'membership_users';

    protected $fillable = [
        'member_no',
        'user_id',
        'venue_id',
        'is_active',
        'notes',
        'slug',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    protected $attributes = [
        'is_active' => true, 
    ];

    public function sluggable(): array
    {
        return [
            'slug' => [
                'source' => 'member_no'
            ]
        ];
    }

    public function getRouteKeyName()
    {
        return 'member_no';
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function venue()
    {
        return $this->belongsTo(Venue::class);
    }

    public function memberships()
    {
        return $this->hasMany(Membership::class);
    }

}
