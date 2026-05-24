<?php

namespace App\Notifications\Admin;

use App\Enums\NotificationCategory;
use App\Enums\NotificationSource;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class NewVenueRegisteredNotification extends Notification
{
    use Queueable;

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
            'type' => 'venue_registration',
            'source' => NotificationSource::MERCHANT,
            'category' => NotificationCategory::INFO,
            'title' => 'Pengajuan Venue Baru',
            'message' => "Mitra '{$this->merchant->name}' telah menambahkan venue baru: '{$this->venue->name}'.",
            'venue_id' => $this->venue->id,
            'venue_slug' => $this->venue->slug,
            'action_url' => route('admin.venues.index'),
        ];
    }
}
