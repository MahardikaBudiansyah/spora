<?php

namespace Database\Seeders;

use Carbon\Carbon;
use App\Models\Merchant;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class MerchantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [   'name' => 'Jakal Futsal Group',
                'username' => 'jakal futsal group',
                'email' => 'jakalfutsal@gmail.com',
                'email_verified_at' => now(),
                'password' => Hash::make('jakal1234'),
                'phone_number' => '089629792894',
                'status' => 'active',
                'slug' => 'jakal-futsal-group',
            ],
            [   'name' => 'Telaga Futsal Group',
                'username' => 'telaga futsal group',
                'email' => 'jakalseven@gmail.com',
                'email_verified_at' => now(),
                'password' => Hash::make('telaga1234'),
                'phone_number' => '081310578168',
                'status' => 'active',
                'slug' => 'telaga-futsal-group',
            ],
            
        ];

        foreach ($data as $value) {
            Merchant::create($value);
        }
    }
}
