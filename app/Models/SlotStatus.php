<?php

namespace App\Models;

use App\Models\Field;
use App\Models\TimeSlot;
use App\Models\SlotStatusLabel;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SlotStatus extends Model
{
    use HasFactory;

    protected $table = 'slot_statuses';

    protected $fillable = [
        'field_id',
        'time_slot_id',
        'date',
        'status_id',
    ];

    public function slotStatusLabel()
    {
        return $this->belongsTo(SlotStatusLabel::class, 'status_id', 'id');
    }

    public function field()
    {
        return $this->belongsTo(Field::class, 'field_id', 'id');
    }

    public function timeSlot()
    {
        return $this->belongsTo(TimeSlot::class, 'time_slot_id', 'id');
    }
}
