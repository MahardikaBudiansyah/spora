<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use App\Models\SubscriptionPackage;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class SubscriptionPackageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                'name' => 'Basic', 
                'duration_months' => 1, 
                'price' => 100000,
                'slug' => "basic",
            ],
            [
                'name' => 'Pro',
                'duration_months' => 3, 
                'price' => 125000,
                'slug' => "pro",
            ],
            [
                'name' => 'Premium',
                'duration_months' => 6, 
                'price' => 150000,
                'slug' => "premium",
            ],
        ];

        foreach ($data as $value) {
            SubscriptionPackage::create($value);
        }
    }
}
