<?php

namespace App\Http\Controllers\Admin;

use App\Enums\AddressLabel;
use App\Enums\AdminStatus;
use App\Enums\MorphType;
use App\Helpers\NumberPhoneHelper;
use App\Helpers\UploadImageHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AdminProfileUpdateRequest;
use App\Http\Resources\AdminResource;
use App\Http\Resources\PlatformProfileResource;
use App\Models\Admin;
use App\Models\AdminProfile;
use App\Models\PlatformProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class AdminProfileController extends Controller
{
    public function index(Request $request): Response
    {
        $admin = $request->user();
        $admin->load([
            'profile.address.village',
            'profile.address.district',
            'profile.address.city',
            'profile.address.province',
        ]);

        $platform_profile = PlatformProfile::with([
            'payoutMethods',
            'socialMedia',
            'address.village',
            'address.district',
            'address.city',
            'address.province',
        ])->first();

        if ($admin->role === 'superadmin') {
            $admin->setRelation('platformProfile', $platform_profile);
        }

        return Inertia::render('Admin/Profile/Index', [
            'admin' => new AdminResource($admin),
            'platform_profile' => $platform_profile ? new PlatformProfileResource($platform_profile) : null,
        ]);
    }

    public function updateAvatar(Request $request)
    {
        $admin = Auth::guard('admin')->user();
        if (!$admin instanceof Admin) {
            return back()->withErrors(['message' => 'User tidak valid']);
        }

        $request->validate(['avatar_path' => ['required']]);

        try {
            $path = UploadImageHelper::resolveProfilePath($request, $admin, 'avatar_path', 'admins');

            $admin->update(['avatar_path' => $path]);

            return back()->with('success', 'Avatar Admin berhasil diperbarui.');
        } catch (\Exception $e) {
            return back()->withErrors(['avatar_path' => 'Gagal memperbarui Avatar: ' . $e->getMessage()]);
        }
    }

    public function updateAccount(Request $request)
    {
        $admin = Auth::guard('admin')->user();
        if (!$admin instanceof Admin) {
            return back()->withErrors(['message' => 'User tidak valid']);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'avatar_path' => ['required'],
        ]);

        try {
            DB::beginTransaction();

            $path = UploadImageHelper::resolveProfilePath($request, $admin, 'avatar_path', 'admins');

            $admin->update([
                'name' => $validated['name'],
                'avatar_path' => $path,
            ]);

            DB::commit();
            return back()->with('success', 'Data Admin berhasil diperbarui.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['message' => 'Terjadi kesalahan: ' . $e->getMessage()]);
        }
    }

    public function updateAccountSecurity(Request $request)
    {
        $admin = Auth::guard('admin')->user();
        if (!$admin instanceof Admin) {
            return back()->withErrors(['message' => 'User tidak valid']);
        }

        $request->validate([
            'current_password' => ['required', 'current_password:admin'],
            'password' => ['required', 'confirmed', Password::defaults()],
        ], [
            'current_password.current_password' => 'Password saat ini tidak cocok.',
            'password.confirmed' => 'Konfirmasi password baru tidak cocok.',
        ]);

        try {
            $admin->update([
                'password' => Hash::make($request->password),
            ]);

            return back()->with('success', 'Password berhasil diperbarui.');
        } catch (\Exception $e) {
            return back()->withErrors([
                'message' => 'Gagal memperbarui password: ' . $e->getMessage()
            ]);
        }
    }

    public function requestDeactivation(Request $request)
    {
        $admin = Auth::guard('admin')->user();
        if (!$admin instanceof Admin) {
            return back()->withErrors(['message' => 'User tidak valid']);
        }

        $request->validate([
            'reason' => 'required|string|min:10|max:500',
        ]);

        if ($admin->status ===  AdminStatus::DEACTIVATION_REQUESTED) {
            return back()->withErrors(['message' => 'Pengajuan hapus akun Anda sedang diproses oleh Superadmin.']);
        }

        $admin->update([
            'status' =>  AdminStatus::DEACTIVATION_REQUESTED,
        ]);

        $admin->statusHistories()->create([
            'status' => AdminStatus::DEACTIVATION_REQUESTED,
            'reason' => $request->reason,
            'admin_name_snapshot' => $admin->name,
        ]);

        return back()->with('success', 'Permintaan hapus akun berhasil dikirim.');
    }

    public function update(AdminProfileUpdateRequest $request)
    {
        $admin = Auth::guard('admin')->user();
        if (!$admin instanceof Admin) {
            return back()->withErrors(['message' => 'User tidak valid']);
        }

        $profile = AdminProfile::firstOrNew(['admin_id' => $admin->id]);

        $this->authorize('update', $profile);

        $validated = $request->validated();

        try {
            DB::transaction(function () use ($request, $validated, $admin, $profile) {
                $updateData = [
                    'full_name' => $validated['full_name'],
                    'nik' => $validated['nik'],
                    'gender' => $validated['gender'],
                    'date_of_birth' => $validated['date_of_birth'],
                    'phone_number' => NumberPhoneHelper::normalize($validated['phone_number']),
                ];

                $subFolder = "admins/admin_profiles/{$admin->id}";

                $fileUploads = ['photo_path', 'ktp_photo_path', 'selfie_photo_path'];

                foreach ($fileUploads as $upload) {
                    if ($request->hasFile($upload)) {
                        if ($profile->$upload) {
                            Storage::disk('public')->delete($profile->$upload);
                        }

                        $file = str_replace('_path', '', $upload);
                        $filename = "{$file}-{$admin->id}-" . time();

                        $updateData[$upload] = UploadImageHelper::handleSingleUpload(
                            $request->file($upload),
                            $subFolder,
                            $filename
                        );
                    }
                }

                $profile->fill($updateData);
                $profile->save();

                $this->updateAddress($profile, $validated);
            });

            return back()->with('success', 'Profil Admin berhasil diperbarui.');
        } catch (\Exception $e) {
            return back()->withErrors(['message' => 'Gagal memperbarui data: ' . $e->getMessage()]);
        }
    }

    private function updateAddress($profile, $validated)
    {
        $profile->address()->updateOrCreate(
            [
                'addressable_id' => $profile->id,
                'addressable_type' => MorphType::ADMIN_PROFILE,
                'label' => AddressLabel::LEGAL
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
    }
}
