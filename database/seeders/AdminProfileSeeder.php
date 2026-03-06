<?php

namespace Database\Seeders;

use App\Enums\Gender;
use App\Models\AdminProfile;
use Illuminate\Database\Seeder;
use App\Helpers\NumberPhoneHelper;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class AdminProfileSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                'admin_id' => 1,
                'nik' => '1234567890123456',
                'full_name' => 'Mahardika Budiansyah',
                'phone_number' => '089629792894',
                'date_of_birth' => '1997-08-21',
                'gender' => Gender::MALE,
            ],

        ];

        foreach ($data as $value) {
            $value['phone_number'] = NumberPhoneHelper::normalize($value['phone_number']);

            AdminProfile::create($value);
        }
    }
}
