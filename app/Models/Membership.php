<?php

namespace App\Models;

use App\Models\User;
use App\Models\Venue;
use App\Models\Invoice;
use App\Models\MembershipPackage;
use App\Models\MembershipDuration;
use Illuminate\Database\Eloquent\Model;
use Cviebrock\EloquentSluggable\Sluggable;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Membership extends Model
{
    use HasFactory, Sluggable;

    protected $table = 'memberships';

    protected $fillable = [
        'order_no',
        'user_id',
        'venue_id',
        'membership_package_id',
        'membership_duration_id',
        'total_price',
        'start_date',
        'end_date',
        'status',
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
        return 'slug';
    }

    public function user() {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function venue() {
        return $this->belongsTo(Venue::class, 'venue_id');
    }

    public function membershipPackage() {
        return $this->belongsTo(MembershipPackage::class, 'membership_package_id');
    }

    public function membershipDuration() {
        return $this->belongsTo(MembershipDuration::class, 'membership_duration_id');
    }

    public function invoices()
    {
        return $this->morphMany(Invoice::class, 'order');
    }

    public function getOrderLabelAttribute() { 
        return "Membership"; 
    }
}
