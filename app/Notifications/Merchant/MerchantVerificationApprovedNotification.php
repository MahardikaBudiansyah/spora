<?php

namespace App\Notifications\Merchant;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class MerchantVerificationApprovedNotification extends Notification
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
            'title' => 'Verifikasi Mitra Berhasil! 🎉',
            'message' => 'Selamat! Profil merchant Anda telah disetujui. Sekarang Anda bisa mulai mengelola venue.',
            'status' => $this->merchant->status,
            'action_url' => route('merchant.profile.index'),
            'type' => 'merchant_verification_approved'
        ];
    }
}
