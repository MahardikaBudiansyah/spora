<?php

namespace App\Observers;

use App\Models\User;

class UserObserver
{
    public function saving(User $user)
    {
        $user->syncStatus();
    }

    public function saved(User $user): void
    {
        if ($user->wasChanged('status') || $user->wasRecentlyCreated) {

            $user->recordStatusHistory();
        }
    }
}
