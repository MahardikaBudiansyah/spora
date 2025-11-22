<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Database\Seeders\UserSeeder;
use Database\Seeders\AdminSeeder;
use Database\Seeders\FieldSeeder;
use Database\Seeders\StaffSeeder;
use Database\Seeders\VenueSeeder;
use Database\Seeders\AddressSeeder;
use Database\Seeders\CategorySeeder;
use Database\Seeders\FacilitySeeder;
use Database\Seeders\MerchantSeeder;
use Database\Seeders\TimeSlotSeeder;
use Database\Seeders\FieldTypeSeeder;
use Database\Seeders\StaffRoleSeeder;
use Database\Seeders\FieldImageSeeder;
use Database\Seeders\VenueImageSeeder;
use Database\Seeders\FieldTimeSlotSeeder;
use Database\Seeders\MerchantOwnerSeeder;
use Database\Seeders\MerchantProfileSeeder;
use Database\Seeders\SlotStatusLabelSeeder;
use Database\Seeders\MembershipPackageSeeder;
use Database\Seeders\MerchantStaffRoleSeeder;
use Database\Seeders\SubscriptionPackageSeeder;
use Database\Seeders\MembershipBenefitOtherSeeder;
use Database\Seeders\MembershipBenefitDiscountSeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            // User & Admin
            AdminSeeder::class,
            UserSeeder::class,

            // Merchant & Staff
            MerchantSeeder::class,
            MerchantProfileSeeder::class,
            MerchantOwnerSeeder::class,
            StaffRoleSeeder::class,          
            MerchantStaffRoleSeeder::class,  
            StaffSeeder::class,       

            // Venue & Related
            VenueSeeder::class,
            VenueImageSeeder::class,
            AddressSeeder::class,
            FacilitySeeder::class,
            CategorySeeder::class,

            // Fields & Slots
            FieldTypeSeeder::class,
            FieldSeeder::class,
            FieldImageSeeder::class,
            TimeSlotSeeder::class,
            FieldTimeSlotSeeder::class,
            SlotStatusLabelSeeder::class,

            // Subscription
            SubscriptionPackageSeeder::class,

            // Membership
            MembershipPackageSeeder::class,
            MembershipBenefitDiscountSeeder::class,
            MembershipBenefitOtherSeeder::class,
            // MembershipSeeder::class,
        ]);


    }
}
