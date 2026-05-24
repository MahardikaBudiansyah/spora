<?php

namespace App\Notifications\Merchant;

use App\Enums\NotificationCategory;
use App\Enums\NotificationSource;
use Illuminate\Notifications\Notification;

class VenueCreatedNotification extends Notification
{
    protected $merchant;
    protected $venue;

    public function __construct($merchant, $venue)
    {
        $this->merchant = $merchant;
        $this->venue = $venue;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'type' => 'venue_status',
            'source' => NotificationSource::ADMIN,
            'category' => NotificationCategory::INFO,
            'title' => 'Venue Berhasil Dibuat! 🎉',
            'message' => "Venue '{$this->venue->name}' telah berhasil didaftarkan. Langkah terakhir: Ajukan verifikasi venue Anda.",
            'action_url' => route('merchant.venues.show', $this->venue->slug),
        ];
    }
}
