<?php

namespace Database\Seeders;

use Carbon\Carbon;
use App\Models\Merchant;
use App\Models\StaffRole;
use Illuminate\Database\Seeder;
use App\Models\MerchantStaffRole;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class MerchantStaffRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $merchant = Merchant::find(1);

        if (!$merchant) {
            return;
        }

        // Ambil role operator
        $operator = StaffRole::where('name', 'operator')->first();

        if ($operator) {
            MerchantStaffRole::create([
                'merchant_id' => $merchant->id,
                'staff_role_id' => $operator->id,
                'created_at'   => Carbon::now(),
                'updated_at'   => Carbon::now(),
            ]);
        }
    
    }
}
