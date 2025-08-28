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
        $data = [
            [   'name' => '00:00 - 01:00'],
            [   'name' => '01:00 - 02:00'],
            [   'name' => '02:00 - 03:00'],
            [   'name' => '03:00 - 04:00'],
            [   'name' => '04:00 - 05:00'],
            [   'name' => '05:00 - 06:00'],
            [   'name' => '06:00 - 07:00'],
            [   'name' => '07:00 - 08:00'],
            [   'name' => '08:00 - 09:00'],
            [   'name' => '09:00 - 10:00'],
            [   'name' => '10:00 - 11:00'],
            [   'name' => '11:00 - 12:00'],
            [   'name' => '12:00 - 13:00'],
            [   'name' => '13:00 - 14:00'],
            [   'name' => '14:00 - 15:00'],
            [   'name' => '15:00 - 16:00'],
            [   'name' => '16:00 - 17:00'],
            [   'name' => '17:00 - 18:00'],
            [   'name' => '18:00 - 19:00'],
            [   'name' => '19:00 - 20:00'],
            [   'name' => '20:00 - 21:00'],
            [   'name' => '21:00 - 22:00'],
            [   'name' => '22:00 - 23:00'],
            [   'name' => '23:00 - 00:00'],
        ];

        foreach ($data as $value) {
            TimeSlot::create($value);
        }
    }
}
