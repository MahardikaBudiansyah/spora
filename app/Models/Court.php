<?php

namespace App\Models;

use App\Models\Cart;
use App\Models\User;
use App\Models\Venue;
use App\Models\Review;
use App\Models\TimeSlot;
use App\Models\FieldImage;
use App\Models\CourtSurface;
use App\Models\BookingDetail;
use App\Models\CategoryField;
use App\Models\CourtSchedule;
use App\Models\FieldCategory;
use Illuminate\Database\Eloquent\Model;
use Cviebrock\EloquentSluggable\Sluggable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Court extends Model
{
    use HasFactory, Sluggable, SoftDeletes;

    protected $table = 'courts';

    protected $fillable = [
        'name',
        'court_surface_id',
        'description',
        'slug',
        'venue_id',
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
        return $this->hasMany(CourtImage::class);
    }

    public function featuredImage()
    {
        return $this->hasOne(CourtImage::class)->where('is_featured', true);
    }

    public function categories()
    {
        return $this->belongsToMany(
            CourtCategory::class, 
            'category_court', 
            'court_id', 
            'court_category_id'
        )
        ->using(CategoryCourt::class)
        ->withPivot(['is_primary', 'order', 'notes'])
        ->withTimestamps();
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function surface()
    {
        return $this->belongsTo(CourtSurface::class, 'court_surface_id', 'id');
    }

    public function timeSlots()
    {
        return $this->belongsToMany(TimeSlot::class, 'court_time_slot', 'court_id', 'time_slot_id')->withPivot('day_type', 'price')->withTimestamps();
    }

    public function schedules()
    {
        return $this->hasMany(CourtSchedule::class, 'court_id', 'id');
    }

    public function venue()
    {
        return $this->belongsTo(Venue::class, 'venue_id', 'id');
    }

    public function carts()
    {
        return $this->hasMany(Cart::class);
    }

    public function bookingDetails()
    {
        return $this->hasMany(BookingDetail::class, 'court_id', 'id');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

}
