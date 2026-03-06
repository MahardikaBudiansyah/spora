<?php

namespace Database\Seeders;

use App\Enums\AdminStatus;
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
            [
                'name' => 'Spora Official',
                'role' => 'superadmin',
                'email' => 'spora.official@gmail.com',
                'password' => Hash::make('spora1234'),
                'status' => AdminStatus::ACTIVE,
                'is_active' => true,
            ],
            [
                'name' => 'Admin',
                'role' => 'admin',
                'email' => 'admin@gmail.com',
                'password' => Hash::make('admin1234'),
                'status' => AdminStatus::ACTIVE,
                'is_active' => true,
            ],

        ];

        foreach ($data as $value) {
            Admin::create($value);
        }
    }
}
