<?php

namespace App\Notifications\Merchant;

use App\Enums\NotificationCategory;
use App\Enums\NotificationSource;
use Illuminate\Notifications\Notification;

class VerificationSubmittedNotification extends Notification
{
    protected $section;

    public function __construct($section)
    {
        $this->section = $section;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'type' => 'verification_submitted',
            'source' => NotificationSource::ADMIN,
            'category' => NotificationCategory::ACCOUNT,
            'title' => "Verifikasi {$this->section} Sedang Diproses",
            'message' => "Pengajuan verifikasi {$this->section} Anda telah diterima dan sedang ditinjau oleh tim admin.",
            'section' => $this->section,
            'action_url' => route('merchant.profile.index'),
        ];
    }
}
