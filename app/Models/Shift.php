<?php

namespace App\Models;

use App\Models\Merchant;
use App\Models\OperatorVenue;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Shift extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'shifts';

    protected $fillable = [
        'merchant_id',
        'name',
        'start_time',
        'end_time',
        'is_active',
    ];

    // Relasi ke Merchant
    public function merchant()
    {
        return $this->belongsTo(Merchant::class);
    }

    // Relasi ke operator_venue_shifts (banyak operator bisa ada di shift ini)
    public function operatorVenues()
    {
        return $this->hasMany(OperatorVenue::class);
    }
}
