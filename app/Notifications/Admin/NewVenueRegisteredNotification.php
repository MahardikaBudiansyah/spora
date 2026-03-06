<?php

namespace App\Notifications\Admin;

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
            'title' => 'Pengajuan Venue Baru',
            'message' => "Mitra '{$this->merchant->name}' telah menambahkan venue baru: '{$this->venue->name}'.",
            'action_url' => route('admin.venues.index'),
            'type' => 'venue_registration'
        ];
    }
}
