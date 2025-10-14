<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use App\Models\MembershipBenefitDiscount;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class MembershipBenefitDiscountSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                'membership_package_id' => 1,
                'name' => 'Diskon 10% Sewa Lapangan',
                'description' => 'Member mendapat diskon 10% setiap kali booking lapangan',
                'discount_type' => 'percentage',
                'discount_value' => 10,
                'discount_limit' => 5,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'membership_package_id' => 2,
                'name' => 'Diskon 20% Sewa Lapangan',
                'description' => 'Member mendapat diskon 20% untuk booking lapangan',
                'discount_type' => 'percentage',
                'discount_value' => 20,
                'discount_limit' => 10,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ];

        foreach ($data as $item) {
            MembershipBenefitDiscount::create($item);
        }
    }
}
