<?php

namespace Database\Seeders;

use App\Enums\BusinessType;
use App\Enums\MerchantProfileStatus;
use App\Helpers\NumberPhoneHelper;
use App\Models\MerchantProfileSubmission;
use Illuminate\Database\Seeder;

class MerchantProfileSubmissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                'merchant_id' => 1,
                'business_name' => 'Jakal Futsal Group',
                'business_email' => 'jakal.futsal@gmail.com',
                'business_phone_number' => '089629792894',
                'status' => BusinessType::INDIVIDUAL,
                'nib' => '1234567890123',
                'status' => MerchantProfileStatus::DRAFT,
            ],
            [
                'merchant_id' => 2,
                'business_name' => 'Telaga Futsal Group',
                'business_email' => 'telaga.futsal@gmail.com',
                'business_phone_number' => '081310578168',
                'status' => BusinessType::INDIVIDUAL,
                'nib' => '1234567890124',
                'status' => MerchantProfileStatus::DRAFT,
            ],
        ];

        foreach ($data as $value) {
            $value['business_phone_number'] = NumberPhoneHelper::normalize($value['business_phone_number']);

            MerchantProfileSubmission::create($value);
        }
    }
}
