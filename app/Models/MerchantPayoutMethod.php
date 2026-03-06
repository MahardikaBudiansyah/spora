<?php

namespace App\Models;

use App\Models\Merchant;
use App\Traits\HasStatusHistory;
use Illuminate\Database\Eloquent\Model;
use App\Enums\MerchantPayoutMethodStatus;
use App\Enums\PayoutMethodType;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MerchantPayoutMethod extends Model
{
    use HasFactory, SoftDeletes, HasStatusHistory;

    protected $table = 'merchant_payout_methods';

    protected $fillable = [
        'merchant_id',
        'type',
        'provider_name',
        'account_number',
        'account_holder_name',
        'status',
        'is_primary',
    ];

    protected $casts = [
        // 'account_number' => 'encrypted',
        'tpye' => PayoutMethodType::class,
        'status' => MerchantPayoutMethodStatus::class,
        'is_primary' => 'boolean',
    ];

    public function merchant()
    {
        return $this->belongsTo(Merchant::class);
    }
}
