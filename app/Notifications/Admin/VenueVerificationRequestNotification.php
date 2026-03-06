<?php

namespace App\Notifications\Admin;

use Illuminate\Notifications\Notification;

class VenueVerificationRequestNotification extends Notification
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

    public function toArray($notifiable)
    {
        return [
            'title' => "Permintaan Verifikasi Data Venue {$this->venue->name}",
            'message' => "Mitra {$this->merchant->name} mengajukan Verifikasi {$this->venue->name}.",
            'merchant_id' => $this->merchant->id,
            'venue_id' => $this->venue->id,
            'action_url' => route('admin.venues.verification.index', $this->merchant->slug),
            'type' => 'request_venue_verification'
        ];
    }
}
