<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class MerchantUpdateVerificationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $merchant = $this->route('merchant');
        $isRejected = $this->status === 'rejected';

        $needsOwnerReason = $isRejected && ($merchant->owner?->status?->value !== 'approved');
        $needsProfileReason = $isRejected && ($merchant->profile?->status?->value !== 'approved');
        $needsPayoutReason = $isRejected && ($merchant->primaryPayoutMethod?->status?->value !== 'approved');

        return [
            'status' => 'required|in:approved,rejected',
            'reason' => $isRejected ? 'required|string|min:10' : 'nullable|string',

            'reason_merchant_owner'   => $needsOwnerReason ? 'required|string|min:10' : 'nullable|string',
            'reason_merchant_profile' => $needsProfileReason ? 'required|string|min:10' : 'nullable|string',
            'reason_merchant_payout_method' => $needsPayoutReason ? 'required|string|min:10' : 'nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'reason.required' => 'Alasan penolakan utama wajib diisi.',
            'reason_merchant_owner.required' => 'Alasan penolakan data owner wajib diisi.',
            'reason_merchant_profile.required' => 'Alasan penolakan profil merchant wajib diisi.',
            'reason_merchant_payout_method.required' => 'Alasan penolakan metode pembayaran wajib diisi.',
            '*.min' => 'Catatan alasan minimal harus 10 karakter.',
            '*.string' => 'Catatan harus berupa teks.',
        ];
    }
}
