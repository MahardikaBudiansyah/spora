<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Address;
use App\Models\Venue;

class AddressSeeder extends Seeder
{
    public function run(): void
    {
        $addresses = [
            [
                'venue_slug'    => 'telaga-1-futsal',
                'address'       => 'Jl. Magelang No. 123, Sleman',
                'province_code' => '34',          // Yogyakarta
                'city_code'     => '3404',        // Sleman
                'district_code' => '340406',     // Mlati
                'village_code'  => '3404062001',  // Desa
                'postal_code'   => '55281',
                'latitude'      => -7.7325,
                'longitude'     => 110.4024,
            ],
            [
                'venue_slug'    => 'jakal-seven-futsal',
                'address'       => 'Jl. Kaliurang KM 7, Sleman',
                'province_code' => '34',
                'city_code'     => '3404',
                'district_code' => '340407',
                'village_code'  => '3404072003',
                'postal_code'   => '55283',
                'latitude'      => -7.7502,
                'longitude'     => 110.3779,
            ],
        ];

        foreach ($addresses as $data) {
            $venue = Venue::where('slug', $data['venue_slug'])->first();

            if ($venue) {
                Address::create([
                    'addressable_id'   => $venue->id,
                    'addressable_type' => Venue::class,
                    'address'          => $data['address'],
                    'province_code'    => $data['province_code'],
                    'city_code'        => $data['city_code'],
                    'district_code'    => $data['district_code'],
                    'village_code'     => $data['village_code'],
                    'postal_code'      => $data['postal_code'],
                    'latitude'         => $data['latitude'],
                    'longitude'        => $data['longitude'],
                ]);
            }
        }
    }
}
