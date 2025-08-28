<?php

namespace App\Models;

use App\Models\Subscription;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SubscriptionPackage extends Model
{
    use HasFactory;

    protected $table = 'subscription_packages';

    protected $fillable = [
        'name',
        'price',

    ];

    public function subscriptions()
    {
        return $this->hasMany(Subscription::class, 'package_id');
    }
}
