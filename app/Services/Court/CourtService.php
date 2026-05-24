<?php

namespace App\Services\Court;

use App\Models\Court;
use App\Models\Venue;
use Illuminate\Support\Str;
use App\Helpers\UploadImageHelper;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class CourtService
{
    public function store(Venue $venue, array $data)
    {
        // Catatan: DB::transaction dilepas di sini karena akan dibungkus oleh FlowService
        $court = $venue->courts()->create([
            'name' => $data['name'],
            'court_surface_id' => $data['court_surface_id'],
            'description' => $data['description'] ?? null,
        ]);

        $this->syncCategories($court, $data['categories']);

        if (!empty($data['images'])) {
            $uploadedImages = UploadImageHelper::handle(
                $data['images'],
                "uploads/courts/{$court->id}",
                Str::slug($court->name),
                intval($data['main_image_index'] ?? 0),
                $court->id
            );
            $court->images()->createMany($uploadedImages);
        }

        return $court;
    }

    public function update(Court $court, array $data)
    {
        $court->update([
            'name' => $data['name'],
            'court_surface_id' => $data['court_surface_id'],
            'description' => $data['description'] ?? null,
        ]);

        $this->syncCategories($court, $data['categories']);

        UploadImageHelper::syncImages($court, request(), [
            'slug_name' => $data['name'],
            'folder' => "uploads/courts"
        ]);

        return $court;
    }

    public function deleteCourt(Court $court)
    {
        return DB::transaction(function () use ($court) {
            $court->load('images');
            foreach ($court->images as $image) {
                if (!empty($image->image_path)) {
                    Storage::disk('public')->delete($image->image_path);
                }
                $image->delete();
            }
            $court->categories()->detach();
            $court->timeSlots()->detach();
            return $court->delete();
        });
    }

    private function syncCategories(Court $court, array $categories = [])
    {
        if (empty($categories)) {
            $court->categories()->detach();
            return;
        }

        $syncData = [];
        foreach ($categories as $cat) {
            if (!isset($cat['id'])) continue;

            $syncData[$cat['id']] = [
                'is_primary' => $cat['is_primary'] ?? false,
                'notes'      => $cat['notes'] ?? null,
                'order'      => $cat['order'] ?? 0,
            ];
        }
        $court->categories()->sync($syncData);
    }
}
