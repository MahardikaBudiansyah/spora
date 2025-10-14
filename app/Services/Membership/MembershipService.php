<?php

namespace App\Services\Membership;

use Carbon\Carbon;
use App\Models\Membership;
use Illuminate\Support\Str;
use App\Helpers\OrderHelper;
use App\Models\MembershipUser;
use App\Helpers\MembershipHelper;
use App\Models\MembershipPackage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Services\Billing\InvoiceService;
use App\Services\Billing\PaymentService;

class MembershipService
{
    protected function generateOrderNo(int $venueId, int $userId): string
    {
        return OrderHelper::generateOrderNo('MEM', $venueId, $userId);
    }

    protected function generateMemberNo(int $merchantId, int $venueId, int $userId): string
    {
        return MembershipHelper::generateMemberNo($merchantId, $venueId, $userId);
    }

    /**
     * Membuat membership baru (otomatis menghitung antrian jika masih ada membership aktif)
     */
    public function createMembership(int $userId, array $data): Membership
    {
        return DB::transaction(function () use ($userId, $data) {
            $package = MembershipPackage::with(['discounts', 'venue'])->findOrFail($data['membership_package_id']);
            $venue = $package->venue;
            $merchantId = $venue?->merchant_id;

            if (!$merchantId) {
                throw new \Exception('Merchant ID tidak ditemukan untuk venue ini.');
            }

            $membershipUser = MembershipUser::firstOrCreate(
                [
                    'user_id'  => $userId,
                    'venue_id' => $data['venue_id'],
                ],
                [
                    'member_no' => $this->generateMemberNo($merchantId, $data['venue_id'], $userId),
                    'notes'     => $data['notes'] ?? null,
                    'slug'      => Str::slug("membership_user_{$userId}_{$data['venue_id']}_" . now()->timestamp),
                    'is_active' => true,
                ]
            );

            $startDate = MembershipHelper::getNextMembershipStartDate($userId, $data['venue_id']);

            if (isset($data['start_date'])) {
                $manualStart = Carbon::parse($data['start_date']);
                if ($manualStart->gt($startDate)) {
                    $startDate = $manualStart;
                }
            }

            $period = MembershipHelper::calculatePeriod($startDate, $package->duration_months);
            $discountLimit = $package->discounts->max('discount_limit');

            $hasPending = Membership::where('membership_user_id', $membershipUser->id)
                ->whereIn('status', ['pending', 'unpaid'])
                ->exists();

            if ($hasPending) {
                throw new \Exception('Masih ada membership sebelumnya yang belum dibayar.');
            }

            // 🔧 Tentukan status dan antrian
            $isQueued = MembershipHelper::shouldBeQueued($userId, $data['venue_id']);
            $status = 'pending';

            $membership = Membership::create([
                'membership_user_id'        => $membershipUser->id,
                'membership_package_id'     => $package->id,
                'order_no'                  => $this->generateOrderNo($data['venue_id'], $userId),
                'total_price'               => $package->price,
                'start_date'                => $period['start_date'],
                'end_date'                  => $period['end_date'],
                'remaining_discount_limits' => $discountLimit,
                'status'                    => $status,
                'is_queued'                 => $isQueued,
            ]);

            return $membership;
        });
    }

    // 🧾 Invoice & Payment tetap sama seperti punyamu
    public function createInvoice(Membership $membership, string $status = 'unpaid')
    {
        return app(InvoiceService::class)->createInvoice(
            $membership,
            $membership->total_price,
            $status
        );
    }

    public function createPayment($invoice, array $customerData, $user)
    {
        $paymentService = app(PaymentService::class);

        $paymentData = [
            'type' => 'full_payment',
            'customer' => [
                'name' => $customerData['name'] ?? $user->name,
                'phone_number' => $customerData['phone_number'] ?? null,
            ],
        ];

        $result = $paymentService->createGatewayPayment(
            $invoice,
            $invoice->total_amount,
            $paymentData,
            $user
        );

        $payment = $result['data'];
        $snapToken = $result['snap_token'];

        return [$payment, $snapToken];
    }

    public function purchaseMembership(int $userId, array $data, array $customerData, $user)
    {
        return DB::transaction(function () use ($userId, $data, $customerData, $user) {
            $membership = $this->createMembership($userId, $data);
            $membership->load('membershipUser.user');

            $membershipUser = $membership->membershipUser;
            $invoice = $this->createInvoice($membership);
            [$payment, $snapToken] = $this->createPayment($invoice, $customerData, $user);

            return compact('membershipUser', 'membership', 'invoice', 'payment', 'snapToken');
        });
    }

    public function autoActivateQueuedMemberships(): int
    {
        $today = now()->toDateString();

        $queuedMemberships = Membership::where('status', 'active')
            ->where('is_queued', true)
            ->whereDate('start_date', '<=', $today)
            ->get();

        $count = 0;

        foreach ($queuedMemberships as $membership) {
            $membership->update([
                'is_queued' => false,
            ]);
            $count++;
            Log::info("Membership #{$membership->id} keluar dari antrian dan aktif penuh.");
        }

        return $count;
    }


    public function autoExpireMemberships(): int
    {
        $today = now()->toDateString();

        $count = Membership::where('status', 'active')
            ->whereDate('end_date', '<', $today)
            ->update(['status' => 'expired']);

        if ($count > 0) {
            Log::info("{$count} membership otomatis expired hari ini.");
        }

        return $count;
    }
}
