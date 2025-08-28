<?php

namespace App\Models;

use App\Models\Membership;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MembershipPackage extends Model
{
    use HasFactory;

    protected $table = 'membership_packages';

    protected $fillable = [
        'name',
        'price',
        'description',

    ];

    public function memberships()
    {
        return $this->hasMany(Membership::class, 'package_id');
    }
}
