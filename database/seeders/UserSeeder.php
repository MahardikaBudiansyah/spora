<?php

namespace Database\Seeders;

use Carbon\Carbon;
use App\Models\User;
use Illuminate\Database\Seeder;
use App\Helpers\NumberPhoneHelper;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                'name' => 'User',
                'username' => 'user',
                'email' => 'user@gmail.com',
                'email_verified_at' => Carbon::now(),
                'password' => Hash::make('user1234'),
                'phone_number' => '081310578169',
                'phone_verified_at' => Carbon::now(),
            ],
            [
                'name' => 'Mahardika Budiansyah',
                'username' => 'mahardika_budiansyah',
                'email' => 'mahardikabudiansyah@gmail.com',
                'email_verified_at' => Carbon::now(),
                'password' => Hash::make('dika1234'),
                'phone_number' => '089629792894',
                'phone_verified_at' => Carbon::now(),
            ],
        ];

        foreach ($data as $value) {
            $value['phone_number'] = NumberPhoneHelper::normalize($value['phone_number']);

            User::create($value);
        }
    }
}
