<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MembershipPackage;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class MembershipPackageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                'venue_id' => 1,
                'name' => 'Bronze Package',
                'description' => 'Paket membership dasar untuk pengguna baru',
                'price' => 100000,
                'duration_months' => 1,
                'slug' => 'bronze-package',
            ],
            [
                'venue_id' => 1,
                'name' => 'Silver Package',
                'description' => 'Paket membership menengah dengan beberapa benefit tambahan',
                'price' => 250000,
                'duration_months' => 2,
                'slug' => 'silver-package',
            ],
            [
                'venue_id' => 2,
                'name' => 'Gold Package',
                'description' => 'Paket premium dengan benefit lengkap',
                'price' => 500000,
                'duration_months' => 3,
                'slug' => 'gold-package',
            ],
        ];

        foreach ($data as $item) {
            MembershipPackage::create($item);
        }
    
    }
}
