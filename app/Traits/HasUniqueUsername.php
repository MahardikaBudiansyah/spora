<?php

namespace App\Traits;

use Illuminate\Support\Str;

trait HasUniqueUsername
{
    public static function generateUniqueUsername(string $name, ?int $excludeId = null): string
    {
        $baseUsername = Str::slug($name, '_');
        $username = $baseUsername;
        $count = 1;

        while (self::withTrashed()
            ->where('username', $username)
            ->when($excludeId, fn($query) => $query->where('id', '!=', $excludeId))
            ->exists()) {
            $username = $baseUsername . '_' . $count;
            $count++;
        }

        return $username;
    }

    protected static function bootHasUniqueUsername()
    {
        static::creating(function ($model) {
            if (empty($model->username) && !empty($model->name)) {
                $model->username = self::generateUniqueUsername($model->name);
            }
        });
    }
}
