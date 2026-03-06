<?php

namespace App\Models;

use App\Enums\SocialPlatform;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SocialMedia extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'social_media';

    protected $fillable = [
        'socialable_id',
        'socialable_type',
        'platform',
        'username',
        'url',
    ];

    protected $casts = [
        'platform' => SocialPlatform::class,
    ];

    public function socialable()
    {
        return $this->morphTo();
    }
}