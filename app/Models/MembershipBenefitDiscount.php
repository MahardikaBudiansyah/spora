<?php

namespace App\Models;

use App\Models\MembershipPackage;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MembershipBenefitDiscount extends Model
{
    use HasFactory;

    protected $table = 'membership_benefit_discounts';

    protected $fillable = [
        'name',
        'discount_type',
        'discount_value',
        'discount_limit',
        'description',

    ];

    protected $casts = [
        'discount_type'  => 'string', 
        'discount_value' => 'decimal:2', 
        'discount_limit' => 'integer',
    ];

    public function membershipPackage()
    {
        return $this->belongsTo(MembershipPackage::class);
    }

}
