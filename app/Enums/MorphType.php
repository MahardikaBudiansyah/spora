<?php

namespace App\Enums;

enum MorphType: string
{
    case ADMIN = 'admin';
    case ADMIN_PROFILE = 'admin_profile';
    case PLATFORM_PROFILE = 'platform_profile';
    case USER = 'user';
    case MERCHANT = 'merchant';

    case MERCHANT_OWNER_SUBMISSION = 'merchant_owner_submission';
    case MERCHANT_PROFILE_SUBMISSION = 'merchant_profile_submission';
    case MERCHANT_PAYOUT_METHOD_SUBMISSION = 'merchant_payout_method_submission';

    case MERCHANT_PROFILE = 'merchant_profile';
    case MERCHANT_OWNER = 'merchant_owner';
    case MERCHANT_PAYOUT_METHOD = 'merchant_payout_method';
    case VENUE = 'venue';
    case STAFF = 'staff';

    public function label(): string
    {
        return match ($this) {
            self::ADMIN => 'Administrator',
            self::ADMIN_PROFILE => 'Profil Admin',
            self::PLATFORM_PROFILE => 'Profil Platform',
            self::USER => 'Pelanggan',
            self::MERCHANT => 'Mitra',

            self::MERCHANT_OWNER_SUBMISSION => 'Pengajuan Owner Mitra',
            self::MERCHANT_PROFILE_SUBMISSION => 'Pengajuan Profil Mitra',
            self::MERCHANT_PAYOUT_METHOD_SUBMISSION => 'Pengajuan Rekening Mitra',

            self::MERCHANT_PROFILE => 'Profil Mitra',
            self::MERCHANT_OWNER => 'Owner Mitra',
            self::MERCHANT_PAYOUT_METHOD => 'Metode Pencairan Dana (Rekening) Mitra',
            self::VENUE => 'Tempat Olahraga',
            self::STAFF => 'Staff Mitra',
            default => 'Tidak Diketahui',
        };
    }
}
