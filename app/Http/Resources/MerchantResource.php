<?php

namespace App\Http\Resources;

use App\Http\Resources\MerchantOwnerResource;
use App\Http\Resources\MerchantPayoutMethodResource;
use App\Http\Resources\MerchantProfileResource;
use App\Http\Resources\StatusHistoryResource;
use App\Http\Resources\VenueResource;
use App\Models\Merchant;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MerchantResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $canViewXendit = $request->user()->can('viewXenditDetails', Merchant::class);
        $canViewMidtrans = $request->user()->can('viewMidtransDetails', Merchant::class);

        $ownerData = $this->ownerSubmission ?: $this->owner;
        $profileData = $this->profileSubmission ?: $this->profile;

        $payoutCollection = $this->payoutMethodSubmissions;
        $activeMethodsNotUnderReview = $this->payoutMethods->filter(function ($mainMethod) use ($payoutCollection) {
            return !$payoutCollection->pluck('payout_method_id')->contains($mainMethod->id);
        });

        $payoutCollection = $payoutCollection->concat($activeMethodsNotUnderReview);

        $primaryPayoutData = $this->primaryPayoutMethodSubmission ?: $this->primaryPayoutMethod;

        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'email_verified_at' => $this->email_verified_at,
            'phone_number' => $this->phone_number,
            'phone_verified_at' => $this->phone_verified_at,

            'midtrans_sub_account_id' => $this->when($canViewMidtrans, $this->midtrans_sub_account_id),
            'xendit_sub_account_id' => $this->when($canViewXendit, $this->xendit_sub_account_id),

            'slug' => $this->slug,
            'is_active' => (bool) $this->is_active,
            'is_reverification_required' => (bool) $this->is_reverification_required,

            'status' => $this->status,
            'status_histories' => StatusHistoryResource::collection($this->whenLoaded('statusHistories')),
            'latest_status' => new StatusHistoryResource($this->whenLoaded('latestStatusHistory')),

            'latest_submission_at' => $this->latest_submission_at,

            'logo_path' => $this->logo_path
                ? asset('storage/' . $this->logo_path)
                : null,

            'owner' => $ownerData ? new MerchantOwnerResource($ownerData) : null,
            'profile' => $profileData ? new MerchantProfileResource($profileData) : null,
            'payout_methods' => MerchantPayoutMethodResource::collection($payoutCollection),
            'primary_payout_method' => $primaryPayoutData ? new MerchantPayoutMethodResource($primaryPayoutData) : null,

            // 'profile' => new MerchantProfileResource($this->whenLoaded('profile')),
            // 'is_profile_verified' => $this->profileSubmission === null,
            // 'profile_submission' => new MerchantProfileSubmissionResource($this->whenLoaded('profileSubmission')),

            // 'owner' => new MerchantOwnerResource($this->whenLoaded('owner')),
            // 'is_owner_verified' => $this->ownerSubmission === null,
            // 'owner_submission' => new MerchantOwnerSubmissionResource($this->whenLoaded('ownerSubmission')),

            // 'payout_methods' => MerchantPayoutMethodResource::collection($this->whenLoaded('payoutMethods')),
            // 'is_payout_method_verified' => $this->payoutMethodSubmissions === null,
            // 'payout_method_submissions' => MerchantPayoutMethodSubmissionResource::collection($this->whenLoaded('payoutMethodSubmissions')),

            // 'primary_payout_method' => new MerchantPayoutMethodResource($this->whenLoaded('primaryPayoutMethod')),
            // 'is_primary_payout_method_verified' => $this->primaryPayoutMethodSubmission === null,
            // 'primary_payout_method_submission' => new MerchantPayoutMethodSubmissionResource($this->whenLoaded('primaryPayoutMethodSubmission')),

            'venues_count' => $this->whenCounted('venues'),
            'venues' => VenueResource::collection($this->whenLoaded('venues')),

            'email_verified' => $this->email_verified_at !== null,
            'phone_verified' => $this->phone_verified_at !== null,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
