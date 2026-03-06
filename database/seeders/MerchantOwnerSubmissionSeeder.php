<?php

namespace Database\Seeders;

use App\Enums\Gender;
use App\Enums\MerchantOwnerStatus;
use App\Helpers\NumberPhoneHelper;
use App\Models\MerchantOwnerSubmission;
use Illuminate\Database\Seeder;

class MerchantOwnerSubmissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                'merchant_id' => 1,
                'name' => 'Mahardika Budiansyah',
                'email' => 'mahardikabudiansyah@gmail.com',
                'phone_number' => '089629792894',
                'nik' => '0101010101010101',
                'date_of_birth' => '1997-08-21',
                'gender' => Gender::MALE,
                'status' => MerchantOwnerStatus::DRAFT,
            ],
            [
                'merchant_id' => 2,
                'name' => 'Mahardiky Budiansyah',
                'email' => 'mahardiky@gmail.com',
                'phone_number' => '081310578168',
                'nik' => '0101010101010102',
                'date_of_birth' => '1997-08-21',
                'gender' => Gender::MALE,
                'status' => MerchantOwnerStatus::DRAFT,
            ],
        ];

        foreach ($data as $value) {
            $value['phone_number'] = NumberPhoneHelper::normalize($value['phone_number']);

            MerchantOwnerSubmission::create($value);
        }
    }
}
