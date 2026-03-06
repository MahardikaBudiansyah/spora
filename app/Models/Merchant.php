<?php

namespace App\Models;

use App\Enums\MerchantOwnerStatus;
use App\Enums\MerchantPayoutMethodStatus;
use App\Enums\MerchantProfileStatus;
use App\Enums\MerchantStatus;
use App\Models\MerchantOwner;
use App\Models\MerchantPayoutMethod;
use App\Models\MerchantPayoutMethodSubmission;
use App\Models\MerchantProfile;
use App\Models\MerchantStaffRole;
use App\Models\Shift;
use App\Models\Staff;
use App\Models\Subscription;
use App\Models\SubscriptionMerchant;
use App\Models\Venue;
use App\Notifications\Merchant\MerchantVerificationApprovedNotification;
use App\Notifications\Merchant\MerchantVerificationRejectedNotification;
use App\Services\Billing\Gateways\XenditService;
use App\Traits\HasNotifications;
use App\Traits\HasPassword;
use App\Traits\HasSocialMedia;
use App\Traits\HasStatusHistory;
use Cviebrock\EloquentSluggable\Sluggable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Collection;

class Merchant extends Authenticatable
{
    use HasFactory, Notifiable, Sluggable, SoftDeletes, HasPassword, HasStatusHistory, HasSocialMedia, HasNotifications {
        HasNotifications::notifications insteadof Notifiable;
        HasNotifications::readNotifications insteadof Notifiable;
        HasNotifications::unreadNotifications insteadof Notifiable;
        Notifiable::notifications as laravelNotifications;
        Notifiable::unreadNotifications as laravelUnreadNotifications;
    }

    protected $guard = 'merchants';

    protected $fillable = [
        'name',
        'email',
        'email_verified_at',
        'pending_email',
        'password',
        'phone_number',
        'phone_verified_at',
        'logo_path',
        'midtrans_sub_account_id',
        'xendit_sub_account_id',
        'status',
        'is_active',
        'is_reverification_required',
        'slug',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'status' => MerchantStatus::class,
        'email_verified_at' => 'datetime',
        'phone_verified_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    protected $attributes = [
        'is_active' => false,
        'is_reverification_required' => false,
        'status' => MerchantStatus::DRAFT,
    ];

    public function sluggable(): array
    {
        return [
            'slug' => [
                'source' => 'name',
                'separator' => '-',
                'unique' => true,
            ]
        ];
    }

    protected $appends = ['latest_submission_at'];

    public function getLatestSubmissionAtAttribute()
    {
        $dates = [
            $this->profileSubmission?->status === MerchantProfileStatus::PENDING
                ? $this->profileSubmission->updated_at : null,
            $this->ownerSubmission?->status === MerchantOwnerStatus::PENDING
                ? $this->ownerSubmission->updated_at : null,
            $this->payoutMethodSubmissions
                ->where('status', MerchantPayoutMethodStatus::PENDING)
                ->max('updated_at'),
        ];

        return collect($dates)->filter()->max();
    }

    public function syncVerificationStatus()
    {
        $this->load([
            'profile',
            'profileSubmission',
            'owner',
            'ownerSubmission',
            'payoutMethods',
            'payoutMethodSubmissions',
            'primaryPayoutMethod',
            'primaryPayoutMethodSubmission'
        ]);

        $payoutMethod = $this->primaryPayoutMethod instanceof Collection
            ? $this->primaryPayoutMethod->first()
            : $this->primaryPayoutMethod;

        $isProfileApproved = $this->profile?->status === MerchantProfileStatus::APPROVED;
        $isOwnerApproved = $this->owner?->status === MerchantOwnerStatus::APPROVED;
        $isPayoutApproved = $payoutMethod?->status === MerchantPayoutMethodStatus::APPROVED;

        $hasPendingProfile = $this->profileSubmission?->status === MerchantProfileStatus::PENDING;
        $hasPendingOwner = $this->ownerSubmission?->status === MerchantOwnerStatus::PENDING;
        $hasPendingPayout = $this->payoutMethodSubmissions()->where('status', MerchantPayoutMethodStatus::PENDING)->exists();

        $isProfileRejected = $this->profile?->status === MerchantProfileStatus::REJECTED;
        $isOwnerRejected = $this->owner?->status === MerchantOwnerStatus::REJECTED;
        $isPayoutRejected = $payoutMethod?->status === MerchantPayoutMethodStatus::REJECTED;

        $isProfileReady = in_array($this->profile?->status, [MerchantProfileStatus::PENDING, MerchantProfileStatus::APPROVED]);
        $isOwnerReady = in_array($this->owner?->status, [MerchantOwnerStatus::PENDING, MerchantOwnerStatus::APPROVED]);
        $isPayoutReady = $payoutMethod && in_array($payoutMethod->status, [MerchantPayoutMethodStatus::PENDING, MerchantPayoutMethodStatus::APPROVED]);

        $reverificationRequired = $hasPendingProfile || $hasPendingOwner || $hasPendingPayout;

        $canSubmitForVerification = $isProfileReady && $isOwnerReady && $isPayoutReady;

        if ($isProfileApproved && $isOwnerApproved && $isPayoutApproved) {
            $this->update(['is_reverification_required' => $reverificationRequired]);

            if ($this->status !== MerchantStatus::APPROVED) {
                $this->update([
                    'status' => MerchantStatus::APPROVED,
                    'is_active' => true,
                ]);

                if ($this->getOriginal('status') !== MerchantStatus::APPROVED) {
                    $this->ensureXenditAccountExists();
                    $this->notify(new MerchantVerificationApprovedNotification($this));
                }
            }
        } elseif ($isProfileRejected || $isOwnerRejected || $isPayoutRejected) {
            if ($this->status !== MerchantStatus::REJECTED) {
                $this->update([
                    'status' => MerchantStatus::REJECTED,
                    'is_active' => false,
                    'is_reverification_required' => false
                ]);

                $cause = $isProfileRejected ? 'Profil Bisnis' : ($isOwnerRejected ? 'Profil Owner' : 'Metode Pencairan Dana (Rekening)');
                $this->recordStatusHistory("Verifikasi ditolak karena masalah pada Data {$cause}.");
                $this->notify(new MerchantVerificationRejectedNotification($this));
            }
        } elseif ($canSubmitForVerification) {
            if (in_array($this->status, [MerchantStatus::DRAFT, MerchantStatus::REJECTED])) {
                $this->update(['status' => MerchantStatus::PENDING, 'is_active' => false, 'is_reverification_required' => false]);
            }
        } else {
            if (in_array($this->status, [MerchantStatus::PENDING, MerchantStatus::REJECTED, MerchantStatus::APPROVED])) {
                $this->update(['status' => MerchantStatus::DRAFT, 'is_active' => false]);
            }
        }
    }

