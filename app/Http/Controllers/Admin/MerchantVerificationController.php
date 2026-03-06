<?php

namespace App\Http\Controllers\Admin;

use App\Enums\AddressLabel;
use App\Enums\MerchantOwnerStatus;
use App\Enums\MerchantPayoutMethodStatus;
use App\Enums\MerchantProfileStatus;
use App\Enums\MorphType;
use App\Http\Controllers\Admin\Controller;
use App\Http\Requests\Admin\MerchantUpdateVerificationRequest;
use App\Http\Resources\MerchantResource;
use App\Models\Merchant;
use App\Notifications\Merchant\VerificationApprovedNotification;
use App\Notifications\Merchant\VerificationRejectedNotification;
use App\Services\Merchant\MerchantVerificationFlowService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\Enum;
use Inertia\Inertia;
use Log;

class MerchantVerificationController extends Controller
{
    public function index(Merchant $merchant)
    {
        $merchant->load([
            'statusHistories',
            'latestStatusHistory',
            'owner.latestStatusHistory',
            'owner.address.province',
            'owner.address.city',
            'owner.address.district',
            'owner.address.village',
            'ownerSubmission.latestStatusHistory',
            'ownerSubmission.address.province',
            'ownerSubmission.address.city',
            'ownerSubmission.address.district',
            'ownerSubmission.address.village',
            'profile.latestStatusHistory',
            'profile.address.province',
            'profile.address.city',
            'profile.address.district',
            'profile.address.village',
            'profileSubmission.latestStatusHistory',
            'profileSubmission.address.province',
            'profileSubmission.address.city',
            'profileSubmission.address.district',
            'profileSubmission.address.village',
            'payoutMethods.latestStatusHistory',
            'payoutMethodSubmissions.latestStatusHistory',
        ]);

        return Inertia::render('Admin/Merchants/Verification', [
            'merchant' => new MerchantResource($merchant),
        ]);
    }

    public function updateAllVerification(
        MerchantUpdateVerificationRequest $request,
        Merchant $merchant,
        MerchantVerificationFlowService $flowService
    ) {

        try {
            $message = $flowService->handleVerification($merchant, $request->validated());

            return redirect()->route('admin.merchants.index')->with('success', $message);
        } catch (\Throwable $e) {
            Log::error("Gagal verifikasi merchant ID {$merchant->id}: " . $e->getMessage());

            return back()->with('error', 'Terjadi kesalahan sistem.');
        }
    }

    public function updateMerchantOwnerVerification(Request $request, Merchant $merchant)
    {
        $request->validate([
            'status' => ['required', new Enum(MerchantOwnerStatus::class)],
            'reason' => [
                'required_if:status,rejected',
                'nullable',
                'string',
                'sometimes',
                'min:10',
                'max:500'
            ],
        ]);

        $submission = $merchant->ownerSubmission;

        $oldOwner = $merchant->owner;

        try {
            DB::transaction(function () use ($request, $merchant, $submission, $oldOwner) {
                if ($request->status === MerchantOwnerStatus::APPROVED->value) {
                    $submission->update(['status' => $request->status]);

                    $dataToSync = collect($submission->toArray())
                        ->except(['id', 'status', 'created_at', 'updated_at'])
                        ->merge(['status' => MerchantOwnerStatus::APPROVED])
                        ->toArray();

                    $owner = $merchant->owner()->updateOrCreate(
                        ['merchant_id' => $merchant->id],
                        $dataToSync
                    );

                    $fileUploads = ['photo_path', 'ktp_photo_path', 'selfie_photo_path'];
                    foreach ($fileUploads as $upload) {
                        if ($submission->$upload && $oldOwner && $oldOwner->$upload && $oldOwner->$upload !== $submission->$upload) {
                            Storage::disk('public')->delete($oldOwner->$upload);
                        }
                    }

                    if ($submission->address) {
                        $owner->address()->updateOrCreate(
                            [
                                'addressable_id' => $owner->id,
                                'addressable_type' => MorphType::MERCHANT_OWNER,
                                'label' => AddressLabel::LEGAL
                            ],
                            collect($submission->address->toArray())
                                ->except(['id', 'addressable_id', 'addressable_type', 'created_at', 'updated_at'])
                                ->toArray()
                        );
                    }

                    $merchant->notify(new VerificationApprovedNotification('Profil Owner', 'Data sudah sesuai kriteria.'));
                } elseif ($request->status === MerchantOwnerStatus::REJECTED->value) {
                    $submission->update(['status' => $request->status]);
                    $merchant->notify(new VerificationRejectedNotification('Profil Owner', $request->reason));
                }
            });

            return back()->with('success', 'Verifikasi data pemilik berhasil diperbarui.');
        } catch (\Exception $e) {
            return back()->withErrors(['message' => 'Gagal memperbarui status: ' . $e->getMessage()]);
        }
    }

