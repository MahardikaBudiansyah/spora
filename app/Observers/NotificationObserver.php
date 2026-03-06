<?php

namespace App\Observers;

use App\Models\Notification;
use App\Enums\NotificationCategory;
use App\Enums\NotificationSource;

class NotificationObserver
{
    public function creating(Notification $notification)
    {
        $data = $notification->data;

        if (!$data) return;

        if (isset($data['source'])) {
            $notification->source = $data['source'] instanceof NotificationSource
                ? $data['source']->value
                : $data['source'];
        }

        if (isset($data['category'])) {
            $notification->category = $data['category'] instanceof NotificationCategory
                ? $data['category']->value
                : $data['category'];
        }
    }
}
