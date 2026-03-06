<?php

namespace App\Providers;

use App\Models\Merchant;
use App\Models\MerchantOwner;
use App\Models\MerchantOwnerSubmission;
use App\Models\MerchantPayoutMethod;
use App\Models\MerchantPayoutMethodSubmission;
use App\Models\MerchantProfile;
use App\Models\MerchantProfileSubmission;
use App\Models\Notification;
use App\Models\User;
use App\Models\Venue;
use App\Observers\MerchantObserver;
use App\Observers\NotificationObserver;
use App\Observers\UserObserver;
use App\Observers\VenueObserver;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event to listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        Registered::class => [
            SendEmailVerificationNotification::class,
        ],
    ];

    /**
     * Register any events for your application.
     */
    public function boot(): void
    {
        User::observe(UserObserver::class);
        Merchant::observe(MerchantObserver::class);

        MerchantOwnerSubmission::observe(MerchantObserver::class);
        MerchantProfileSubmission::observe(MerchantObserver::class);
        MerchantPayoutMethodSubmission::observe(MerchantObserver::class);

        MerchantProfile::observe(MerchantObserver::class);
        MerchantOwner::observe(MerchantObserver::class);
        MerchantPayoutMethod::observe(MerchantObserver::class);
        Venue::observe(VenueObserver::class);

        Notification::observe(NotificationObserver::class);
    }

    /**
     * Determine if events and listeners should be automatically discovered.
     */
    public function shouldDiscoverEvents(): bool
    {
        return false;
    }
}
