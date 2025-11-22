<?php

namespace Database\Seeders;

use App\Models\FieldImage;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class FieldImageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $dummyPath = database_path('seeders/dummy/fields');

        // Ambil semua folder field (1, 2, 3, ...)
        $fieldFolders = File::directories($dummyPath);

        foreach ($fieldFolders as $folder) {
            $fieldId = basename($folder); // nama folder = field_id

            // Ambil semua file gambar dalam folder
            $imageFiles = File::files($folder);
            $order = 1;

            foreach ($imageFiles as $file) {

                // Path tujuan di storage/app/public
                $targetPath = "uploads/fields/{$fieldId}/" . $file->getFilename();

                // Copy file ke storage
                Storage::disk('public')->put($targetPath, File::get($file->getRealPath()));

                // Simpan ke database
                FieldImage::create([
                    'field_id'    => $fieldId,
                    'image_path'  => $targetPath,
                    'is_featured' => $order === 1, // gambar pertama = featured
                    'order'       => $order,
                ]);

                $order++;
            }
        }
    }
}
