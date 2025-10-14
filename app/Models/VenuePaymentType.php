<?php

namespace App\Models;

use App\Models\Venue;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class VenuePaymentType extends Model
{
    use HasFactory;

    protected $table = 'venue_payment_types';

    protected $fillable = [
        'venue_id',
        'enable_dp',
        'dp_type',
        'dp_value',
        'apply_to_merchant',
        'is_active',
    ];

    protected $casts = [
        'enable_dp'        => 'boolean',
        'apply_to_merchant'=> 'boolean',
        'is_active'        => 'boolean',
        'dp_value'         => 'decimal:2',
    ];

    /**
     * Relasi ke Venue
     */
    public function venue()
    {
        return $this->belongsTo(Venue::class);
    }

    /**
     * Cek apakah venue ini support DP
     */
    public function supportsDownPayment(): bool
    {
        return $this->enable_dp && $this->is_active;
    }

    /**
     * Ambil opsi pembayaran yang tersedia
     */
    public function availablePaymentOptions(): array
    {
        $options = ['full_payment'];

        if ($this->supportsDownPayment()) {
            $options[] = 'down_payment';
        }

        return $options;
    }
}
