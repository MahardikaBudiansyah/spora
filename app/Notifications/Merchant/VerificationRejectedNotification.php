<?php

namespace App\Notifications\Merchant;

use App\Enums\NotificationCategory;
use App\Enums\NotificationSource;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class VerificationRejectedNotification extends Notification
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

    public function toDatabase($notifiable)
    {
        return [
            'type' => 'verification_rejected',
            'source' => NotificationSource::ADMIN,
            'category' => NotificationCategory::ACCOUNT,
            'title' => "Verifikasi {$this->section} Ditolak",
            'message' => "Data {$this->section} Anda ditolak. Alasan: {$this->reason}. Lengkapi Data untuk proses pengajuan verifikasi ulang.",
            'section' => $this->section,
            'reason' => $this->reason,
            'action_url' => route('merchant.profile.index'),
        ];
    }
}
