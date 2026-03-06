<?php

namespace App\Models;

use App\Enums\NotificationCategory;
use App\Enums\NotificationSource;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\DatabaseNotification as BaseNotification;

class Notification extends BaseNotification
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'type',
        'notifiable_id',
        'notifiable_type',
        'source',
        'category',
        'data',
        'read_at',
        'is_pinned',
        'is_archived',
    ];

    protected $casts = [
        'source' => NotificationSource::class,
        'category' => NotificationCategory::class,
        'data' => 'array',
        'read_at' => 'datetime',
        'is_pinned' => 'boolean',
        'is_archived' => 'boolean',
    ];

    public function isRead()
    {
        return !is_null($this->read_at);
    }
}
