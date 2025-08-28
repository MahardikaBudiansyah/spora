<?php

namespace Database\Seeders;

use Carbon\Carbon;
use App\Models\MerchantOwner;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class MerchantOwnerSeeder extends Seeder
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
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ];

        foreach ($data as $value) {
            MerchantOwner::create($value);
        }
    }
}
