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
            ['name' => 'Basic', 'price' => 100000],
            ['name' => 'Pro', 'price' => 125000],
            ['name' => 'Premium', 'price' => 150000],
        ];

        foreach ($data as $value) {
            SubscriptionPackage::create($value);
        }
    }
}
