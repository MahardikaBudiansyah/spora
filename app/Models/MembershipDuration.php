<?php

namespace App\Models;

use App\Models\Membership;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MembershipDuration extends Model
{
    use HasFactory;

    protected $table = 'membership_durations';

    protected $fillable = [
        'name', 
        'months',
    ];

    public function memberships() {
        return $this->hasMany(Membership::class, 'membership_duration_id');
    }
}
