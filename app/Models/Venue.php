<?php

namespace App\Models;

use App\Models\Cart;
use App\Models\Court;
use App\Models\Review;
use App\Models\Booking;
use App\Enums\OrderType;
use App\Enums\VenueStatus;
use App\Models\Merchant;
use App\Models\VenueImage;
use App\Traits\HasAddress;
use App\Models\Subscription;
use App\Models\OperatorVenue;
use App\Models\VenueCategory;
use App\Models\VenueFacility;
use App\Models\MembershipCard;
use App\Models\MembershipUser;
use App\Traits\HasSocialMedia;
use App\Models\MembershipOrder;
use App\Traits\HasStatusHistory;
use App\Models\MembershipPackage;
use App\Models\VenuePaymentPolicy;
use Illuminate\Database\Eloquent\Model;
use Cviebrock\EloquentSluggable\Sluggable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Venue extends Model
{
    use HasFactory, Sluggable, SoftDeletes, HasStatusHistory, HasAddress, HasSocialMedia;

    protected $table = 'venues';

    protected $fillable = [
        'merchant_id',
        'name',
        'description',
        'phone_number',
        'status',
        'is_reverification_required',
        'is_active',
        'slug',
    ];

    protected $casts = [
        'status' => VenueStatus::class,
        'is_active' => 'boolean',
    ];

    protected $attributes = [
        'status' => VenueStatus::DRAFT,
        'is_active' => false,
    ];

    public function sluggable(): array
    {
        return [
            'slug' => [
                'source' => 'name'
            ]
        ];
    }

    public function getRouteKeyName()
    {
        return 'slug';
    }

    public function images()
    {
        return $this->hasMany(VenueImage::class);
    }

    public function featuredImage()
    {
        return $this->hasOne(VenueImage::class)->where('is_featured', true);
    }

    public function merchant()
    {
        return $this->belongsTo(Merchant::class, 'merchant_id', 'id');
    }

    public function operatorVenues()
    {
        return $this->hasMany(OperatorVenue::class, 'venue_id', 'id');
    }

    public function categories()
    {
        return $this->belongsToMany(VenueCategory::class, 'category_venue', 'venue_id', 'category_id')
            ->withTimestamps();
    }

    public function facilities()
    {
        return $this->belongsToMany(VenueFacility::class, 'facility_venue', 'venue_id', 'venue_facility_id')->withTimestamps();
    }

    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }

    public function membershipPackages()
    {
        return $this->hasMany(MembershipPackage::class);
    }

    public function membershipCards()
    {
        return $this->hasMany(MembershipCard::class);
    }

    public function membershipUsers()
    {
        return $this->hasMany(MembershipUser::class);
    }

    public function courts()
    {
        return $this->hasMany(Court::class, 'venue_id', 'id');
    }

    public function carts()
    {
        return $this->hasMany(Cart::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class, 'venue_id', 'id');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function paymentPolicies()
    {
        return $this->hasMany(VenuePaymentPolicy::class);
    }

    public function getPolicyFor($type)
    {
        if (is_string($type)) {
            $type = match ($type) {
                Booking::class => OrderType::BOOKING,
                MembershipOrder::class => OrderType::MEMBERSHIP,
                default => $type
            };
        }

        return $this->paymentPolicies()->where('order_type', $type)->first();
    }
}
