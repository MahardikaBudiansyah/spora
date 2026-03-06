<?php

namespace Database\Seeders;

use Carbon\Carbon;
use App\Models\CourtSurface;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class CourtSurfaceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [   'name' => 'Vinyl'],
            [   'name' => 'Rumput Sintetis'],
            [   'name' => 'Semen/Beton'],
            [   'name' => 'Parquette'],
            [   'name' => 'Taraflex'],
            [   'name' => 'Karpet Plastik'],
            
        ];

        foreach ($data as $value) {
            CourtSurface::create($value);
        }
    }
}
