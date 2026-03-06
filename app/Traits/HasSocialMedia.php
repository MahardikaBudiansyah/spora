<?php

namespace App\Traits;

use App\Models\SocialMedia;
use Illuminate\Database\Eloquent\Relations\MorphMany;

trait HasSocialMedia
{
    public function socialMedia(): MorphMany
    {
        return $this->morphMany(SocialMedia::class, 'socialable');
    }

    public function getSocialMedia(string $platform)
    {
        return $this->socialMedia()->where('platform', $platform)->first();
    }
}