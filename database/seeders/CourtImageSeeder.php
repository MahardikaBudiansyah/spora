<?php

namespace Database\Seeders;

use App\Models\CourtImage;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class CourtImageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $dummyPath = database_path('seeders/dummy/courts');

        $courtFolders = File::directories($dummyPath);

        foreach ($courtFolders as $folder) {
            $courtId = basename($folder);

            $imageFiles = File::files($folder);
            $order = 1;

            foreach ($imageFiles as $file) {
                $targetPath = "uploads/courts/{$courtId}/" . $file->getFilename();

                Storage::disk('public')->put($targetPath, File::get($file->getRealPath()));

                CourtImage::create([
                    'court_id'    => $courtId,
                    'image_path'  => $targetPath,
                    'is_featured' => $order === 1,
                    'order'       => $order,
                ]);

                $order++;
            }
        }
    }
}
