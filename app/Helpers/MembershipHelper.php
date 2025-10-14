<?php

namespace App\Helpers;

use Carbon\Carbon;
use App\Models\Membership;
use App\Models\MembershipUser;

class MembershipHelper
{
    /**
     * Generate unique member number untuk user di suatu venue.
     */
    public static function generateMemberNo(int $merchantId, int $venueId, int $userId): string
    {
        $random = mt_rand(100000, 999999);
        return "M{$merchantId}V{$venueId}U{$userId}{$random}";
    }

    /**
     * Hitung tanggal mulai dan berakhir membership.
     *
     * @param string|Carbon $startDate
     * @param int $durationMonths
     * @return array{start_date: string, end_date: string}
     */
    public static function calculatePeriod($startDate, int $durationMonths): array
    {
        $start = $startDate instanceof Carbon
            ? $startDate->copy()
            : Carbon::parse($startDate);

        $end = $start->copy()->addMonths($durationMonths)->subDay();

        return [
            'start_date' => $start->toDateString(),
            'end_date'   => $end->toDateString(),
        ];
    }

    /**
     * Ambil tanggal mulai membership berikutnya untuk user di venue tertentu.
     * Jika masih ada membership aktif, mulai setelah berakhir.
     * Jika belum pernah ada, mulai hari ini.
     */
    public static function getNextMembershipStartDate(int $userId, int $venueId): Carbon
    {
        $membershipUser = MembershipUser::where('user_id', $userId)
            ->where('venue_id', $venueId)
            ->first();

        // Belum punya membership_user sama sekali → mulai hari ini
        if (!$membershipUser) {
            return Carbon::today();
        }

        $lastMembership = Membership::where('membership_user_id', $membershipUser->id)
            ->orderByDesc('end_date')
            ->first();

        // Belum pernah beli membership
        if (!$lastMembership) {
            return Carbon::today();
        }

        $today = Carbon::today();
        $endDate = Carbon::parse($lastMembership->end_date);

        // Jika masih aktif / belum berakhir → mulai setelahnya
        return $endDate->gte($today)
            ? $endDate->addDay()
            : $today;
    }

    /**
     * Versi alternatif: ambil tanggal mulai berikutnya langsung dari membership_user_id.
     */
    public static function getNextMembershipStartDateByUserId(int $membershipUserId): Carbon
    {
        $lastMembership = Membership::where('membership_user_id', $membershipUserId)
            ->orderByDesc('end_date')
            ->first();

        $today = Carbon::today();

        if (!$lastMembership) {
            return $today;
        }

        $endDate = Carbon::parse($lastMembership->end_date);

        return $endDate->gte($today)
            ? $endDate->addDay()
            : $today;
    }

    /**
     * Cek apakah user masih punya membership aktif / pending di venue ini.
     * Kalau iya, maka membership berikutnya harus di-antrikan (queued).
     */
    public static function shouldBeQueued(int $userId, int $venueId): bool
    {
        return Membership::whereHas('membershipUser', function ($q) use ($userId, $venueId) {
                $q->where('user_id', $userId)
                  ->where('venue_id', $venueId);
            })
            ->whereIn('status', ['active', 'pending'])
            ->whereDate('end_date', '>=', Carbon::today())
            ->exists();
    }
}
