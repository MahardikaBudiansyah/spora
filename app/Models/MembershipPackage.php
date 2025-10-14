<?php

namespace App\Models;

use App\Models\Venue;
use App\Models\Invoice;
use App\Models\Membership;
use App\Models\MembershipBenefitOther;
use Illuminate\Database\Eloquent\Model;
use App\Models\MembershipBenefitDiscount;
use Cviebrock\EloquentSluggable\Sluggable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MembershipPackage extends Model
{
    use HasFactory, Sluggable, SoftDeletes;

    protected $table = 'membership_packages';

    protected $fillable = [
        'venue_id',
        'name',
        'duration_months',
        'price',
        'description',
        'is_active',
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


    public function venue()
    {
        return $this->belongsTo(Venue::class);
    }

    public function discounts()
    {
        return $this->hasMany(MembershipBenefitDiscount::class);
    }

    public function others()
    {
        return $this->hasMany(MembershipBenefitOther::class);
    }

    public function invoices()
    {
        return $this->morphMany(Invoice::class, 'order');
    }


    public function memberships()
    {
        return $this->hasMany(Membership::class);
    }
}
