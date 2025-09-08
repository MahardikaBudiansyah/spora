<?php

namespace App\Models;

use App\Models\Merchant;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MerchantProfile extends Model
{
    use HasFactory;

    protected $table = 'merchant_profiles';

    protected $fillable = [
        'merchant_id',
        'nik',
        'full_name',
        'ktp_photo',
        'selfie_with_ktp',
        'bank_name',
        'bank_account_number',
        'verification_status',
        'verified_at',
        'rejection_reason',
    ];

    public function merchant()
    {
        return $this->belongsTo(Merchant::class);
    }
}
