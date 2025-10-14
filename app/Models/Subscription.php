<?php

namespace App\Models;

use App\Models\Invoice;
use App\Models\Merchant;
use App\Models\SubscriptionPackage;
use App\Models\SubscriptionMerchant;
use Illuminate\Database\Eloquent\Model;
use Cviebrock\EloquentSluggable\Sluggable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Subscription extends Model
{
    use HasFactory, Sluggable, SoftDeletes;

    protected $table = 'subscriptions';

    protected $fillable = [
        'order_no',
        'merchant_id',
        'subscription_package_id',
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

    public function merchant()
    {
        return $this->belongsTo(Merchant::class);
    }

    public function subscriptionPackage()
    {
        return $this->belongsTo(SubscriptionPackage::class, 'subscription_package_id');
    }

    public function subscriptionMerchant()
    {
        return $this->hasOne(SubscriptionMerchant::class);
    }

    public function invoice()
    {
        return $this->morphOne(Invoice::class, 'order');
    }

    public function getOrderLabelAttribute() {
        return "Subscription";
    }

}
