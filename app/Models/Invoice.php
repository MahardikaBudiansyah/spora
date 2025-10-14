<?php

namespace App\Models;

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
        return $this->morphTo();
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }


}
