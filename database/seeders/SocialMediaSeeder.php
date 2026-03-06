<?php

namespace Database\Seeders;

use App\Models\Venue;
use App\Enums\SocialPlatform;
use Illuminate\Database\Seeder;

class SocialMediaSeeder extends Seeder
{
    public function run(): void
    {
        $venue1 = Venue::where('slug', 'telaga-1-futsal')->first();
        $venue2 = Venue::where('slug', 'jakal-seven-futsal')->first();

        if ($venue1) {
            $venue1->socialMedia()->createMany([
                [
                    'platform' => SocialPlatform::INSTAGRAM,
                    'username' => '@telaga1futsal',
                    'url'      => 'https://instagram.com/telaga1futsal',
                ],
                [
                    'platform' => SocialPlatform::FACEBOOK, 
                    'username' => 'Telaga Futsal Official',
                    'url'      => 'https://facebook.com/telagafutsal',
                ],
            ]);
        }

        if ($venue2) {
            $venue2->socialMedia()->createMany([
                [
                    'platform' => SocialPlatform::INSTAGRAM,
                    'username' => '@jakalseven',
                    'url'      => 'https://instagram.com/jakalseven',
                ],
                [
                    'platform' => SocialPlatform::TWITTER, 
                    'username' => 'jakalseven.com',
                    'url'      => 'https://jakalseven.com',
                ],
            ]);
        }
    }
}