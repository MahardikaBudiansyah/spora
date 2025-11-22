<?php

namespace Database\Seeders;

use Carbon\Carbon;
use App\Models\Admin;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [   'name' => 'Superadmin',
                'username' => 'superadmin',
                'role' => 'superadmin',
                'email' => 'superadmin@gmail.com',
                'email_verified_at' => now(),
                'password' => Hash::make('superadmin1234'),
                'phone_number' => null,
                'status' => true,
            ],
            [   'name' => 'Admin',
                'username' => 'admin',
                'role' => 'admin',
                'email' => 'admin@gmail.com',
                'email_verified_at' => now(),
                'password' => Hash::make('admin1234'),
                'phone_number' => null,
                'status' => true,
            ],
            
        ];

        foreach ($data as $value) {
            Admin::create($value);
        }
    }
}
