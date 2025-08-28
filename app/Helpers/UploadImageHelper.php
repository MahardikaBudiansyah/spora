<?php

namespace App\Helpers;

use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

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
        $existingImageIds = collect(json_decode($request->input('existing_image_ids', '[]')));
        $mainImageIndex = intval($request->input('main_image_index', 0));

        // Tambahkan main_image ke existing jika belum ada
        $mainImageId = intval($request->input('main_image_id', 0));
        if ($mainImageId && !$existingImageIds->contains($mainImageId)) {
            $existingImageIds->push($mainImageId);
        }

        // Hapus gambar yang tidak disimpan
        $model->images()->whereNotIn('id', $existingImageIds)->get()->each(function ($image) {
            if ($image->image_path) {
                Storage::disk('public')->delete($image->image_path);
            }
            $image->delete();
        });

        // Upload image baru
        if ($request->hasFile('images')) {
            $startOrder = $existingImageIds->count();

            foreach ($request->file('images') as $i => $image) {
                if (!($image instanceof UploadedFile)) continue;

                $ext = $image->getClientOriginalExtension();
                $filename = "{$model->id}-{$slugName}-gambar-" . ($i + 1) . '-' . time() . ".{$ext}";
                $path = $image->storeAs("{$folder}/{$model->id}", $filename, 'public');

                $model->images()->create([
                    'image_path' => $path,
                    'is_featured' => false,
                    'order' => $startOrder + $i,
                ]);
            }
        }

        // Reset is_featured dulu semua
        $model->images()->update(['is_featured' => false]);

        // Ambil ulang gambar, atur urutan dan featured
        $allImages = $model->images()->orderBy('id')->get()->values();
        $mainImage = $allImages->get($mainImageIndex);

        foreach ($allImages as $i => $image) {
            $image->order = $i;
            $image->is_featured = $mainImage && $image->id == $mainImage->id;
            $image->save();
        }
    }
}
