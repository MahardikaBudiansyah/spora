<?php

namespace App\Models;

use App\Enums\BusinessType;
use App\Models\Merchant;
use App\Traits\HasAddress;
use App\Traits\HasStatusHistory;
use App\Enums\MerchantProfileStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MerchantProfile extends Model
{
    use HasFactory, SoftDeletes, HasStatusHistory, HasAddress;

    protected $table = 'merchant_profiles';

    protected $fillable = [
        'merchant_id',
        'business_name',
        'business_email',
        'business_phone_number',
        'business_type',
        'nib',
        'status',
    ];

    protected $casts = [
        'status' => MerchantProfileStatus::class,
        'business_type' => BusinessType::class
    ];

    public function merchant()
    {
        return $this->belongsTo(Merchant::class);
    }
}
