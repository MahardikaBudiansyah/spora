<?php

namespace Database\Seeders;

use App\Models\Merchant;
use Illuminate\Database\Seeder;
use App\Helpers\NumberPhoneHelper;
use Illuminate\Support\Facades\Hash;

class MerchantSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            [
                'name' => 'Jakal Futsal Group',
                'email' => 'jakalfutsal@gmail.com',
                'email_verified_at' => now(),
                'password' => Hash::make('jakal1234'),
                'phone_number' => '089629792894',
                'phone_verified_at' => now(),
                'slug' => 'jakal-futsal-group',
            ],
            [
                'name' => 'Telaga Futsal Group',
                'email' => 'telaga@gmail.com',
                'email_verified_at' => now(),
                'password' => Hash::make('telaga1234'),
                'phone_number' => '081310578168',
                'phone_verified_at' => now(),
                'slug' => 'telaga-futsal-group',
            ],
        ];

        foreach ($data as $value) {
            $value['phone_number'] = NumberPhoneHelper::normalize($value['phone_number']);

            Merchant::create($value);
        }
    }
}
