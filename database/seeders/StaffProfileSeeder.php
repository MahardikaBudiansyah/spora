<?php

namespace Database\Seeders;

use Carbon\Carbon;
use App\Models\StaffProfile;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class StaffProfileSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                'staff_id' => 1,
                'NIK' => '123456789',
                'phone_number' => '089629792894',
                'address' => 'Kamal RT 02 RW 04, Pagersari, Mungkid, Kab. Magelang',
                'avatar' => null,
                'date_of_birth' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],

            [
                'staff_id' => 2,
                'NIK' => null,
                'phone_number' => null,
                'address' => null,
                'avatar' => null,
                'date_of_birth' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ];

        foreach ($data as $value) {
            StaffProfile::create($value);
        };
    }
}
