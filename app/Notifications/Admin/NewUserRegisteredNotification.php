<?php

namespace App\Notifications\Admin;

use App\Enums\NotificationCategory;
use App\Enums\NotificationSource;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class NewUserRegisteredNotification extends Notification
{
    use Queueable;

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
            'type' => 'user_registration',
            'source' => NotificationSource::USER,
            'category' => NotificationCategory::ACCOUNT,
            'title' => 'Pendaftaran Baru Sobat Spora',
            'message' => "Sobat Spora, '{$this->user->name}' telah bergabung.",
            'action_url' => route('admin.users.index'),
            'user_id' => $this->user->id,
        ];
    }
}
