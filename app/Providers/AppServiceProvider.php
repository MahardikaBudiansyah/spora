<?php

namespace App\Providers;

use App\Enums\MorphType;
use App\Enums\OrderType;
use App\Models\Admin;
use App\Models\AdminProfile;
use App\Models\Booking;
use App\Models\MembershipOrder;
use App\Models\Merchant;
use App\Models\MerchantOwner;
use App\Models\MerchantOwnerSubmission;
use App\Models\MerchantPayoutMethod;
use App\Models\MerchantPayoutMethodSubmission;
use App\Models\MerchantProfile;
use App\Models\MerchantProfileSubmission;
use App\Models\PlatformProfile;
use App\Models\Staff;
use App\Models\User;
use App\Models\Venue;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Relation::morphMap([
            OrderType::BOOKING->value => Booking::class,
            OrderType::MEMBERSHIP->value => MembershipOrder::class,

            MorphType::ADMIN->value => Admin::class,
            MorphType::ADMIN_PROFILE->value => AdminProfile::class,
            MorphType::PLATFORM_PROFILE->value => PlatformProfile::class,
            MorphType::USER->value => User::class,
            MorphType::MERCHANT->value => Merchant::class,

            MorphType::MERCHANT_PROFILE_SUBMISSION->value => MerchantProfileSubmission::class,
            MorphType::MERCHANT_PAYOUT_METHOD_SUBMISSION->value => MerchantPayoutMethodSubmission::class,
            MorphType::MERCHANT_OWNER_SUBMISSION->value => MerchantOwnerSubmission::class,

            MorphType::MERCHANT_PROFILE->value => MerchantProfile::class,
            MorphType::MERCHANT_PAYOUT_METHOD->value => MerchantPayoutMethod::class,
            MorphType::MERCHANT_OWNER->value => MerchantOwner::class,

            MorphType::VENUE->value => Venue::class,
            MorphType::STAFF->value => Staff::class,
        ]);
    }
}
