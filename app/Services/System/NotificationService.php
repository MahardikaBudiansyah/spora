<?php

namespace App\Services\System;

use App\Enums\NotificationType;

class NotificationService
{
    public function send($notifiable, NotificationType $type, array $data, string $source = 'platform')
    {
        return $notifiable->notifications()->create([
            'type' => $type,
            'source' => $source,
            'data' => $data,
            'read_at' => null,
        ]);
    }
}
