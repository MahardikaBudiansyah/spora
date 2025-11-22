<?php

namespace App\Models;

use App\Models\Booking;
use App\Models\Membership;
use Illuminate\Database\Eloquent\Model;
use Cviebrock\EloquentSluggable\Sluggable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Invoice extends Model
{
    use HasFactory, Sluggable, SoftDeletes;

    protected $table = 'invoices';

    protected $fillable = [
        'invoice_no',
        'total_amount',
        'status',
        'due_date',
        'slug',
    ];

    public function sluggable(): array
    {
        return [
            'slug' => [
                'source' => 'invoice_no'
            ]
        ];
    }

    public function getRouteKeyName()
    {
        return 'invoice_no';
    }

    public function order()
    {
        return $this->morphTo()->morphWith([
            Booking::class => ['venue', 'customer'],
            Membership::class => ['membershipPackage.venue', 'membershipUser.user']
        ]);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    protected $appends = ['customer_name', 'order_type_label'];

    public function getCustomerNameAttribute()
    {
        if (!$this->order) return '-';

        // Jika Booking
        if ($this->order_type === Booking::class) {
            return $this->order->customer->name 
                ?? $this->order->customers->first()->name 
                ?? '-';
        }

        // Jika Membership
        if ($this->order_type === Membership::class) {
            return $this->order->user->name
                ?? $this->order->membershipUser->user->name
                ?? '-';
        }

        return '-';
    }

    public function getOrderTypeLabelAttribute()
    {
        return class_basename($this->order_type);
    }



}
