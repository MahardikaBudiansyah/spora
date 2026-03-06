<?php

namespace App\Models;

use App\Models\Admin;
use App\Traits\HasAddress;
use App\Enums\BusinessType;
use App\Traits\HasSocialMedia;
use App\Models\PlatformPayoutMethod;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PlatformProfile extends Model
{
    use HasFactory,
        HasAddress,
        HasSocialMedia;

    protected $table = 'platform_profiles';

    protected $fillable = [
        'admin_id',
        'business_name',
        'business_email',
        'business_phone_number',
        'business_type',
        'nib',
        'logo_path',
        'midtrans_sub_account_id',
        'xendit_sub_account_id',
    ];

    protected $casts = [
        'business_type' => BusinessType::class
    ];

    public function admin()
    {
        return $this->belongsTo(Admin::class);
    }

    public function payoutMethods()
    {
        return $this->hasMany(PlatformPayoutMethod::class);
    }
}
