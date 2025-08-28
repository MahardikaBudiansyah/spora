<?php

namespace App\Models;

use App\Models\MerchantStaffRole;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class StaffRole extends Model
{
    use HasFactory;

    protected $table = 'staff_roles';

    protected $fillable = [
        'name',
    ];

    public function merchantStaffRoles()
    {
        return $this->hasMany(MerchantStaffRole::class);
    }
}
