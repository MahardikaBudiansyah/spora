<?php

namespace App\Notifications\Merchant;

use App\Enums\NotificationCategory;
use App\Enums\NotificationSource;
use Illuminate\Notifications\Notification;

class WelcomeMerchantNotification extends Notification
{
    protected $merchant;

    public function __construct($merchant)
    {
        $this->merchant = $merchant;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'source' => NotificationSource::PLATFORM,
            'category' => NotificationCategory::ACCOUNT,
            'title' => "Selamat Datang Mitra '{$this->merchant->name}',  di Spora! 🎉",
            'message' => 'Langkah terakhir: Lengkapilah data profil owner, bisnis dan metode pencairan dana (rekening) Anda untuk mengaktifkan fitur pencairan dana.',
            'action_url' => route('merchant.profile.index'),
        ];
    }
}
