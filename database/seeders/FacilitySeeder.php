<?php

namespace Database\Seeders;

use Carbon\Carbon;
use App\Models\Facility;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class FacilitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            ['name' => 'Parkir Mobil',         'icon' => 'car.png'],
            ['name' => 'Parkir Motor',         'icon' => 'motorcycle-parking-only.png'],
            ['name' => 'Kafe dan Restaurant',  'icon' => 'cafes-and-restaurants.png'],
            ['name' => 'Makanan Ringan',       'icon' => 'snack.png'],
            ['name' => 'Minuman Ringan',       'icon' => 'soft-drink.png'],
            ['name' => 'Kamar Ganti',          'icon' => 'dressing-room.png'],
            ['name' => 'Musholla',             'icon' => 'islamic-prayer-room.png'],
            ['name' => 'Ruangan Tunggu AC',    'icon' => 'ac-waiting-room.png'],
            ['name' => 'Shower',               'icon' => 'shower.png'],
            ['name' => 'Hot Shower',           'icon' => 'hot-shower.png'],
            ['name' => 'Toilet',               'icon' => 'toilet-2.png'],
            ['name' => 'Papan Score',          'icon' => 'score-board.png'],
            ['name' => 'Toko Bola',            'icon' => 'football-shop.png'],
            ['name' => 'Tribun Penonton',      'icon' => 'spectator-stands.png'],
            ['name' => 'Wifi',                 'icon' => 'wifi.png'],
        ];

        foreach ($data as $value) {
            Facility::create($value);
        }
    }
}
