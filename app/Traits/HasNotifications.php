<?php

namespace App\Traits;

use App\Models\Notification;
use Illuminate\Database\Eloquent\Relations\MorphMany;

trait HasNotifications
{
    public function notifications(): MorphMany
    {
        return $this->morphMany(Notification::class, 'notifiable');
    }

    public function latestNotifications(): MorphMany
    {
        return $this->notifications()->latest();
    }

    public function unreadLatestNotifications(): MorphMany
    {
        return $this->unreadNotifications()->latest();
    }

    public function readNotifications(): MorphMany
    {
        return $this->notifications()->whereNotNull('read_at');
    }

    public function unreadNotifications(): MorphMany
    {
        return $this->notifications()->whereNull('read_at');
    }

    public function markAllNotificationsAsRead()
    {
        return $this->unreadNotifications()->update(['read_at' => now()]);
    }
}
