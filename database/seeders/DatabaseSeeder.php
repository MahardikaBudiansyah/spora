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
use Database\Seeders\FacilitySeeder;
use Database\Seeders\MerchantSeeder;
use Database\Seeders\TimeSlotSeeder;
use Database\Seeders\FieldTypeSeeder;
use Database\Seeders\StaffRoleSeeder;
use Database\Seeders\FieldImageSeeder;
use Database\Seeders\VenueImageSeeder;
use Database\Seeders\MerchantOwnerSeeder;
use Database\Seeders\MerchantProfileSeeder;
use Database\Seeders\SlotStatusLabelSeeder;
use Database\Seeders\MembershipDurationSeeder;
use Database\Seeders\SubscriptionPackageSeeder;
use Database\Seeders\SubscriptionDurationSeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(AdminSeeder::class);
        $this->call(UserSeeder::class);
        $this->call(MerchantSeeder::class);
        $this->call(MerchantProfileSeeder::class);
        $this->call(MerchantOwnerSeeder::class);
        $this->call(StaffRoleSeeder::class);
        // $this->call(StaffSeeder::class);
        $this->call(FacilitySeeder::class);
        $this->call(VenueSeeder::class);
        $this->call(VenueImageSeeder::class);
        $this->call(AddressSeeder::class);
        $this->call(TimeSlotSeeder::class);
        $this->call(FieldTypeSeeder::class);
        $this->call(FieldSeeder::class);
        $this->call(FieldImageSeeder::class);
        $this->call(SubscriptionDurationSeeder::class);
        $this->call(SubscriptionPackageSeeder::class);
        $this->call(MembershipDurationSeeder::class);
        $this->call(SlotStatusLabelSeeder::class);

    }
}
