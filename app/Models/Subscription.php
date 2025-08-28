<?php

namespace App\Models;

use App\Models\Merchant;
use App\Models\Invoice;
use App\Models\SubscriptionPackage;
use App\Models\SubscriptionDuration;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Subscription extends Model
{
    use HasFactory;

    protected $table = 'subscriptions';

    protected $fillable = [
        'order_no',
        'merchant_id',
        'package_id',
        'duration_id',
        'start_date',
        'end_date',
        'status',
    ];

    public function merchant()
    {
        return $this->belongsTo(Merchant::class);
    }

    public function subscriptionPackage()
    {
        return $this->belongsTo(SubscriptionPackage::class, 'package_id');
    }

    public function subscriptionDuration()
    {
        return $this->belongsTo(SubscriptionDuration::class, 'duration_id');
    }

    public function invoices()
    {
        return $this->morphMany(Invoice::class, 'order');
    }

    public function getOrderLabelAttribute() {
        return "Subscription";
    }

}
