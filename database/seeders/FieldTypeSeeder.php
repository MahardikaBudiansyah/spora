<?php

namespace Database\Seeders;

use Carbon\Carbon;
use App\Models\FieldType;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class FieldTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [   'name' => 'Vinyl'],
            [   'name' => 'Rumput Sintetis'],
            [   'name' => 'Semen/Beton'],
            [   'name' => 'Parquette'],
            [   'name' => 'Taraflex'],
            [   'name' => 'Karpet Plastik'],
            
        ];

        foreach ($data as $value) {
            FieldType::create($value);
        }
    }
}
