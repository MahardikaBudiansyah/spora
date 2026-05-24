<?php

namespace Database\Seeders;

use App\Models\CourtCategory;
use Illuminate\Database\Seeder;

class CourtCategorySeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            ['name' => 'airsoft_gun', 'label' => 'Airsoft Gun'],
            ['name' => 'badminton', 'label' => 'Badminton'],
            ['name' => 'basketball', 'label' => 'Basket'],
            ['name' => 'baseball', 'label' => 'Bisbol'],
            ['name' => 'futsal', 'label' => 'Futsal'],
            ['name' => 'golf', 'label' => 'Golf'],
            ['name' => 'hockey', 'label' => 'Hoki'],
            ['name' => 'mini_soccer', 'label' => 'Mini Soccer'],
            ['name' => 'paddle', 'label' => 'Padel'],
            ['name' => 'football', 'label' => 'Sepak Bola'],
            ['name' => 'softball', 'label' => 'Sofbol'],
            ['name' => 'tennis', 'label' => 'Tennis'],
            ['name' => 'volleyball', 'label' => 'Voli'],
            ['name' => 'yoga', 'label' => 'Yoga'],
        ];


        foreach ($data as $value) {
            CourtCategory::updateOrCreate(
                ['name' => $value['name']],
                ['label' => $value['label']]
            );
        }
    }
}
