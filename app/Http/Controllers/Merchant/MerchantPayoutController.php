<?php

namespace App\Http\Controllers\Merchant;

use App\Enums\MerchantPayoutMethodStatus;
use App\Enums\MerchantStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Merchant\MerchantPayoutMethodUpdateRequest;
use App\Models\Admin;
use App\Models\Merchant;
use App\Models\MerchantPayoutMethod;
use App\Models\MerchantPayoutMethodSubmission;
use App\Notifications\Admin\VerificationRequestNotification;
use App\Notifications\Merchant\VerificationSubmittedNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;

class MerchantPayoutController extends Controller
{
    public function store(MerchantPayoutMethodUpdateRequest $request)
    {
        $merchant = Auth::guard('merchant')->user();
        if (!$merchant instanceof Merchant) {
            return back()->withErrors(['message' => 'User tidak valid']);
        }

        $validated = $request->validated();

        try {
            DB::transaction(function () use ($validated, $merchant) {
                $hasMain = $merchant->payoutMethods()->exists();
                $hasShadow = $merchant->payoutMethodSubmissions()->exists();
                $isFirst = !$hasMain && !$hasShadow;

                $merchant->payoutMethodSubmissions()->create([
                    'payout_method_id' => null,
                    'type' => $validated['type'],
                    'provider_name' => $validated['provider_name'],
                    'account_number' => $validated['account_number'],
                    'account_holder_name' => $validated['account_holder_name'],
                    'is_primary' => $isFirst,
                    'status' => MerchantPayoutMethodStatus::DRAFT,
                ]);
            });

            return back()->with('success', 'Data Rekening berhasil ditambahkan dan menunggu verifikasi.');
        } catch (\Exception $e) {
            return back()->withErrors(['message' => 'Gagal menyimpan data: ' . $e->getMessage()]);
        }
    }

    public function update(MerchantPayoutMethodUpdateRequest $request, $id)
    {
        $merchant = Auth::guard('merchant')->user();
        if (!$merchant instanceof Merchant) {
            return back()->withErrors(['message' => 'User tidak valid']);
        }

        $submission = MerchantPayoutMethodSubmission::where('merchant_id', $merchant->id)->findOrFail($id);

        if ($submission && $submission->status === MerchantPayoutMethodStatus::PENDING) {
            return back()->withErrors(['message' => 'Data sedang dalam proses verifikasi dan tidak dapat diubah.']);
        }

        $validated = $request->validated();

        try {
            DB::transaction(function () use ($validated, $merchant, $submission) {
                if ($submission->status === MerchantPayoutMethodStatus::APPROVED) {
                    Log::info("Status APPROVED detect. Membuat baris shadow baru untuk merchant: {$merchant->id}");

                    MerchantPayoutMethodSubmission::create([
                        'merchant_id'         => $merchant->id,
                        'payout_method_id'    => $submission->payout_method_id,
                        'type'                => $validated['type'],
                        'provider_name'       => $validated['provider_name'],
                        'account_number'      => $validated['account_number'],
                        'account_holder_name' => $validated['account_holder_name'],
                        'is_primary'          => $submission->is_primary ?? 0,
                        'status'              => MerchantPayoutMethodStatus::DRAFT,
                    ]);
                } else {
                    $submission->update([
                        'type'                => $validated['type'],
                        'provider_name'       => $validated['provider_name'],
                        'account_number'      => $validated['account_number'],
                        'account_holder_name' => $validated['account_holder_name'],
                        'status'              => MerchantPayoutMethodStatus::DRAFT,
                    ]);
                }
            });


            return back()->with('success', 'Data rekening berhasil diperbarui.');
        } catch (\Exception $e) {
            return back()->withErrors(['message' => 'Gagal memperbarui data: ' . $e->getMessage()]);
        }
    }

    public function requestVerification(Request $request, $id)
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

        $submission = MerchantPayoutMethodSubmission::where('merchant_id', $merchant->id)
            ->whereIn('status', [MerchantPayoutMethodStatus::DRAFT, MerchantPayoutMethodStatus::REJECTED])
            ->findOrFail($id);

        if (!$submission->isComplete()) {
            return back()->withErrors(['message' => 'Lengkapi data pencairan dana (rekening) Mitra sebelum mengajukan verifikasi.']);
        }

