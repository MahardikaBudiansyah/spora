<?php

namespace App\Helpers;

use Log;
use Carbon\Carbon;
use App\Models\MembershipCard;
use App\Models\MembershipOrder;

class MembershipHelper
{
    /**
     * Generate unique member number untuk user di suatu venue.
     */
    public static function generateMemberNo(int $merchantId, int $venueId, ?int $userId = null): string
    {
        do {
            $random = mt_rand(100000, 999999);
            $suffix = $userId ? "U{$userId}{$random}" : "X{$random}";
            $code = "M{$merchantId}V{$venueId}{$suffix}";
        } while (self::memberNoExists($code));

        return $code;
    }


    private static function memberNoExists(string $code): bool
    {
        return MembershipCard::where('member_no', $code)->exists();
    }




}
