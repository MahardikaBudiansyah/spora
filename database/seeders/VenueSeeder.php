<?php

namespace Database\Seeders;

use App\Enums\VenueStatus;
use App\Models\Venue;
use Illuminate\Database\Seeder;
use App\Helpers\NumberPhoneHelper;

class VenueSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                'name' => 'Telaga 1 Futsal',
                'description' => 'Telaga Futsal merupakan tempat penyedia jasa penyewaan lapangan futsal. Telaga 1 Futsal adalah satu manajemen dari Telaga Futsal yang berdiri pada tahun 2023 dengan memiliki 5 lapangan futsal sehingga mampu melayani konsumen untuk memilih lapangan yang tersedia',
                'phone_number' => '081310578168 ',
                'slug' => 'telaga-1-futsal',
                'status' => VenueStatus::APPROVED,
                'merchant_id' => 1,
            ],
            [
                'name' => 'Telaga 2 Futsal',
                'description' => 'Telaga Futsal merupakan tempat penyedia jasa penyewaan lapangan futsal. Telaga 2 Futsal adalah satu manajemen dari Telaga Futsal yang berdiri pada tahun 2023 dengan memiliki 3 lapangan futsal sehingga mampu melayani konsumen untuk memilih lapangan yang tersedia',
                'phone_number' => '089629792894 ',
                'slug' => 'telaga-2-futsal',
                'status' => VenueStatus::REJECTED,
                'merchant_id' => 1,
            ],
            [
                'name' => 'Telaga 3 Futsal',
                'description' => 'Telaga Futsal merupakan tempat penyedia jasa penyewaan lapangan futsal. Telaga 3 Futsal adalah satu manajemen dari Telaga Futsal yang berdiri pada tahun 2023 dengan memiliki 10 lapangan futsal sehingga mampu melayani konsumen untuk memilih lapangan yang tersedia',
                'phone_number' => '081225336986 ',
                'slug' => 'telaga-3-futsal',
                'merchant_id' => 1,
            ],

            [
                'name' => 'Jakal Seven Futsal',
                'description' => 'Jakal Seven merupakan tempat penyedia jasa penyewaan lapangan futsal. Jakal Seven Futsal adalah satu manajemen dari Jakal Seven yang berdiri pada tahun 2023 dengan memiliki 5 lapangan futsal sehingga mampu melayani konsumen untuk memilih lapangan yang tersedia',
                'phone_number' => '081310578168 ',
                'slug' => 'jakal-seven-futsal',
                'status' => VenueStatus::APPROVED,
                'merchant_id' => 2,
            ],
            [
                'name' => 'Jakal Two Futsal',
                'description' => 'Jakal Seven merupakan tempat penyedia jasa penyewaan lapangan futsal. Telaga 2 Futsal adalah satu manajemen dari Jakal Seven yang berdiri pada tahun 2023 dengan memiliki 3 lapangan futsal sehingga mampu melayani konsumen untuk memilih lapangan yang tersedia',
                'phone_number' => '089629792894 ',
                'slug' => 'jakal-two-futsal',
                'status' => VenueStatus::REJECTED,
                'merchant_id' => 2,
            ],
            [
                'name' => 'Jakal Ten Futsal',
                'description' => 'Jakal Seven merupakan tempat penyedia jasa penyewaan lapangan futsal. Telaga 3 Futsal adalah satu manajemen dari Jakal Seven yang berdiri pada tahun 2023 dengan memiliki 10 lapangan futsal sehingga mampu melayani konsumen untuk memilih lapangan yang tersedia',
                'phone_number' => '081225336986 ',
                'slug' => 'jakal-ten-futsal',
                'merchant_id' => 2,
            ],

        ];

        foreach ($data as $value) {
            $value['phone_number'] = NumberPhoneHelper::normalize($value['phone_number']);

            Venue::create($value);
        }
    }
}
