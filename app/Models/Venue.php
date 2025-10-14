<?php

namespace App\Models;

use App\Models\Cart;
use App\Models\Field;
use App\Models\Image;
use App\Models\Address;
use App\Models\Booking;
use App\Models\Facility;
use App\Models\Merchant;
use App\Models\VenueImage;
use App\Models\Subscription;
use App\Models\OperatorVenue;
use App\Models\MembershipUser;
use App\Models\VenuePaymentType;
use App\Models\MembershipPackage;
use Illuminate\Database\Eloquent\Model;
use Cviebrock\EloquentSluggable\Sluggable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Venue extends Model
{
    use HasFactory, Sluggable, SoftDeletes;

    protected $table = 'venues';

    protected $fillable = [
        'merchant_id',
        'name',
        'description',
        'phone_number',
        'status',
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

    public function addresses() 
    {
        return $this->morphMany(Address::class, 'addressable');
    }

    public function operatorVenues()
    {
        return $this->hasMany(OperatorVenue::class, 'venue_id', 'id');
    }
    
    public function facilities()
    {
        return $this->belongsToMany(Facility::class, 'facility_venue', 'venue_id', 'facility_id')->withTimestamps();
    }

    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }

    public function membershipPackages()
    {
        return $this->hasMany(MembershipPackage::class);
    }

    public function membershipUsers()
    {
        return $this->hasMany(MembershipUser::class);
    }

    public function fields()
    {
        return $this->hasMany(Field::class, 'venue_id', 'id');
    }

    public function carts()
    {
        return $this->hasMany(Cart::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class, 'venue_id', 'id');
    }

    public function paymentType()
    {
        return $this->hasOne(VenuePaymentType::class);
    }

}
