<?php

namespace App\Models;

use App\Models\Address;
use App\Models\Merchant;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MerchantOwner extends Model
{
    use HasFactory, SoftDeletes;

    protected $guard = 'merchant_owners';

    protected $fillable = [
        'merchant_id',
        'name',
        'email',
        'phone_number',
    ];

    // Relasi ke merchant
    public function merchant()
    {
        return $this->belongsTo(Merchant::class);
    }

    public function addresses()
    {
        return $this->morphMany(Address::class, 'addressable');
    }
}
