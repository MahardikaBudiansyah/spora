<?php

namespace Database\Seeders;

use Carbon\Carbon;
use App\Models\Court;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class CourtSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [   'name' => 'Lapangan 1',
                'court_surface_id' => 1,
                'description' => 'Lapangan  dengan ukuran internasional',
                'slug' => 'lapangan-1',
                'venue_id' => 1,
            ],
            [   'name' => 'Lapangan 2',
                'court_surface_id' => 2,
                'description' => 'Lapangan dengan ukuran internasional',
                'slug' => 'lapangan-2',
                'venue_id' => 1,
            ],
            [   'name' => 'Lapangan 3',
                'court_surface_id' => 1,
                'description' => 'Lapangan dengan ukuran internasional',
                'slug' => 'lapangan-3',
                'venue_id' => 1,
            ],
            [   'name' => 'Lapangan 1',
                'court_surface_id' => 6,
                'description' => 'Lapangan dengan ukuran internasional',
                'slug' => 'lapangan-1',
                'venue_id' => 2,
            ],
            [   'name' => 'Lapangan 2',
                'court_surface_id' => 6,
                'description' => 'Lapangan dengan ukuran internasional',
                'slug' => 'lapangan-2',
                'venue_id' => 2,
            ],
            [   'name' => 'Lapangan 3',
                'court_surface_id' => 6,
                'description' => 'Lapangan dengan ukuran internasional',
                'slug' => 'lapangan-3',
                'venue_id' => 2,
            ],

            [   'name' => 'Lapangan 1',
                'court_surface_id' => 6,
                'description' => 'Lapangan dengan ukuran internasional',
                'slug' => 'lapangan-1',
                'venue_id' => 4,
            ],
            [   'name' => 'Lapangan 2',
                'court_surface_id' => 6,
                'description' => 'Lapangan dengan ukuran internasional',
                'slug' => 'lapangan-2',
                'venue_id' => 4,
            ],
            [   'name' => 'Lapangan 3',
                'court_surface_id' => 6,
                'description' => 'Lapangan dengan ukuran internasional',
                'slug' => 'lapangan-3',
                'venue_id' => 4,
            ],
            [   'name' => 'Lapangan 4',
                'court_surface_id' => 6,
                'description' => 'Lapangan dengan ukuran internasional',
                'slug' => 'lapangan-4',
                'venue_id' => 4,
            ],
            [   'name' => 'Lapangan 5',
                'court_surface_id' => 6,
                'description' => 'Lapangan dengan ukuran internasional',
                'slug' => 'lapangan-5',
                'venue_id' => 4,
            ],

        ];

        foreach ($data as $value) {
            Court::create($value);
        }
    }
}
