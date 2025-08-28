<?php

namespace Database\Seeders;

use Carbon\Carbon;
use App\Models\Staff;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class StaffSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                'merchant_id' => 1,
                'merchant_staff_role_id' => 1,
                'name' => 'Mahardika Budiansyah',
                'username' => 'mahardika budiansyah',
                'phone_number' => '089629792894',
                'email' => 'mahardikabudiansyah@gmail.com',
                'password' => Hash::make('dika1234'),
                'status' => 'active',
                'slug' => 'mahardika-budiansyah',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],

            [
                'merchant_id' => 1,
                'merchant_staff_role_id' => 1,
                'name' => 'Bima Sakti',
                'username' => 'Bima Aja',
                'phone_number' => '089629792894',
                'email' => 'bimasakti@gmail.com',
                'password' => Hash::make('bima1234'),
                'status' => 'active',
                'slug' => 'bima-aja',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ];

        foreach ($data as $value) {
            Staff::create($value);
        };
    }
}
