<?php

namespace App\Models;

use App\Models\Subscription;
use Illuminate\Database\Eloquent\Model;
use Cviebrock\EloquentSluggable\Sluggable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SubscriptionPackage extends Model
{
    use HasFactory, Sluggable, SoftDeletes;

    protected $table = 'subscription_packages';

    protected $fillable = [
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
                'source' => 'name'
            ]
        ];
    }

    public function getRouteKeyName()
    {
        return 'slug';
    }

    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }
}
