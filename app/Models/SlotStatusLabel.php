<?php

namespace App\Models;

use App\Models\SlotStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SlotStatusLabel extends Model
{
    use HasFactory;

    protected $table = 'slot_status_labels';
    
    protected $fillable = [
        'name',
        'label',
    ];

    public function slotStatuses()
    {
        return $this->hasMany(SlotStatus::class, 'status_id','id');
    }
}
