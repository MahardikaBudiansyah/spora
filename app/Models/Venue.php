<?php

namespace App\Models;

use App\Models\Cart;
use App\Models\Field;
use App\Models\Image;
use App\Models\Booking;
use App\Models\Facility;
use App\Models\Merchant;
use App\Models\VenueImage;
use App\Models\Subscription;
use App\Models\OperatorVenue;
use Illuminate\Database\Eloquent\Model;
use Cviebrock\EloquentSluggable\Sluggable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Venue extends Model
{
    use HasFactory, Sluggable, SoftDeletes;

    protected $table = 'venues';

    protected $fillable = [
        'name',
        'description',
        'location',
        'phone_number',
        'slug',
        'merchant_id',
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
    
    public function facilities()
    {
        return $this->belongsToMany(Facility::class, 'facility_venue', 'venue_id', 'facility_id')->withTimestamps();
    }

    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }

    public function fields()
    {
        return $this->hasMany(Field::class, 'venue_id', 'id');
    }

    public function carts()
    {
        return $this->hasMany(Cart::class, 'venue_id','id');
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class, 'venue_id', 'id');
    }

}
