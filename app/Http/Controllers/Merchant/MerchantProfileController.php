<?php

namespace App\Http\Controllers\Merchant;

use App\Enums\AddressLabel;
use App\Enums\MerchantProfileStatus;
use App\Enums\MerchantStatus;
use App\Enums\MorphType;
use App\Helpers\NumberPhoneHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\Merchant\MerchantProfileUpdateRequest;
use App\Http\Resources\MerchantResource;
use App\Http\Resources\VenueResource;
use App\Models\Admin;
use App\Models\Merchant;
use App\Models\MerchantProfileSubmission;
use App\Models\Venue;
use App\Notifications\Admin\VerificationRequestNotification;
use App\Notifications\Merchant\VerificationSubmittedNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;
use Inertia\Inertia;
use Inertia\Response;

class MerchantProfileController extends Controller
{

    public function index(Request $request): Response
    {
        $merchant = $request->user();
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
            'socialMedia',
        ]);

        $venues = Venue::where('merchant_id', $merchant->id)
            ->with([
                'courts' => function ($query) {
                    $query->select('id', 'venue_id', 'court_surface_id', 'name', 'slug');
                },
                'courts.surface',
                'address.province',
                'address.city',
                'address.district',
                'address.village'
            ])
            ->latest()
            ->get();

        return Inertia::render('Merchant/Profile/Index', [
            'merchant' => new MerchantResource($merchant),
            'venues' => VenueResource::collection($venues),
        ]);
    }

    public function update(MerchantProfileUpdateRequest $request)
    {
        $merchant = Auth::guard('merchant')->user();
        if (!$merchant instanceof Merchant) {
            return back()->withErrors(['message' => 'User tidak valid']);
        }

        $submission = $merchant->profileSubmission;

        if ($submission && $submission->status === MerchantProfileStatus::PENDING) {
            return back()->withErrors(['message' => 'Data sedang dalam proses verifikasi dan tidak dapat diubah.']);
        }

        $validated = $request->validated();

        try {
            DB::transaction(function () use ($validated, $merchant, $submission) {
                $data = [
                    'business_name' => $validated['business_name'],
                    'business_email' => $validated['business_email'],
                    'business_phone_number' => NumberPhoneHelper::normalize($validated['business_phone_number']),
                    'business_type' => $validated['business_type'],
                    'nib' => $validated['nib'],
                    'status' => MerchantProfileStatus::DRAFT,
                ];

                if ($submission && $submission->status === MerchantProfileStatus::APPROVED) {
                    $updateData = $merchant->profileSubmissions()->create($data);
                } else {
                    $updateData = $submission ?? new MerchantProfileSubmission(['merchant_id' => $merchant->id]);
                    $updateData->fill($data);
                    $updateData->save();
                }

                $this->updateAddress($updateData, $validated);
            });

            return back()->with('success', 'Profil Mitra berhasil diperbarui dan sedang menunggu verifikasi.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['message' => 'Terjadi kesalahan: ' . $e->getMessage()]);
        }
    }

    private function updateAddress($updateData, $validated)
    {
        $updateData->address()->updateOrCreate(
            [
                'addressable_id' => $updateData->id,
                'addressable_type' => MorphType::MERCHANT_PROFILE_SUBMISSION,
                'label' => AddressLabel::BUSINESS
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

        $submission = MerchantProfileSubmission::where('merchant_id', $merchant->id)
            ->whereIn('status', [MerchantProfileStatus::DRAFT, MerchantProfileStatus::REJECTED])
            ->latest()
            ->first();

        if (!$submission) {
            return back()->withErrors(['message' => 'Profil bisnis tidak ditemukan.']);
        }

        if (!$submission->isComplete()) {
            return back()->withErrors(['message' => 'Lengkapi data profil bisnis Mitra sebelum mengajukan verifikasi.']);
        }

        if ($submission->status !== MerchantProfileStatus::DRAFT && $submission->status !== MerchantProfileStatus::REJECTED) {
            return back()->withErrors(['message' => 'Data ini sudah dalam proses verifikasi atau sudah disetujui.']);
        }

        $admins = Admin::all();

        try {
            DB::transaction(function () use ($admins, $merchant, $submission) {
                $submission->update([
                    'status' => MerchantProfileStatus::PENDING
                ]);

                Notification::send($admins, new VerificationRequestNotification($merchant, "Profil Bisnis"));

                $merchant->notify(new VerificationSubmittedNotification("Profil Bisnis"));
            });

            return back()->with('success', 'Verifikasi Profil Bisnis berhasil diajukan.');
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
                if ($merchant->profileSubmission) {
                    $merchant->profileSubmission->delete();
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
