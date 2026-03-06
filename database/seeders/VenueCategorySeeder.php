<?php

namespace Database\Seeders;

use App\Models\VenueCategory;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class VenueCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            ['name' => 'Indoor', 'label' => 'Dalam Ruangan'],
            ['name' => 'Outdoor', 'label' => 'Luar Ruangan'],
            ['name' => 'Semi Indoor', 'label' => 'Dalam dan Luar Ruangan'],
            ['name' => 'Premium', 'label' => 'Premium'],
            ['name' => 'Standard', 'label' => 'Standar'],
            ['name' => 'Economy', 'label' => 'Ekonomis'],
        ];

        foreach ($data as $value) {
            VenueCategory::updateOrCreate(
                ['name' => $value['name']], 
                ['label' => $value['label']]
            );
        }
    }
}