    public function updateMerchantProfileVerification(Request $request, Merchant $merchant)
    {
        $request->validate([
            'status' => ['required', new Enum(MerchantProfileStatus::class)],
            'reason' => [
                'required_if:status,rejected',
                'nullable',
                'string',
                'sometimes',
                'min:10',
                'max:500'
            ],
        ]);

        $submission = $merchant->profileSubmission;

        try {
            DB::transaction(function () use ($request, $merchant, $submission) {
                if ($request->status === MerchantProfileStatus::APPROVED->value) {
                    $submission->update(['status' => $request->status]);

                    $dataToSync = collect($submission->toArray())
                        ->except(['id', 'status', 'created_at', 'updated_at'])
                        ->merge(['status' => MerchantProfileStatus::APPROVED])
                        ->toArray();

                    $profile = $merchant->profile()->updateOrCreate(
                        ['merchant_id' => $merchant->id],
                        $dataToSync
                    );

                    if ($submission->address) {
                        $profile->address()->updateOrCreate(
                            [
                                'addressable_id' => $profile->id,
                                'addressable_type' => MorphType::MERCHANT_PROFILE,
                                'label' => AddressLabel::BUSINESS
                            ],
                            collect($submission->address->toArray())
                                ->except(['id', 'addressable_id', 'addressable_type', 'created_at', 'updated_at'])
                                ->toArray()
                        );
                    }

                    $merchant->notify(new VerificationApprovedNotification('Profil Bisnis', 'Data sudah sesuai kriteria.'));
                } elseif ($request->status === MerchantProfileStatus::REJECTED->value) {
                    $submission->update(['status' => $request->status]);
                    $merchant->notify(new VerificationRejectedNotification('Profil Bisnis', $request->reason));
                }
            });

            return back()->with('success', 'Verifikasi profil bisnis berhasil diperbarui.');
        } catch (\Exception $e) {
            return back()->withErrors(['message' => 'Gagal memperbarui status: ' . $e->getMessage()]);
        }
    }

    public function updatePayoutMethodVerification(Request $request, Merchant $merchant, $payout_method)
    {
        $request->validate([
            'status' => ['required', new Enum(MerchantPayoutMethodStatus::class)],
            'reason' => [
                'required_if:status,rejected',
                'nullable',
                'string',
                'sometimes',
                'min:10',
                'max:500'
            ],
        ]);

        $submission = $merchant->payoutMethodSubmissions()->findOrFail($payout_method);

        try {
            DB::transaction(function () use ($request, $merchant, $submission) {
                if ($request->status === MerchantPayoutMethodStatus::APPROVED->value) {

                    $submission->update(['status' => $request->status]);

                    $hasActiveMethod = $merchant->payoutMethods()->exists();

                    $shouldBePrimary = $submission->is_primary || !$hasActiveMethod;

                    $dataToSync = collect($submission->toArray())
                        ->except(['id', 'status', 'created_at', 'updated_at', 'payout_method_id'])
                        ->merge([
                            'status' => MerchantPayoutMethodStatus::APPROVED,
                            'is_primary' => $shouldBePrimary
                        ])
                        ->toArray();

                    $mainMethod = $merchant->payoutMethods()->updateOrCreate(
                        ['id' => $submission->payout_method_id],
                        $dataToSync
                    );

                    if (!$submission->payout_method_id) {
                        $submission->update(['payout_method_id' => $mainMethod->id]);
                    }

                    if ($shouldBePrimary) {
                        $merchant->payoutMethods()->where('id', '!=', $mainMethod->id)->update(['is_primary' => false]);

                        $merchant->payoutMethodSubmissions()->update(['is_primary' => false]);
                    }

                    $merchant->notify(new VerificationApprovedNotification('Metode Pencairan Dana', 'Data disetujui.'));
                } elseif ($request->status === MerchantPayoutMethodStatus::REJECTED->value) {
                    $submission->update(['status' => $request->status]);

                    $merchant->notify(new VerificationRejectedNotification('Metode Pencairan Dana (Rekening)', $request->reason));
                }
            });

            return back()->with('success', 'Status rekening berhasil diperbarui.');
        } catch (\Exception $e) {
            return back()->withErrors(['message' => 'Gagal memperbarui status: ' . $e->getMessage()]);
        }
    }
}
