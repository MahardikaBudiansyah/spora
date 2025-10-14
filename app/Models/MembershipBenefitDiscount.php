<?php

namespace App\Models;

use App\Models\MembershipPackage;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MembershipBenefitDiscount extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'membership_benefit_discounts';

    protected $fillable = [
        'name',
        'discount_type',
        'discount_value',
        'discount_limit',
        'description',

    ];

    public function membershipPackage()
    {
        return $this->belongsTo(MembershipPackage::class);
    }

}
