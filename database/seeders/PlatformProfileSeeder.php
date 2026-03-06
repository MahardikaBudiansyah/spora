<?php

namespace Database\Seeders;

use App\Models\PlatformProfile;
use Illuminate\Database\Seeder;
use App\Helpers\NumberPhoneHelper;

class PlatformProfileSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                'admin_id' => 1,
                'business_name' => 'Spora Sports',
                'business_email' => 'spora.sports@gmail.com',
                'business_phone_number' => '081310578168',
            ],

        ];

        foreach ($data as $value) {
            $value['business_phone_number'] = NumberPhoneHelper::normalize($value['business_phone_number']);

            PlatformProfile::create($value);
        }
    }
}
