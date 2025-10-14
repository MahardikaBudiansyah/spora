<?php

namespace App\Models;

use App\Models\MembershipPackage;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MembershipBenefitOther extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'membership_benefit_others';

    protected $fillable = [
        'name',
        'description',

    ];

    public function membershipPackage()
    {
        return $this->belongsTo(MembershipPackage::class);
    }

}
