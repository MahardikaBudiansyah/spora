<?php

namespace App\Models;

use App\Models\Merchant;
use App\Models\Subscription;
use Illuminate\Database\Eloquent\Model;
use Cviebrock\EloquentSluggable\Sluggable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SubscriptionMerchant extends Model
{
    use HasFactory, Sluggable, SoftDeletes;

    protected $table = 'subscription_merchants';

    protected $fillable = [
        'subscription_no',
        'merchant_id',
        'subscription_id',
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
                'source' => 'subscription_no'
            ]
        ];
    }

    public function getRouteKeyName()
    {
        return 'slug';
    }

    public function subscription()
    {
        return $this->belongsTo(Subscription::class);
    }

    public function merchant()
    {
        return $this->hasOneThrough(
            Merchant::class,
            Subscription::class,
            'id',           // Foreign key on subscriptions
            'id',           // Foreign key on merchants
            'subscription_id', // Local key on subscription_merchants
            'merchant_id'      // Local key on subscriptions
        );
    }
}
