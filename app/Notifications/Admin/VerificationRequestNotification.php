<?php

namespace App\Notifications\Admin;

use App\Enums\NotificationCategory;
use App\Enums\NotificationSource;
use Illuminate\Notifications\Notification;

class VerificationRequestNotification extends Notification
{
    protected $merchant;
    protected $section;

    public function __construct($merchant, $section)
    {
        $this->merchant = $merchant;
        $this->section = $section;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'type' => 'request_verification',
            'source' => NotificationSource::MERCHANT,
            'category' => NotificationCategory::ACCOUNT,
            'title' => "Permintaan Verifikasi {$this->section}.",
            'message' => "Mitra {$this->merchant->name} mengajukan Verifikasi {$this->section}.",
            'sender_id' => $this->merchant->id,
            'sender_name' => $this->merchant->name,
            'sender_avatar' => $this->merchant->logo_path,
            'action_url' => route('admin.merchants.verification.index', $this->merchant->slug),
        ];
    }
}
