<?php

namespace App\Http\Controllers\Merchant;

use App\Enums\AddressLabel;
use App\Enums\MerchantOwnerStatus;
use App\Enums\MerchantStatus;
use App\Enums\MorphType;
use App\Helpers\NumberPhoneHelper;
use App\Helpers\UploadImageHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\Merchant\MerchantOwnerUpdateRequest;
use App\Models\Admin;
use App\Models\Merchant;
use App\Models\MerchantOwnerSubmission;
use App\Notifications\Admin\VerificationRequestNotification;
use App\Notifications\Merchant\VerificationSubmittedNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Storage;

class MerchantOwnerController extends Controller
{
    public function update(MerchantOwnerUpdateRequest $request)
    {
        $merchant = Auth::guard('merchant')->user();
        if (!$merchant instanceof Merchant) {
            return back()->withErrors(['message' => 'User tidak valid']);
        }

        $submission = $merchant->ownerSubmission;

        if ($submission && $submission->status === MerchantOwnerStatus::PENDING) {
            return back()->withErrors(['message' => 'Data sedang dalam proses verifikasi dan tidak dapat diubah.']);
        }

        $validated = $request->validated();

        try {
            DB::transaction(function () use ($request, $validated, $merchant, $submission) {
                $data = [
                    'name' => $validated['name'],
                    'nik' => $validated['nik'],
                    'gender' => $validated['gender'],
                    'date_of_birth' => $validated['date_of_birth'],
                    'email' => $validated['email'],
                    'phone_number' => NumberPhoneHelper::normalize($validated['phone_number']),
                    'photo_path' => $submission->photo_path ?? $merchant->owner->photo_path ?? null,
                    'ktp_photo_path' => $submission->ktp_photo_path ?? $merchant->owner->ktp_photo_path ?? null,
                    'selfie_photo_path' => $submission->selfie_photo_path ?? $merchant->owner->selfie_photo_path ?? null,
                    'status' => MerchantOwnerStatus::DRAFT,
                ];

                if ($submission && $submission->status === MerchantOwnerStatus::APPROVED) {
                    $updateData = $merchant->ownerSubmissions()->create($data);
                } else {
                    $updateData = $submission ?? new MerchantOwnerSubmission(['merchant_id' => $merchant->id]);
                    $updateData->fill($data);
                    $updateData->save();
                }

                $this->updateAddress($updateData, $validated);

                $subFolder = "merchants/owners/{$merchant->id}";
                $fileFields = ['photo_path', 'ktp_photo_path', 'selfie_photo_path'];

                foreach ($fileFields as $field) {
                    if ($request->hasFile($field)) {
                        $oldPath = $updateData->$field;

                        $isUsedByApproved = MerchantOwnerSubmission::where($field, $oldPath)
                            ->where('status', MerchantOwnerStatus::APPROVED)
                            ->exists();

                        if ($oldPath && !$isUsedByApproved) {
                            Storage::disk('public')->delete($oldPath);
                        }

                        $filePrefix = str_replace('_path', '', $field);
                        $filename = "{$filePrefix}-{$merchant->id}-" . time();

                        $updateData->$field = UploadImageHelper::handleSingleUpload(
                            $request->file($field),
                            $subFolder,
                            $filename
                        );
                    }
                }

                $updateData->save();
            });


            return back()->with('success', 'Data Owner Mitra berhasil diperbarui.');
        } catch (\Exception $e) {
            return back()->withErrors(['message' => 'Gagal memperbarui data: ' . $e->getMessage()]);
        }
    }

    private function updateAddress($updateData, $validated)
    {
        $updateData->address()->updateOrCreate(
            [
                'addressable_id' => $updateData->id,
                'addressable_type' => MorphType::MERCHANT_OWNER_SUBMISSION,
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

    public function requestVerification(Request $request)
    {
        $request->validate([
            'reason' => [
                'nullable',
                'string',
                'sometimes',
                'min:10',
                'max:500'
            ],
        ]);

        $merchant = Auth::guard('merchant')->user();
        if (!$merchant instanceof Merchant) {
            return back()->withErrors(['message' => 'User tidak valid']);
        }

        $submission = MerchantOwnerSubmission::where('merchant_id', $merchant->id)
            ->whereIn('status', [MerchantOwnerStatus::DRAFT, MerchantOwnerStatus::REJECTED])
            ->latest()
            ->first();

        if (!$submission) {
            return back()->withErrors(['message' => 'Profil owner tidak ditemukan.']);
        }

        if (!$submission->isComplete()) {
            return back()->withErrors(['message' => 'Lengkapi data profil owner sebelum mengajukan verifikasi.']);
        }

        if ($submission->status !== MerchantOwnerStatus::DRAFT && $submission->status !== MerchantOwnerStatus::REJECTED) {
            return back()->withErrors(['message' => 'Data ini sudah dalam proses verifikasi atau sudah disetujui.']);
        }

        $admins = Admin::all();

        try {
            DB::transaction(function () use ($admins, $merchant, $submission) {
                $submission->update([
                    'status' => MerchantOwnerStatus::PENDING
                ]);

                Notification::send($admins, new VerificationRequestNotification($merchant, "Profil Owner"));

                $merchant->notify(new VerificationSubmittedNotification("Profil Owner"));
            });

            return back()->with('success', 'Verifikasi profil owner berhasil diajukan.');
        } catch (\Exception $e) {
            return back()->withErrors(['message' => 'Terjadi kesalahan sistem: ' . $e->getMessage()]);
        }
    }

    public function discard(Request $request)
    {
        $merchant = Auth::guard('merchant')->user();
        if (!$merchant instanceof Merchant) {
            return back()->withErrors(['message' => 'User tidak valid']);
        }


        if ($merchant->status !== MerchantStatus::APPROVED) {
            return back()->withErrors([
                'message' => 'Data pendaftaran awal tidak dapat dihapus.'
            ]);
        }

        try {
            DB::transaction(function () use ($merchant) {
                if ($merchant->ownerSubmission) {
                    $merchant->ownerSubmission->delete();
                }
            });

            return back();
        } catch (\Exception $e) {
            return back()->withErrors([
                'message' => 'Terjadi kesalahan sistem saat mereset data.'
            ]);
        }
    }
}
