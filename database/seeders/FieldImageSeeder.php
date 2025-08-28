<?php

namespace Database\Seeders;

use App\Models\FieldImage;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class FieldImageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [   'field_id' => 1,
                'image_path' => 'uploads/fields/1/lapangan-1.jpg',
                'is_featured' => true,
                'order' => 1,
            ],
            [   'field_id' => 1,
                'image_path' => 'uploads/fields/1/lapangan-2.jpg',
                'is_featured' => false,
                'order' => 2,
            ],
            [   'field_id' => 1,
                'image_path' => 'uploads/fields/1/lapangan-3.jpg',
                'is_featured' => false,
                'order' => 3,
            ],
            [   'field_id' => 1,
                'image_path' => 'uploads/fields/1/lapangan-4.jpg',
                'is_featured' => false,
                'order' => 4,
            ],
            [   'field_id' => 1,
                'image_path' => 'uploads/fields/1/lapangan-5.jpg',
                'is_featured' => false,
                'order' => 5,
            ],
            [   'field_id' => 2,
                'image_path' => 'uploads/fields/2/lapangan-1.jpg',
                'is_featured' => false,
                'order' => 1,
            ],
            [   'field_id' => 2,
                'image_path' => 'uploads/fields/2/lapangan-2.jpg',
                'is_featured' => true,
                'order' => 2,
            ],
            [   'field_id' => 2,
                'image_path' => 'uploads/fields/2/lapangan-3.jpg',
                'is_featured' => false,
                'order' => 3,
            ],
            [   'field_id' => 2,
                'image_path' => 'uploads/fields/2/lapangan-4.jpg',
                'is_featured' => false,
                'order' => 4,
            ],
            [   'field_id' => 4,
                'image_path' => 'uploads/fields/2/lapangan-5.jpg',
                'is_featured' => false,
                'order' => 5,
            ],

        ];

        foreach ($data as $value) {
            FieldImage::create($value);
        }
    }
    
}
