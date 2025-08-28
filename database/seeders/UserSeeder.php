<?php

namespace Database\Seeders;

use Carbon\Carbon;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [   'name' => 'User',
                'username' => 'user',
                'email' => 'user@gmail.com',
                'email_verified_at' => now(),
                'password' => '$2y$10$$2y$10$z.bsVJ7kkLSav8rmOECRPeo6XnQZ3hL/QIYLpXcXSnITIu8DMLGbG.zis.wgoTxhL.xg2LAbRZa',
                'status' => 'pending',
                'slug' => 'user',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            
        ];

         foreach ($data as $value) {
            User::create($value);
        }
    }
}
