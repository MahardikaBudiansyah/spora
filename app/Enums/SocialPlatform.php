<?php

namespace App\Enums;

enum SocialPlatform: string
{
    case INSTAGRAM = 'instagram';
    case FACEBOOK = 'facebook';
    case TIKTOK = 'tiktok';
    case TWITTER = 'twitter';
    case YOUTUBE = 'youtube';
    case WHATSAPP = 'whatsapp';

    public function label(): string
    {
        return match($this) {
            self::INSTAGRAM => 'Instagram',
            self::FACEBOOK => 'Facebook',
            self::TIKTOK => 'TikTok',
            self::TWITTER => 'Twitter (X)',
            self::YOUTUBE => 'YouTube',
            self::WHATSAPP => 'WhatsApp',
        };
    }
}