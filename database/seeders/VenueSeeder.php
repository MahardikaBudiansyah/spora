<?php

namespace Database\Seeders;

use Carbon\Carbon;
use App\Models\Venue;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class VenueSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [   'name' => 'Telaga 1 Futsal',
                'description' => 'Telaga Futsal merupakan tempat penyedia jasa penyewaan lapangan futsal. Telaga 1 Futsal adalah satu manajemen dari Telaga Futsal yang berdiri pada tahun 2023 dengan memiliki 5 lapangan futsal sehingga mampu melayani konsumen untuk memilih lapangan yang tersedia',
                'phone_number' => '081310578168 ',
                'location' => 'Jl. Perumnas, Dabag, Condongcatur, Kec. Depok, Kabupaten Sleman, Daerah Istimewa Yogyakarta',
                'slug' => 'telaga-1-futsal',
                'merchant_id' => 1,
            ],
            [   'name' => 'Telaga 2 Futsal',
                'description' => 'Telaga Futsal merupakan tempat penyedia jasa penyewaan lapangan futsal. Telaga 2 Futsal adalah satu manajemen dari Telaga Futsal yang berdiri pada tahun 2023 dengan memiliki 3 lapangan futsal sehingga mampu melayani konsumen untuk memilih lapangan yang tersedia',
                'location' => 'Jl. Karang Ploso, RT.01/RW.11, Gempol, Condongcatur, Kec. Depok, Kabupaten Sleman, Daerah Istimewa Yogyakarta',
                'phone_number' => '089629792894 ',
                'slug' => 'telaga-2-futsal',
                'merchant_id' => 1,
            ],
            [   'name' => 'Telaga 3 Futsal',
                'description' => 'Telaga Futsal merupakan tempat penyedia jasa penyewaan lapangan futsal. Telaga 3 Futsal adalah satu manajemen dari Telaga Futsal yang berdiri pada tahun 2023 dengan memiliki 10 lapangan futsal sehingga mampu melayani konsumen untuk memilih lapangan yang tersedia',
                'location' => 'Jl. Gempol Raya, Gempol, Condongcatur, Kec. Depok, Kabupaten Sleman, Daerah Istimewa Yogyakarta ',
                'phone_number' => '081225336986 ',
                'slug' => 'telaga-3-futsal',
                'merchant_id' => 1,
            ],

            [   'name' => 'Jakal Seven Futsal',
                'description' => 'Jakal Seven merupakan tempat penyedia jasa penyewaan lapangan futsal. Jakal Seven Futsal adalah satu manajemen dari Jakal Seven yang berdiri pada tahun 2023 dengan memiliki 5 lapangan futsal sehingga mampu melayani konsumen untuk memilih lapangan yang tersedia',
                'phone_number' => '081310578168 ',
                'location' => ' Kaliurang St No.7,7, Ngabean Kulon, Sinduharjo, Ngaglik, Sleman Regency, Special Region of Yogyakarta',
                'slug' => 'jakal-seven-futsal',
                'merchant_id' => 2,
            ],
            [   'name' => 'Jakal Two Futsal',
                'description' => 'Jakal Seven merupakan tempat penyedia jasa penyewaan lapangan futsal. Telaga 2 Futsal adalah satu manajemen dari Jakal Seven yang berdiri pada tahun 2023 dengan memiliki 3 lapangan futsal sehingga mampu melayani konsumen untuk memilih lapangan yang tersedia',
                'location' => ' Kaliurang St No.2,2, Ngabean Kulon, Sinduharjo, Ngaglik, Sleman Regency, Special Region of Yogyakarta',
                'phone_number' => '089629792894 ',
                'slug' => 'jakal-two-futsal',
                'merchant_id' => 2,
            ],
            [   'name' => 'Jakal Ten Futsal',
                'description' => 'Jakal Seven merupakan tempat penyedia jasa penyewaan lapangan futsal. Telaga 3 Futsal adalah satu manajemen dari Jakal Seven yang berdiri pada tahun 2023 dengan memiliki 10 lapangan futsal sehingga mampu melayani konsumen untuk memilih lapangan yang tersedia',
                'location' => ' Kaliurang St No.10,10, Ngabean Kulon, Sinduharjo, Ngaglik, Sleman Regency, Special Region of Yogyakarta',
                'phone_number' => '081225336986 ',
                'slug' => 'jakal-ten-futsal',
                'merchant_id' => 2,
            ],

        ];

        foreach ($data as $value) {
            Venue::create($value);
        }
    }
}
