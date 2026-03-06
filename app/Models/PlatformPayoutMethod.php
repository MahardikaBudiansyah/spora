<?php

namespace App\Models;

use App\Models\PlatformProfile;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PlatformPayoutMethod extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'platform_payout_methods';

    protected $fillable = [
        'platform_profile_id',
        'type',
        'provider_name',
        'account_number',
        'account_holder_name',
        'is_primary',
    ];

    protected $casts = [
        // 'account_number' => 'encrypted',
        'is_primary' => 'boolean',
    ];

    public function profile()
    {
        return $this->belongsTo(PlatformProfile::class, 'platform_profile_id');
    }
}
