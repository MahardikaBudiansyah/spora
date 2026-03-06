<?php

namespace App\Providers;

use App\Models\Admin;
use App\Models\Merchant;
use App\Models\Court;
use App\Models\Venue;
use App\Models\Booking;
use App\Models\AdminProfile;
use App\Policies\AdminPolicy;
use App\Policies\CourtPolicy;
use App\Policies\VenuePolicy;
use App\Models\MembershipCard;
use App\Models\PlatformProfile;
use App\Policies\BookingPolicy;
use App\Policies\MerchantPolicy;
use App\Models\MembershipPackage;
use App\Models\VenuePaymentPolicy;
use App\Models\PlatformPayoutMethod;
use App\Policies\AdminProfilePolicy;
use Illuminate\Support\Facades\Gate;
use App\Policies\MembershipCardPolicy;
use App\Policies\PlatformProfilePolicy;
use App\Policies\MembershipPackagePolicy;
use App\Policies\VenuePaymentPolicyPolicy;
use App\Policies\PlatformPayoutMethodPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        Admin::class => AdminPolicy::class,
        AdminProfile::class => AdminProfilePolicy::class,
        PlatformProfile::class => PlatformProfilePolicy::class,
        PlatformPayoutMethod::class => PlatformPayoutMethodPolicy::class,
        Merchant::class => MerchantPolicy::class,
        Venue::class => VenuePolicy::class,
        Court::class => CourtPolicy::class,
        MembershipCard::class => MembershipCardPolicy::class,
        MembershipPackage::class => MembershipPackagePolicy::class,
        Booking::class => BookingPolicy::class,
        VenuePaymentPolicy::class => VenuePaymentPolicyPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();

        Gate::before(function ($user, $ability, $arguments) {
            if ($user instanceof Admin && in_array($ability, ['view', 'viewAny'])) {
                return true;
            }
        });
    }
}