        if ($submission->status !== MerchantPayoutMethodStatus::DRAFT && $submission->status !== MerchantPayoutMethodStatus::REJECTED) {
            return back()->withErrors(['message' => 'Data ini sudah dalam proses verifikasi atau sudah disetujui.']);
        }

        $admins = Admin::all();

        try {
            DB::transaction(function () use ($admins, $merchant, $submission) {
                $submission->update([
                    'status' => MerchantPayoutMethodStatus::PENDING
                ]);

                Notification::send($admins, new VerificationRequestNotification($merchant, "Metode Pencairan Dana"));

                $merchant->notify(new VerificationSubmittedNotification("Metode Pencairan Dana"));
            });

            return back()->with('success', 'Verifikasi pencairan dana berhasil diajukan.');
        } catch (\Exception $e) {
            return back()->withErrors(['message' => 'Terjadi kesalahan sistem: ' . $e->getMessage()]);
        }
    }

    public function destroy($id)
    {
        $merchant = Auth::guard('merchant')->user();
        if (!$merchant instanceof Merchant) {
            return back()->withErrors(['message' => 'User tidak valid']);
        }

        $submission = $merchant->payoutMethodSubmissions()->find($id);

        try {
            return DB::transaction(function () use ($merchant, $submission, $id) {
                if ($submission && !$submission->payout_method_id) {
                    if ($submission->is_primary) {
                        throw new \Exception('Rekening utama (draft) tidak dapat dihapus.');
                    }
                    $submission->delete();
                    return back()->with('success', 'Draft rekening berhasil dihapus.');
                }

                $mainMethodId = $submission ? $submission->payout_method_id : $id;
                $payout = $merchant->payoutMethods()->findOrFail($mainMethodId);

                if ($merchant->payoutMethods()->count() <= 1) {
                    throw new \Exception('Anda harus memiliki minimal satu rekening aktif.');
                }

                if ($payout->is_primary) {
                    throw new \Exception('Rekening utama tidak dapat dihapus. Silakan set rekening lain sebagai utama terlebih dahulu.');
                }

                $merchant->payoutMethodSubmissions()->where('payout_method_id', $payout->id)->delete();
                $payout->delete();

                return back()->with('success', 'Data Rekening berhasil dihapus.');
            });
        } catch (\Exception $e) {
            return back()->withErrors(['message' => $e->getMessage()]);
        }
    }

    public function setPrimary($id)
    {
        $merchant = Auth::guard('merchant')->user();
        if (!$merchant instanceof Merchant) {
            return back()->withErrors(['message' => 'User tidak valid']);
        }

        $newPrimary = MerchantPayoutMethod::where('merchant_id', $merchant->id)->findOrFail($id);

        try {
            DB::transaction(function () use ($merchant, $newPrimary) {
                MerchantPayoutMethod::where('merchant_id', $merchant->id)
                    ->update(['is_primary' => false]);

                $newPrimary->update(['is_primary' => true]);

                $merchant->payoutMethodSubmissions()
                    ->update(['is_primary' => false]);

                $merchant->payoutMethodSubmissions()
                    ->where('payout_method_id', $newPrimary->id)
                    ->update(['is_primary' => true]);
            });

            return back()->with('success', 'Rekening utama berhasil diubah.');
        } catch (\Exception $e) {
            return back()->withErrors(['message' => 'Gagal mengubah rekening utama.']);
        }
    }


    public function discard(Request $request, $id)
    {
        $merchant = Auth::guard('merchant')->user();
        if (!$merchant instanceof Merchant) {
            return back()->withErrors(['message' => 'User tidak valid']);
        }

        $submission = MerchantPayoutMethodSubmission::where('merchant_id', $merchant->id)
            ->findOrFail($id);

        if ($merchant->status !== MerchantStatus::APPROVED || is_null($submission->payout_method_id)) {
            return back()->withErrors([
                'message' => 'Aksi tidak diizinkan untuk data baru.'
            ]);
        }

        try {
            DB::transaction(function () use ($submission) {
                $submission->delete();
            });

            return back();
        } catch (\Exception $e) {
            return back()->withErrors([
                'message' => 'Terjadi kesalahan saat membatalkan perubahan.'
            ]);
        }
    }
}
