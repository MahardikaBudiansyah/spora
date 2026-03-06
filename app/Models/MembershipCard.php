<?php

namespace App\Models;

use App\Models\User;
use App\Models\Venue;
use App\Models\MembershipOrder;
use Illuminate\Database\Eloquent\Model;
use Cviebrock\EloquentSluggable\Sluggable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MembershipCard extends Model
{
    use HasFactory, Sluggable, SoftDeletes;

    protected $table = 'membership_cards';

    protected $fillable = [
        'member_no',
        'user_id',
        'venue_id',
        'name',
        'phone_number',
        'email',
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
        return 'slug';
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function venue()
    {
        return $this->belongsTo(Venue::class);
    }

    public function orders()
    {
        return $this->hasMany(MembershipOrder::class);
    }

    public function latestOrder()
    {
        return $this->hasOne(MembershipOrder::class)->latestOfMany('end_date');
    }
}
