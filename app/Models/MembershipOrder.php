<?php

namespace App\Models;

use Carbon\Carbon;
use App\Models\User;
use App\Models\Invoice;
use App\Models\MembershipCard;
use App\Models\MembershipPackage;
use App\Models\OperatorAssignment;
use App\Enums\MembershipOrderStatus;
use Illuminate\Database\Eloquent\Model;
use Cviebrock\EloquentSluggable\Sluggable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MembershipOrder extends Model
{
    use HasFactory, Sluggable, SoftDeletes;

    protected $table = 'membership_orders';

    protected $fillable = [
        'order_no',
        'venue_id',
        'venue_payment_policy_id',
        'operator_assignment_id',
        'membership_card_id',
        'membership_package_id',
        'total_price',
        'start_date',
        'end_date',
        'remaining_discount_limits',
        'status',
        'is_queued',
        'slug',
        'venue_name_snapshot',
        'operator_name_snapshot',
        'member_no_snapshot',
        'member_name_snapshot',
        'member_number_phone_snapshot',
        'package_name_snapshot',
        'duration_month_snapshot',
        'discount_type_snapshot',
        'discount_value_snapshot',
        'discount_limit_snapshot',
        'dp_enabled_snapshot',
        'dp_type_snapshot',
        'dp_value_snapshot',
    ];

    protected $casts = [
        'status'    => MembershipOrderStatus::class,
        'is_queued' => 'boolean',
        
        'start_date' => 'date',
        'end_date'   => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',

        'total_price'             => 'decimal:2',
        'discount_value_snapshot' => 'decimal:2',
        'dp_value_snapshot'       => 'decimal:2',
        
        'dp_enabled_snapshot' => 'boolean',
        
        'remaining_discount_limits' => 'integer',
        'duration_month_snapshot'   => 'integer',
        'discount_type_snapshot'    => 'string',
        'discount_limit_snapshot'   => 'integer',

        'dp_type_snapshot'          => 'string',
    ];


    public function sluggable(): array
    {
        return [
            'slug' => [
                'source' => 'order_no'
            ]
        ];
    }

    public function getRouteKeyName()
    {
        return 'slug';
    }

    public function membershipPackage() {
        return $this->belongsTo(MembershipPackage::class);
    }

    public function membershipCard() {
        return $this->belongsTo(MembershipCard::class);
    }

    public function user()
    {
        return $this->hasOneThrough(
            User::class,
            MembershipCard::class,
            'id',
            'id',
            'membership_card_id',
            'user_id'
        );
    }

    public function venue()
    {
        return $this->belongsTo(Venue::class, 'venue_id', 'id');
    }

    public function scopeActiveForMember($query, $phone, $venueId)
    {
        return $query->whereHas('membershipCard', function ($q) use ($phone, $venueId) {
                $q->where('phone_number', $phone)
                ->where('venue_id', $venueId)
                ->where('is_active', true);
            })
            ->where('status', MembershipOrderStatus::ACTIVE) 
            ->whereDate('start_date', '<=', now()) 
            ->whereDate('end_date', '>=', now())
            ->where('remaining_discount_limits', '>', 0);
    }

    public function invoice()
    {
        return $this->morphOne(Invoice::class, 'order');
    }

    public function getOrderLabelAttribute() { 
        return "MembershipOrder"; 
    }

    protected $with = ['operatorAssignment.operatorVenue.staff'];

    public function operatorAssignment()
    {
        return $this->belongsTo(OperatorAssignment::class, 'operator_assignment_id');
    }

    public function getOperatorAttribute()
    {
        return $this->operatorAssignment?->operatorVenue?->staff;
    }
}
