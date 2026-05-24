<?php

namespace App\Notifications\Merchant;

use App\Enums\NotificationCategory;
use App\Enums\NotificationSource;
use App\Models\Venue;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class VenueVerificationApprovedNotification extends Notification
{
    use Queueable;

    protected $venue;
    protected $message;

    /**
     * @param Venue $venue 
     * @param string $message
     */
    public function __construct(Venue $venue, $message = 'Data sudah sesuai kriteria.')
    {
        $this->venue = $venue;
        $this->message = $message;
    }

    public function via($notifiable): array
    {
        return ['database'];
    }

    public function toDatabase($notifiable): array
    {
        return [
            'type' => 'venue_verification_approved',
            'source' => NotificationSource::ADMIN,
            'category' => NotificationCategory::INFO,
            'title' => "Verifikasi Venue Disetujui",
            'message' => "Venue '{$this->venue->name}' telah disetujui. {$this->message}",
            'venue_id' => $this->venue->id,
            'venue_slug' => $this->venue->slug,
            'action_url' => route('merchant.venues.index'),
        ];
    }
}
