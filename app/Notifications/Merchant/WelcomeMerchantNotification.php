<?php

namespace App\Notifications\Merchant;

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
            'title' => "Selamat Datang Mitra '{$this->merchant->name}',  di Spora! 🎉",
            'message' => 'Langkah terakhir: Lengkapilah data profil owner, bisnis dan metode pencairan dana (rekening) Anda untuk mengaktifkan fitur pencairan dana.',
            'action_url' => route('merchant.profile.index'),
        ];
    }
}
