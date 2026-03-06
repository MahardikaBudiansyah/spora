<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MerchantPayoutMethod;
use App\Enums\MerchantPayoutMethodStatus;

class MerchantPayoutMethodSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                'merchant_id' => 1,
                'type' => 'bank',
                'provider_name' => 'Bank Mandiri',
                'account_number' => "25385393036474",
                'account_holder_name' => 'Mahardika Budiansyah',
                'status' => MerchantPayoutMethodStatus::DRAFT,
                'is_primary' => true,
            ],
            [
                'merchant_id' => 2,
                'type' => 'bank',
                'provider_name' => 'Bank Mandiri',
                'account_number' => "25385393036471",
                'account_holder_name' => 'Mahardiky Budiansyah',
                'status' => MerchantPayoutMethodStatus::DRAFT,
                'is_primary' => true,
            ],
        ];

        foreach ($data as $value) {
            MerchantPayoutMethod::create($value);
        }
    }
}
