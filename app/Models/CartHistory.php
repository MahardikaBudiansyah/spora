<?php

namespace App\Models;

use App\Models\Cart;
use App\Models\User;
use App\Models\Field;
use App\Models\TimeSlot;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CartHistory extends Model
{
    use HasFactory;

    protected $table = 'cart_histories';

    protected $fillable = [
        'cart_id',
        'user_id',
        'field_id',
        'time_slot_id',
        'price',
        'status',
        'added_at'
    ];

    const STATUS_ADDED = 'added';
    const STATUS_REMOVED = 'removed';
    const STATUS_BOOKED = 'booked';
    const STATUS_EXPIRED = 'expired';

    public static $statuses = [
        self::STATUS_ADDED,
        self::STATUS_REMOVED,
        self::STATUS_BOOKED,
        self::STATUS_EXPIRED,
    ];

    public function cart()
    {
        return $this->belongsTo(Cart::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function field()
    {
        return $this->belongsTo(Field::class);
    }

    public function timeSlot()
    {
        return $this->belongsTo(TimeSlot::class);
    }

}
