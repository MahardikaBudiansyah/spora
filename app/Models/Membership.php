<?php

namespace App\Models;

use App\Models\User;
use App\Models\Venue;
use App\Models\Invoice;
use App\Models\MembershipUser;
use App\Models\MembershipPackage;
use App\Models\MembershipDuration;
use Illuminate\Database\Eloquent\Model;
use Cviebrock\EloquentSluggable\Sluggable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Membership extends Model
{
    use HasFactory, Sluggable, SoftDeletes;

    protected $table = 'memberships';

    protected $fillable = [
        'order_no',
        'membership_user_id',
        'membership_package_id',
        'total_price',
        'start_date',
        'end_date',
        'remaining_discount_limits',
        'status',
        'is_queued',
        'slug',
    ];

    public function sluggable(): array
    {
        return [
            'slug' => [
                'source' => 'order_no'
            ]
        ];
    }

    public function getRouteKeyName()
    {
        return 'order_no';
    }

    public function membershipUser() {
        return $this->belongsTo(MembershipUser::class);
    }

    public function user()
    {
        return $this->hasOneThrough(
            User::class,
            MembershipUser::class,
            'id',      // Foreign key di membership_users ke memberships
            'id',      // Primary key di users
            'membership_user_id', // Foreign key di memberships
            'user_id'  // Foreign key di membership_users
        );
    }

    public function membershipPackage() {
        return $this->belongsTo(MembershipPackage::class, 'membership_package_id');
    }

    public function scopeActiveForUserVenue($query, $userId, $venueId)
    {
        return $query->whereHas('membershipUser', function($q) use ($userId, $venueId) {
                $q->where('user_id', $userId)
                ->where('venue_id', $venueId)
                ->where('is_active', true);
            })
            ->whereHas('membershipPackage', function($q) use ($venueId) {
                $q->where('venue_id', $venueId);
            })
            ->where('status', 'active')
            ->where('end_date', '>=', now());
    }


    public function invoice()
    {
        return $this->morphOne(Invoice::class, 'order');
    }

    public function getOrderLabelAttribute() { 
        return "Membership"; 
    }
}
