<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use App\Models\MembershipDuration;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class MembershipDurationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            ['name' => '1 Bulan', 'months' => 1],
            ['name' => '3 Bulan', 'months' => 3],
        ];

        foreach ($data as $value) {
            MembershipDuration::create($value);
        }
    }
}
