<?php

namespace App\Models;

use App\Models\Venue;
use App\Enums\OrderType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class VenuePaymentPolicy extends Model
{
    use HasFactory;

    protected $table = 'venue_payment_policies';

    protected $fillable = [
        'venue_id',
        'order_type',
        'enable_dp',
        'dp_type',
        'dp_value',
        'full_payment_days_before',
        'max_full_payment_days',
        'enable_refund',
        'refund_percentage',
        'is_active',
    ];

    protected $casts = [
        'order_type'       => OrderType::class, 
        'enable_dp'        => 'boolean',
        'dp_value'         => 'decimal:2',
        'enable_refund'    => 'boolean',
        'refund_percentage'=> 'decimal:2',
        'is_active'        => 'boolean',
        'full_payment_days_before' => 'integer',
        'max_full_payment_days'    => 'integer',
    ];

    public function venue()
    {
        return $this->belongsTo(Venue::class);
    }

    public function supportsDownPayment(): bool
    {
        return $this->enable_dp && $this->is_active;
    }

    public function getPaymentOptions(): array
    {
        $options = [
            ['value' => 'full_payment', 'label' => 'Full Payment (Lunas)']
        ];

        if ($this->supportsDownPayment()) {
            $options[] = ['value' => 'down_payment', 'label' => 'Down Payment (DP)'];
        }

        return $options;
    }
}