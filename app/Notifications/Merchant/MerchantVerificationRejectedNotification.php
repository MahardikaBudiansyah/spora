<?php

namespace App\Notifications\Merchant;

use App\Enums\NotificationCategory;
use App\Enums\NotificationSource;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class MerchantVerificationRejectedNotification extends Notification
{
    use Queueable;

    protected $merchant;

    public function __construct($merchant)
    {
        $this->merchant = $merchant;
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Verifikasi telah Disetujui - ')
            ->greeting('Halo, ' . $notifiable->name);
    }

    public function toDatabase($notifiable)
    {
        return [
            'type' => 'merchant_verification_rejected',
            'source' => NotificationSource::ADMIN,
            'category' => NotificationCategory::ACCOUNT,
            'title' => 'Verifikasi Mitra Ditolak!',
            'message' => "Mohon Maaf verifikasi data Mitra '{$this->merchant->name}' telah ditolak. Mohon lengkapi kembali data Mitra yang diperlukan!",
            'status' => $this->merchant->status,
            'action_url' => route('merchant.profile.index'),
        ];
    }
}
