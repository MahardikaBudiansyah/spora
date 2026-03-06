<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StatusHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'statusable_id',
        'statusable_type',
        'status',
        'reason',
        'admin_id',
        'merchant_id',
        'change_by_snapshot',
        'is_system_generated',
    ];

    public function statusable()
    {
        return $this->morphTo();
    }
}
