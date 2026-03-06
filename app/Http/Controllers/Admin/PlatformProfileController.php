<?php

namespace App\Http\Controllers\Admin;

use App\Enums\AddressLabel;
use App\Enums\MorphType;
use App\Helpers\NumberPhoneHelper;
use App\Helpers\UploadImageHelper;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\Admin\PlatformProfileUpdateRequest;

class PlatformProfileController extends Controller
{
    public function update(PlatformProfileUpdateRequest $request)
    {
        $admin = Auth::guard('admin')->user();
        $profile = $admin->platformProfile;

        $this->authorize('update', $profile);

        $validated = $request->validated();

        try {
            DB::beginTransaction();

            $updateData = [
                'business_name' => $validated['business_name'],
                'business_email' => $validated['business_email'],
                'business_phone_number' => NumberPhoneHelper::normalize($validated['business_phone_number']),
                'business_type' => $validated['business_type'],
                'nib' => $validated['nib'],
            ];

            if ($request->hasFile('logo_path')) {
                $subFolder = "admins/platform_profiles/{$admin->id}";
                if ($profile->logo_path) {
                    Storage::disk('public')->delete($profile->logo_path);
                }

                $filename = "logo-{$admin->id}-" . time();
                $updateData['logo_path'] = UploadImageHelper::handleSingleUpload(
                    $request->file('logo_path'),
                    $subFolder,
                    $filename
                );
            }

            $profile->update($updateData);

            $profile->address()->updateOrCreate(
                [
                    'addressable_id' => $profile->id,
                    'addressable_type' => MorphType::PLATFORM_PROFILE,
                    'label'         => AddressLabel::BUSINESS
                ],
                [
                    'address' => $validated['address'] ?? null,
                    'province_code' => $validated['province_code'] ?? null,
                    'city_code' => $validated['city_code'] ?? null,
                    'district_code' => $validated['district_code'] ?? null,
                    'village_code' => $validated['village_code'] ?? null,
                    'postal_code' => $validated['postal_code'] ?? null,
                    'latitude' => $validated['latitude'] ?? null,
                    'longitude' => $validated['longitude'] ?? null,
                ]
            );

            DB::commit();
            return back()->with('success', 'Informasi Bisnis berhasil diperbarui.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['message' => 'Terjadi kesalahan: ' . $e->getMessage()]);
        }
    }
}
