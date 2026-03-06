<?php

namespace App\Models;

use App\Models\MembershipOrder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MembershipCustomer extends Model
{
    use HasFactory;

    protected $table = 'membership_customers';

    protected $fillable = [
        'membership_order_id',
        'user_id',
        'name',
        'phone_number',
    ];

    public function membershipOrder()
    {
        return $this->belongsTo(MembershipOrder::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
