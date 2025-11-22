<?php

namespace Database\Seeders;

use App\Models\VenueImage;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;


class VenueImageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        {
            $dummyPath = database_path('seeders/dummy/venues');

            // ambil semua folder venue (1,2,3,...)
            $venueFolders = File::directories($dummyPath);

            foreach ($venueFolders as $folder) {
                $venueId = basename($folder); // nama folder = venue_id

                $imageFiles = File::files($folder);
                $order = 1;

                foreach ($imageFiles as $file) {

                    // path tujuan di storage/public
                    $targetPath = "uploads/venues/{$venueId}/" . $file->getFilename();

                    // copy file ke storage public
                    Storage::disk('public')->put($targetPath, File::get($file->getRealPath()));

                    // simpan ke database
                    VenueImage::create([
                        'venue_id'    => $venueId,
                        'image_path'  => $targetPath,
                        'is_featured' => $order === 1, // file pertama jadi featured
                        'order'       => $order,
                    ]);

                    $order++;
                }
            }
        }
    }
}
