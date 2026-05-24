<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Database\Seeders\AddressSeeder;
use Database\Seeders\AdminProfileSeeder;
use Database\Seeders\AdminSeeder;
use Database\Seeders\CourtCategorySeeder;
use Database\Seeders\CourtImageSeeder;
use Database\Seeders\CourtSeeder;
use Database\Seeders\CourtStatusTypeSeeder;
use Database\Seeders\CourtSurfaceSeeder;
use Database\Seeders\CourtTimeSlotSeeder;
use Database\Seeders\MembershipBenefitDiscountSeeder;
use Database\Seeders\MembershipBenefitOtherSeeder;
use Database\Seeders\MembershipPackageSeeder;
use Database\Seeders\MerchantOwnerSeeder;
use Database\Seeders\MerchantOwnerSubmissionSeeder;
use Database\Seeders\MerchantPayoutMethodSeeder;
use Database\Seeders\MerchantPayoutMethodSubmissionSeeder;
use Database\Seeders\MerchantProfileSeeder;
use Database\Seeders\MerchantProfileSubmissionSeeder;
use Database\Seeders\MerchantSeeder;
use Database\Seeders\MerchantStaffRoleSeeder;
use Database\Seeders\PlatformPayoutMethodSeeder;
use Database\Seeders\PlatformProfileSeeder;
use Database\Seeders\SocialMediaSeeder;
use Database\Seeders\StaffRoleSeeder;
use Database\Seeders\StaffSeeder;
use Database\Seeders\SubscriptionPackageSeeder;
use Database\Seeders\TimeSlotSeeder;
use Database\Seeders\UserSeeder;
use Database\Seeders\VenueCategorySeeder;
use Database\Seeders\VenueFacilitySeeder;
use Database\Seeders\VenueImageSeeder;
use Database\Seeders\VenueSeeder;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            AdminSeeder::class,
            // AdminProfileSeeder::class,
            // PlatformProfileSeeder::class,
            // PlatformPayoutMethodSeeder::class,
            // UserSeeder::class,

            // MerchantSeeder::class,
            // MerchantOwnerSubmissionSeeder::class,
            // MerchantProfileSubmissionSeeder::class,
            // MerchantPayoutMethodSubmissionSeeder::class,

            // MerchantOwnerSeeder::class,
            // MerchantProfileSeeder::class,
            // MerchantPayoutMethodSeeder::class,


            StaffRoleSeeder::class,
            // MerchantStaffRoleSeeder::class,
            // StaffSeeder::class,

            // VenueSeeder::class,
            // VenueImageSeeder::class,
            // AddressSeeder::class,
            VenueFacilitySeeder::class,
            VenueCategorySeeder::class,
            // SocialMediaSeeder::class,

            CourtSurfaceSeeder::class,
            // CourtSeeder::class,
            CourtCategorySeeder::class,
            // CourtImageSeeder::class,
            TimeSlotSeeder::class,
            // CourtTimeSlotSeeder::class,
            CourtStatusTypeSeeder::class,

            // SubscriptionPackageSeeder::class,

            // MembershipPackageSeeder::class,
            // MembershipBenefitDiscountSeeder::class,
            // MembershipBenefitOtherSeeder::class,
        ]);
    }
}
