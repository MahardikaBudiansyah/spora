<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PlatformPayoutMethod;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class PlatformPayoutMethodSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                'platform_profile_id' => 1,
                'type' => 'bank',
                'provider_name' => 'Bank Mandiri',
                'account_number' => "25385393036474",
                'account_holder_name' => 'Mahardika Budiansyah',
                'is_primary' => true,
            ],
        ];

        foreach ($data as $value) {
            PlatformPayoutMethod::create($value);
        }
    }
}
