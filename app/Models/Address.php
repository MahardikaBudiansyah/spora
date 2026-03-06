<?php

namespace App\Models;

use App\Enums\AddressLabel;
use Laravolt\Indonesia\Models\City;
use Laravolt\Indonesia\Models\Village;
use Illuminate\Database\Eloquent\Model;
use Laravolt\Indonesia\Models\District;
use Laravolt\Indonesia\Models\Province;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Address extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'addressable_id', 
        'addressable_type',
        'label',
        'address',
        'province_code',
        'city_code',
        'district_code',
        'village_code',
        'postal_code',
        'latitude',
        'longitude',
    ];

    protected $casts = [
        'label' => AddressLabel::class,
    ];

    public function addressable()
    {
        return $this->morphTo();
    }

    public function province()
    {
        return $this->belongsTo(Province::class, 'province_code', 'code');
    }

    public function city()
    {
        return $this->belongsTo(City::class, 'city_code', 'code');
    }

    public function district()
    {
        return $this->belongsTo(District::class, 'district_code', 'code');
    }

    public function village()
    {
        return $this->belongsTo(Village::class, 'village_code', 'code');
    }
}
