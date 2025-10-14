<?php

namespace Database\Seeders;

use Carbon\Carbon;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
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
                'password' => Hash::make('user1234'), 
                'status' => 'pending',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [   'name' => 'Mahardika Budiansyah',
                'username' => 'mahardika_budiansyah',
                'email' => 'mahardikabudiansyah@gmail.com',
                'email_verified_at' => now(),
                'password' => Hash::make('dika1234'), 
                'status' => 'pending',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
        ];

        foreach ($data as $value) {
            User::create($value);
        }
    }
}
