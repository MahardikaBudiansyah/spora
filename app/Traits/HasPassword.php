<?php

namespace App\Traits;

use Illuminate\Support\Facades\Hash;

trait HasPassword
{
     protected static function bootHasPassword()
    {
        static::saving(function ($model) {
            if ($model->isDirty('password')) {
                $plainOrHashed = $model->password;

                // hanya hash ulang kalau memang perlu
                if (Hash::needsRehash($plainOrHashed)) {
                    $model->password = Hash::make($plainOrHashed);
                }
            }
        });
    }
}
