<?php

namespace App\Models;

use App\Enums\Gender;
use App\Models\Merchant;
use App\Traits\HasAddress;
use App\Traits\HasStatusHistory;
use App\Enums\MerchantOwnerStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MerchantOwner extends Model
{
    use HasFactory, SoftDeletes, HasStatusHistory, HasAddress;

    protected $guard = 'merchant_owners';

    protected $fillable = [
        'merchant_id',
        'name',
        'email',
        'phone_number',
        'nik',
        'date_of_birth',
        'gender',
        'photo_path',
        'ktp_photo_path',
        'selfie_photo_path',
        'status',
    ];

    protected $casts = [
        'status' => MerchantOwnerStatus::class,
        'gender' => Gender::class,
        'date_of_birth' => 'date',
    ];

    public function merchant()
    {
        return $this->belongsTo(Merchant::class);
    }
}
