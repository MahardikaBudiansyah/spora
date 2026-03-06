<?php

namespace App\Models;

use App\Enums\BusinessType;
use App\Enums\MerchantProfileStatus;
use App\Models\Merchant;
use App\Traits\HasAddress;
use App\Traits\HasStatusHistory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MerchantProfileSubmission extends Model
{
    use HasFactory, SoftDeletes, HasStatusHistory, HasAddress;

    protected $table = 'merchant_profile_submissions';

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

    public function isComplete()
    {
        $requiredProfileSubmissions = ['business_email', 'business_phone_number', 'business_type', 'nib'];

        foreach ($requiredProfileSubmissions as $submission) {
            if (blank($this->$submission)) return false;
        }

        $address = $this->address;

        if (!$address) return false;
        $requiredAddressSubmission = ['address', 'province_code', 'city_code', 'district_code', 'village_code', 'postal_code'];

        foreach ($requiredAddressSubmission as $submission) {
            if (blank($address->$submission)) return false;
        }

        return true;
    }
}
