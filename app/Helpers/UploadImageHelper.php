<?php

namespace App\Helpers;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class UploadImageHelper
{
    /**
     * Handle upload images saat create.
     *
     * @param array $images
     * @param string $folder
     * @param string $namePrefix (slug dari nama venue)
     * @param int|null $featuredIndex
     * @param int|null $idPrefix (venue ID)
     * @return array
     */
    public static function handle(array $images, string $folder, string $namePrefix, ?int $featuredIndex = 0, ?int $idPrefix = null): array
    {
        $uploadedImages = [];

        foreach ($images as $i => $image) {
            if (!($image instanceof UploadedFile)) continue;

            $ext = $image->getClientOriginalExtension();
            $filename = "{$idPrefix}-{$namePrefix}-gambar-" . ($i + 1) . '-' . time() . ".{$ext}";
            $path = $image->storeAs($folder, $filename, 'public');

            $uploadedImages[] = [
                'image_path' => $path,
                'is_featured' => $i === $featuredIndex,
                'order' => $i,
            ];
        }

        return $uploadedImages;
    }

    public static function handleSingleUpload(UploadedFile $file, string $folder, string $filename): string
    {
        $ext = $file->getClientOriginalExtension();
        $fullFilename = "{$filename}.{$ext}";

        return $file->storeAs("uploads/{$folder}", $fullFilename, 'public');
    }
    /**
     * Sinkronisasi gambar saat update data.
     *
     * @param mixed $model
     * @param Request $request
     * @param array $options
     *        - slug_name: string
     *        - folder: string
     * @return void
     */
    public static function syncImages($model, Request $request, array $options = []): void
    {
        $slugName = Str::slug($options['slug_name'] ?? 'item');
        $folder = $options['folder'] ?? 'uploads';

        // 1. Ambil data input
        $rawIds = $request->input('existing_image_ids', '[]');

        // PASTIKAN ada parameter 'true' di json_decode agar jadi Array PHP
        $decodedIds = is_string($rawIds) ? json_decode($rawIds, true) : $rawIds;
        $existingImageIds = collect($decodedIds ?? []);

        // 2. Hapus yang tidak ada di list
        $model->images()->whereNotIn('id', $existingImageIds)->get()->each(function ($image) {
            if ($image->image_path) {
                Storage::disk('public')->delete($image->image_path);
            }
            $image->delete();
        });

        // 3. Upload gambar baru
        // Di log tadi 'New Files to Upload' namanya 'images', maka:
        if ($request->hasFile('images')) {
            Log::info('Helper detected files. Starting loop...');
            foreach ($request->file('images') as $index => $image) {
                $path = $image->storeAs("{$folder}/{$model->id}", "test-{$index}-" . time() . ".jpg", 'public');

                $newImg = $model->images()->create([
                    'image_path' => $path,
                    'is_featured' => false,
                    'order' => 99,
                ]);

                Log::info('Image created:', ['id' => $newImg->id, 'path' => $newImg->image_path]);
            }
        } else {
            Log::warning('Helper did not see any files in $request->file("images")');
        }

        // 4. Update Urutan & Featured Image
        $mainImageIndex = intval($request->input('main_image_index', 0));

        // REFRESH relasi agar gambar baru (ID 25-28) masuk ke koleksi
        $allImages = $model->images()
            ->orderBy('order', 'asc')
            ->orderBy('id', 'asc')
            ->get();

        // HITUNG ULANG Featured
        foreach ($allImages as $index => $image) {
            // Paksa update urutan agar bersih (0, 1, 2, 3...)
            // Dan set featured hanya jika index-nya cocok dengan yang dikirim React
            $image->update([
                'order' => $index,
                'is_featured' => ($index === $mainImageIndex)
            ]);

            if ($index === $mainImageIndex) {
                Log::info("Featured Image Berhasil Diset:", [
                    'image_id' => $image->id,
                    'index_target' => $mainImageIndex,
                    'image_path' => $image->image_path
                ]);
            }
        }
    }

    public static function handleUserProfile(UploadedFile $file, int $userId): string
    {
        $ext = $file->getClientOriginalExtension();
        $filename = "{$userId}-profile-" . time() . ".{$ext}";
        $path = $file->storeAs('uploads/users', $filename, 'public');

        return $path;
    }

    public static function resolveProfilePath($request, $model, string $fieldName, string $folderPrefix)
    {
        $inputValue = $request->{$fieldName};
        $id = $model->id;
        $subFolder = "{$folderPrefix}/accounts/{$id}";

        if ($request->hasFile($fieldName)) {
            if ($model->{$fieldName} && !str_contains($model->{$fieldName}, 'assets/')) {
                Storage::disk('public')->delete($model->{$fieldName});
            }

            $filename = "profile-{$id}-" . time();
            return self::handleSingleUpload($request->file($fieldName), $subFolder, $filename);
        }

        if (is_string($inputValue) && !empty($inputValue)) {
            $parsedUrl = parse_url($inputValue, PHP_URL_PATH);
            $cleanPath = ltrim($parsedUrl, '/');

            if (str_contains($cleanPath, 'assets/')) {
                if ($model->{$fieldName} && !str_contains($model->{$fieldName}, 'assets/')) {
                    Storage::disk('public')->delete($model->{$fieldName});
                }
                return $parsedUrl;
            }

            return $cleanPath;
        }

        return $model->{$fieldName};
    }
}
