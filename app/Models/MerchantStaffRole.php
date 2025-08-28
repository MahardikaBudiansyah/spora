<?php

namespace App\Models;

use App\Models\Staff;
use App\Models\Merchant;
use App\Models\StaffRole;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MerchantStaffRole extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'merchant_staff_roles';

    protected $fillable = [
        'merchant_id',
        'staff_role_id',
    ];

    public function merchant()
    {
        return $this->belongsTo(Merchant::class);
    }

    public function staffRole()
    {
        return $this->belongsTo(StaffRole::class);
    }

    public function staff()
    {
        return $this->hasMany(Staff::class, 'merchant_staff_role_id');
    }
    
}