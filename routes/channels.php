<?php

use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('venue.{venueId}', function ($user, $venueId) {
    // logika auth, misal user adalah partner venue
    return $user->id === Venue::find($venueId)?->merchant_id;
});

Broadcast::channel('court.{courtId}', function ($user, $courtId) {
    return $user->id === Court::find($courtId)?->venue->merchant_id;
});