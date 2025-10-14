<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MembershipBenefitOther;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class MembershipBenefitOtherSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                'membership_package_id' => 1,
                'name' => 'Free Mineral Water',
                'description' => 'Setiap booking mendapat 1 botol air mineral gratis',
            ],
            [
                'membership_package_id' => 2,
                'name' => 'Free Jersey',
                'description' => 'Member mendapatkan jersey gratis saat pertama kali daftar',
            ],
            [
                'membership_package_id' => 3,
                'name' => 'Prioritas Booking',
                'description' => 'Member bisa booking lebih awal 7 hari dibanding non-member',
            ],
        ];

        foreach ($data as $item) {
            MembershipBenefitOther::create($item);
        }
    }
}
