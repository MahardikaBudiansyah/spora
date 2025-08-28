<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use App\Models\SubscriptionDuration;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class SubscriptionDurationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            ['duration' => '1 Bulan', 'months' => 1],
            ['duration' => '3 Bulan', 'months' => 3],
            ['duration' => '1 Tahun', 'months' => 12],
        ];

        foreach ($data as $value) {
            SubscriptionDuration::create($value);
        }
    }
}
