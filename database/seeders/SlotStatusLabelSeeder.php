<?php

namespace Database\Seeders;

use Carbon\Carbon;
use App\Models\SlotStatusLabel;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class SlotStatusLabelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [   'name' => 'Available', 'label' => 'Tersedia'],
            [   'name' => 'Maintance', 'label' => 'Pemeliharaan'],
            [   'name' => 'Event', 'label' => 'Event'],
            [   'name' => 'Booked', 'label' => 'Dipesan'],
        ];

        foreach ($data as $value) {
            SlotStatusLabel::create($value);
        }
    }
}
