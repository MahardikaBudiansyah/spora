<?php

namespace Database\Seeders;

use App\Models\MerchantProfile;
use Illuminate\Support\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class MerchantProfileSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                'merchant_id' => 1,
                'nik' => '0101010101010101',
                'full_name' => 'Mahardika Budiansyah',
                'address' => 'Kamal RT 02 RW 04, Pagersari, Mungkid, Magelang',
                'ktp_photo' => null,
                'selfie_with_ktp' => null,
                'bank_name' => 'Bank Central Asia',
                'bank_account_number' => '089629792894',
                'bank_account_holder' => 'Mahardika Budiansyah',
                'verification_status' => 'approved',
                'verified_at' => now(), 
                'rejection_reason' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ];

        foreach ($data as $value) {
            MerchantProfile::create($value);
        }
    }
}
