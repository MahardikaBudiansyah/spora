<?php

namespace App\Models;

use App\Enums\Gender;
use App\Enums\MerchantOwnerStatus;
use App\Traits\HasAddress;
use App\Traits\HasStatusHistory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MerchantOwnerSubmission extends Model
{
    use HasFactory, SoftDeletes, HasStatusHistory, HasAddress;

    protected $guard = 'merchant_owner_submissions';

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

    public function isComplete()
    {
        $requiredOwnerSubmissions = ['name', 'nik', 'phone_number', 'date_of_birth', 'gender', 'photo_path', 'ktp_photo_path', 'selfie_photo_path'];
        foreach ($requiredOwnerSubmissions as $submission) {
            if (blank($this->$submission)) return false;
        }

        $address = $this->address;

        if (!$address) return false;
        $requiredAddressSubmissions = ['address', 'province_code', 'city_code', 'district_code', 'village_code', 'postal_code'];

        foreach ($requiredAddressSubmissions as $submission) {
            if (blank($address->$submission)) return false;
        }

        return true;
    }
}
