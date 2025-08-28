<?php

namespace App\Models;

use App\Models\Subscription;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SubscriptionDuration extends Model
{
    use HasFactory;

    protected $table = 'subscription_durations';

    protected $fillable = [
        'duration',
        'months',
    ];

    public function subscriptions()
    {
        return $this->hasMany(Subscription::class, 'duration_id');
    }
}
