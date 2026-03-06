<?php

namespace Database\Seeders;

use Carbon\Carbon;
use App\Models\TimeSlot;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class TimeSlotSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $slots = [];
        for ($i = 0; $i < 24; $i++) {
            $start = sprintf('%02d:00', $i);
            $end   = sprintf('%02d:00', ($i + 1) % 24);

            $slots[] = [
                'start_time' => $start,
                'end_time'   => $end,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        TimeSlot::insert($slots);
    }
}
