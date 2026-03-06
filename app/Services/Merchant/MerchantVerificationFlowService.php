<?php

namespace App\Services\Merchant;

use App\Enums\MerchantOwnerStatus;
use App\Enums\MerchantPayoutMethodStatus;
use App\Enums\MerchantProfileStatus;
use App\Models\Merchant;
use App\Notifications\Merchant\VerificationApprovedNotification;
use App\Notifications\Merchant\VerificationRejectedNotification;
use Illuminate\Support\Facades\DB;

class MerchantVerificationFlowService
{
    public function handleVerification(Merchant $merchant, array $data)
    {
        return DB::transaction(function () use ($merchant, $data) {
            if ($data['status'] === 'approved') {
                return $this->approveMerchant($merchant);
            }

            return $this->rejectMerchant($merchant, $data);
        });
    }

    private function approveMerchant(Merchant $merchant)
    {
        if ($merchant->owner && $merchant->owner->status === MerchantOwnerStatus::PENDING) {
            $merchant->owner->status = MerchantOwnerStatus::APPROVED;
            $merchant->owner->save();
            $merchant->notify(new VerificationApprovedNotification('Profil Owner', 'Data sudah sesuai kriteria.'));
        }

        if ($merchant->profile && $merchant->profile->status === MerchantProfileStatus::PENDING) {
            $merchant->profile->status = MerchantProfileStatus::APPROVED;
            $merchant->profile->save();
            $merchant->notify(new VerificationApprovedNotification('Profil Bisnis', 'Data sudah sesuai kriteria.'));
        }

        $payouts = $merchant->payoutMethods()->where('status', MerchantPayoutMethodStatus::PENDING)->get();
        foreach ($payouts as $payout) {
            $payout->status = MerchantPayoutMethodStatus::APPROVED;
            $payout->save();
            $merchant->notify(new VerificationApprovedNotification('Metode Pencairan Dana (Rekening)', 'Data sudah sesuai kriteria.'));
        }

        return 'Merchant dan seluruh data terkait berhasil disetujui.';
    }

    private function rejectMerchant(Merchant $merchant, array $data)
    {
        $defaultReason = $data['reason'] ?? 'Data tidak sesuai kriteria.';

        if ($merchant->owner && $merchant->owner->status === MerchantOwnerStatus::PENDING) {
            $merchant->owner->status = MerchantOwnerStatus::REJECTED;
            $merchant->owner->save();
            $reason = $data['reason_merchant_owner'] ?? $defaultReason;
            $merchant->notify(new VerificationRejectedNotification('Profil Owner', $reason));
        }

        if ($merchant->profile && $merchant->profile->status === MerchantProfileStatus::PENDING) {
            $merchant->profile->status = MerchantProfileStatus::REJECTED;
            $merchant->profile->save();
            $reason = $data['reason_merchant_profil'] ?? $defaultReason;
            $merchant->notify(new VerificationRejectedNotification('Profil Bisnis', $reason));
        }

        $payouts = $merchant->payoutMethods()->where('status', MerchantPayoutMethodStatus::PENDING)->get();
        foreach ($payouts as $payout) {
            $payout->status = MerchantPayoutMethodStatus::REJECTED;
            $payout->save();
            $reason = $data['reason_merchant_payout_method'] ?? $defaultReason;
            $merchant->notify(new VerificationRejectedNotification('Metode Pencairan Dana (Rekening)', $reason));
        }

        return 'Verifikasi merchant telah ditolak.';
    }
}