    protected function ensureXenditAccountExists()
    {
        if (!$this->xendit_sub_account_id) {
            $xenditService = app(XenditService::class);

            try {
                $xenditAccount = $xenditService->createSubAccount([
                    'external_id' => 'MERCHANT-' . $this->id . '-' . time(),
                    'business_name' => $this->name,
                    'email' => $this->email,
                    'mobile_number' => $this->phone_number,
                ]);

                $this->updateQuietly([
                    'xendit_sub_account_id' => (string) $xenditAccount['id']
                ]);

                \Log::info("Xendit Sub-Account created for Merchant ID: {$this->id}");
            } catch (\Exception $e) {
                \Log::error("Gagal buat Xendit untuk Merchant {$this->id}: " . $e->getMessage());
            }
        }
    }

    public function owner()
    {
        return $this->hasOne(MerchantOwner::class);
    }

    public function ownerSubmission()
    {
        return $this->hasOne(MerchantOwnerSubmission::class)
            ->whereIn('status', [MerchantOwnerStatus::DRAFT, MerchantOwnerStatus::PENDING, MerchantOwnerStatus::REJECTED])
            ->latestOfMany();
    }

    public function profile()
    {
        return $this->hasOne(MerchantProfile::class);
    }

    public function profileSubmission()
    {
        return $this->hasOne(MerchantProfileSubmission::class)
            ->whereIn('status', [MerchantProfileStatus::DRAFT, MerchantProfileStatus::PENDING, MerchantProfileStatus::REJECTED])
            ->latestOfMany();
    }

    public function payoutMethods()
    {
        return $this->hasMany(MerchantPayoutMethod::class);
    }

    public function payoutMethodSubmissions()
    {
        return $this->hasMany(MerchantPayoutMethodSubmission::class)
            ->whereIn('status', [MerchantPayoutMethodStatus::DRAFT, MerchantPayoutMethodStatus::PENDING, MerchantPayoutMethodStatus::REJECTED])
            ->latest();
    }

    public function primaryPayoutMethod()
    {
        return $this->hasOne(MerchantPayoutMethod::class)->where('is_primary', true);
    }

    public function primaryPayoutMethodSubmission()
    {
        return $this->hasOne(MerchantPayoutMethodSubmission::class)
            ->whereIn('status', [MerchantPayoutMethodStatus::DRAFT, MerchantPayoutMethodStatus::PENDING, MerchantPayoutMethodStatus::REJECTED])
            ->where('is_primary', true)
            ->latestOfMany();
    }

    public function staff()
    {
        return $this->hasMany(Staff::class);
    }

    public function shifts()
    {
        return $this->hasMany(Shift::class);
    }

    public function staffRoles()
    {
        return $this->hasMany(MerchantStaffRole::class);
    }

    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }

    public function activeSubscription()
    {
        return $this->hasOneThrough(
            SubscriptionMerchant::class,
            Subscription::class,
            'merchant_id',
            'subscription_id',
        )->where('subscription_merchants.is_active', true);
    }

    public function venues()
    {
        return $this->hasMany(Venue::class);
    }

    public function venuesWithAddresses()
    {
        return $this->venues()->with([
            'addresses.village',
            'addresses.district',
            'addresses.city',
            'addresses.province'
        ]);
    }
}
