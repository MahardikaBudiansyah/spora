<?php

namespace App\Models;

use App\Models\Cart;
use App\Models\User;
use App\Models\Venue;
use App\Models\TimeSlot;
use App\Models\FieldType;
use App\Models\FieldImage;
use App\Models\SlotStatus;
use App\Models\BookingDetail;
use Illuminate\Database\Eloquent\Model;
use Cviebrock\EloquentSluggable\Sluggable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Field extends Model
{
    use HasFactory, Sluggable, SoftDeletes;

    protected $table = 'fields';

    protected $fillable = [
        'name',
        'field_type_id',
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
        return $this->hasMany(FieldImage::class);
    }

    public function featuredImage()
    {
        return $this->hasOne(FieldImage::class)->where('is_featured', true);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function type()
    {
        return $this->belongsTo(FieldType::class, 'field_type_id', 'id');
    }

    public function timeslots()
    {
        return $this->belongsToMany(TimeSlot::class, 'field_time_slot', 'field_id', 'time_slot_id')->withPivot('price')->withTimestamps();
    }

    public function slotStatuses()
    {
        return $this->hasMany(SlotStatus::class, 'field_id', 'id');
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
        return $this->hasMany(BookingDetail::class, 'field_id', 'id');
    }

}
