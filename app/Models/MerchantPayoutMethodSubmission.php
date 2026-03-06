<?php

namespace App\Models;

use App\Enums\MerchantPayoutMethodStatus;
use App\Enums\PayoutMethodType;
use App\Models\Merchant;
use App\Traits\HasStatusHistory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MerchantPayoutMethodSubmission extends Model
{
    use HasFactory, SoftDeletes, HasStatusHistory;

    protected $table = 'merchant_payout_method_submissions';

    protected $fillable = [
        'merchant_id',
        'payout_method_id',
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

    public function isComplete()
    {
        $requiredSubmissions = ['type', 'provider_name', 'account_number', 'account_holder_name'];
        foreach ($requiredSubmissions as $submission) {
            if (blank($this->$submission)) return false;
        }

        return true;
    }
}
