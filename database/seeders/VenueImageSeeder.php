<?php

namespace Database\Seeders;

use App\Models\VenueImage;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class VenueImageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [   'venue_id' => 1,
                'image_path' => 'uploads/venues/1/lapangan-1.jpg',
                'is_featured' => true,
                'order' => 1,
            ],
            [   'venue_id' => 1,
                'image_path' => 'uploads/venues/1/lapangan-2.jpg',
                'is_featured' => false,
                'order' => 2,
            ],
            [   'venue_id' => 1,
                'image_path' => 'uploads/venues/1/lapangan-3.jpg',
                'is_featured' => false,
                'order' => 3,
            ],
            [   'venue_id' => 1,
                'image_path' => 'uploads/venues/1/lapangan-4.jpg',
                'is_featured' => false,
                'order' => 4,
            ],
            [   'venue_id' => 1,
                'image_path' => 'uploads/venues/1/lapangan-5.jpg',
                'is_featured' => false,
                'order' => 5,
            ],
            [   'venue_id' => 2,
                'image_path' => 'uploads/venues/2/lapangan-1.jpg',
                'is_featured' => false,
                'order' => 1,
            ],
            [   'venue_id' => 2,
                'image_path' => 'uploads/venues/2/lapangan-2.jpg',
                'is_featured' => true,
                'order' => 2,
            ],
            [   'venue_id' => 2,
                'image_path' => 'uploads/venues/2/lapangan-3.jpg',
                'is_featured' => false,
                'order' => 3,
            ],
            [   'venue_id' => 2,
                'image_path' => 'uploads/venues/2/lapangan-4.jpg',
                'is_featured' => false,
                'order' => 4,
            ],
            [   'venue_id' => 4,
                'image_path' => 'uploads/venues/2/lapangan-5.jpg',
                'is_featured' => false,
                'order' => 5,
            ],

        ];

        foreach ($data as $value) {
            VenueImage::create($value);
        }
    }
}
