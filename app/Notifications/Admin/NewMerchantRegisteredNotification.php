<?php

namespace App\Notifications\Admin;

use App\Enums\NotificationCategory;
use App\Enums\NotificationSource;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class NewMerchantRegisteredNotification extends Notification
{
    use Queueable;

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
            'type' => 'merchant_registration',
            'source' => NotificationSource::MERCHANT,
            'category' => NotificationCategory::ACCOUNT,
            'title' => 'Pendaftaran Baru, Mitra Spora',
            'message' => "Mitra baru, '{$this->merchant->name}' telah bergabung. Silakan pantau perkembangan kelengkapan datanya.",
            'action_url' => route('admin.merchants.index'),
            'merchant_id' => $this->merchant->id,
        ];
    }
}
