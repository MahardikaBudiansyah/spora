<?php

namespace App\Notifications\Merchant;

use App\Enums\NotificationCategory;
use App\Enums\NotificationSource;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class VerificationApprovedNotification extends Notification
{
    use Queueable;

    protected $section;
    protected $reason;

    /**
     * @param string $section 
     * @param string $reason 
     */
    public function __construct($section, $reason)
    {
        $this->section = $section;
        $this->reason = $reason;
    }

    public function via($notifiable): array
    {
        return ['database'];
    }

    public function toDatabase($notifiable): array
    {
        return [
            'type' => 'verification_approved',
            'source' => NotificationSource::ADMIN,
            'category' => NotificationCategory::ACCOUNT,
            'title' => "Verifikasi {$this->section} Disetujui",
            'message' => "Data {$this->section} Anda disetujui. {$this->reason}",
            'section' => $this->section,
            'reason' => $this->reason,
            'action_url' => route('merchant.profile.index'),
        ];
    }
}
