<?php

namespace App\Notifications\User;

use Illuminate\Notifications\Notification;

class WelcomeUserNotification extends Notification
{
    protected $user;

    public function __construct($user)
    {
        $this->user = $user;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'title' => "Selamat Datang Sobat Spora '{$this->user->name}',  di Platform Spora! 🎉",
            'message' => 'Langkah terakhir: Lengkapi Profil Sobat Spora. Booking Court favoritmu jadi lebih mudah pada platform, dan jadilah Membership pada Venue favoritmu. Banyak diskon yang dapat digunakan.',
            'action_url' => route('user.profile.edit'),
        ];
    }
}
