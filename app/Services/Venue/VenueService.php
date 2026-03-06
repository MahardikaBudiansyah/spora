<?php

namespace App\Services\Venue;

use App\Models\Venue;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use App\Helpers\UploadImageHelper;
use Illuminate\Support\Facades\Storage;

class VenueService
{
    public function createVenue(array $validated, int $merchantId, $request)
    {
        return DB::transaction(function () use ($validated, $merchantId, $request) {
            $venue = Venue::create([
                'merchant_id' => $merchantId,
                'name' => $validated['name'],
                'description' => $validated['description'] ?? null,
                'phone_number' => $validated['phone_number'],
            ]);

            $venue->categories()->sync($validated['category_ids'] ?? []);
            $venue->facilities()->sync($validated['facility_ids'] ?? []);

            $venue->address()->create([
                'address'       => $validated['full_address'] ?? null,
                'province_code' => $validated['province_code'] ?? null,
                'city_code'     => $validated['city_code'] ?? null,
                'district_code' => $validated['district_code'] ?? null,
                'village_code'  => $validated['village_code'] ?? null,
                'postal_code'   => $validated['postal_code'] ?? null,
                'latitude'      => $validated['latitude'] ?? null,
                'longitude'     => $validated['longitude'] ?? null,
            ]);

            if ($request->hasFile('images')) {
                $venueNameSlug = Str::slug($venue->name);
                $folderPath = "uploads/venues/{$venue->id}";
                $featuredIndex = intval($validated['main_image_index'] ?? 0);

                $uploadedImages = UploadImageHelper::handle(
                    $request->file('images'),
                    $folderPath,
                    $venueNameSlug,
                    $featuredIndex,
                    $venue->id,
                );

                $venue->images()->createMany($uploadedImages);
            }

            $venue->venuePaymentType()->create([
                'enable_dp'                => false,
                'dp_type'                  => 'fixed',
                'dp_value'                 => 0,
                'apply_to_merchant'        => false,
                'full_payment_days_before' => 1,
                'max_full_payment_days'    => 3,
                'is_active'                => true,
            ]);

            return $venue;
        });
    }

    public function updateVenue(Venue $venue, array $validated, $request)
    {
        return DB::transaction(function () use ($venue, $validated, $request) {
            $venue->update([
                'name' => $validated['name'],
                'description' => $validated['description'] ?? null,
                'phone_number' => $validated['phone_number'] ?? null,
            ]);

            $venue->categories()->sync($validated['category_ids'] ?? []);
            $venue->facilities()->sync($validated['facility_ids'] ?? []);

            $venue->address()->updateOrCreate(
                [], 
                [
                    'address'       => $validated['full_address'] ?? null,
                    'province_code' => $validated['province_code'] ?? null,
                    'city_code'     => $validated['city_code'] ?? null,
                    'district_code' => $validated['district_code'] ?? null,
                    'village_code'  => $validated['village_code'] ?? null,
                    'postal_code'   => $validated['postal_code'] ?? null,
                    'latitude'      => $validated['latitude'] ?? null,
                    'longitude'     => $validated['longitude'] ?? null,
                ]
            );

            UploadImageHelper::syncImages($venue, $request, [
                'slug_name' => $validated['name'],
                'folder' => "uploads/venues"
            ]);

            return $venue;
        });
    }

    public function deleteVenue(Venue $venue)
    {
        return DB::transaction(function () use ($venue) {
            $venue->load(['images', 'address']);

            foreach ($venue->images as $image) {
                if (!empty($image->image_path)) {
                    Storage::disk('public')->delete($image->image_path);
                }
                $image->delete();
            }

            if ($venue->address) {
                $venue->address()->delete();
            }

            return $venue->delete();
        });
    }
}