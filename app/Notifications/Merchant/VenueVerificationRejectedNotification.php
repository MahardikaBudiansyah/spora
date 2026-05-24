<?php

namespace App\Notifications\Merchant;

use App\Enums\NotificationCategory;
use App\Enums\NotificationSource;
use App\Models\Venue;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class VenueVerificationRejectedNotification extends Notification
{
    use Queueable;

    protected $venue;
    protected $reason;

    /**
     * @param Venue $venue
     * @param string $reason
     */
    public function __construct(Venue $venue, $reason)
    {
        $this->venue = $venue;
        $this->reason = $reason;
    }

    public function via($notifiable): array
    {
        return ['database'];
    }

    public function toDatabase($notifiable): array
    {
        return [
            'type' => 'venue_verification_rejected',
            'source' => NotificationSource::ADMIN,
            'category' => NotificationCategory::INFO,
            'title' => "Verifikasi Venue Ditolak",
            'message' => "Verifikasi untuk venue '{$this->venue->name}' ditolak. Alasan: {$this->reason}. Silakan perbaiki data untuk mengajukan ulang.",
            'venue_id' => $this->venue->id,
            'venue_slug' => $this->venue->slug,
            'reason' => $this->reason,
            'action_url' => route('merchant.venues.index'),
        ];
    }
}
