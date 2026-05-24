import {
    Clock,
    CheckCircle2,
    XCircle,
    BadgeHelp,
    BadgeCheck,
    BadgeAlert,
    FileEdit,
} from "lucide-react";
import { formatFullDateTime } from "@/utils/date";

export const getEmailVerificationStatus = (verifiedAt) => {
    const isVerified = Boolean(verifiedAt);
    const formattedDate = isVerified ? formatFullDateTime(verifiedAt) : null;

    if (isVerified) {
        return {
            label: "Terverifikasi",
            color: "green",
            icon: BadgeCheck,
            isVerified: true,
            timestamp: formattedDate,
        };
    }

    return {
        label: "Belum Verifikasi",
        color: "red",
        icon: BadgeAlert,
        isVerified: false,
        timestamp: null,
    };
};

export const getPhoneNumberVerificationStatus = (verifiedAt) => {
    const isVerified = Boolean(verifiedAt);
    const formattedDate = isVerified ? formatFullDateTime(verifiedAt) : null;

    if (isVerified) {
        return {
            label: "Terverifikasi",
            color: "green",
            icon: BadgeCheck,
            isVerified: true,
            timestamp: formattedDate,
        };
    }
    return {
        label: "Belum Verifikasi",
        color: "red",
        icon: BadgeAlert,
        isVerified: false,
        timestamp: null,
    };
};

export const getMerchantStatus = (
    status,
    rawDate = null,
    historyItem = null,
    lastSubmissionAt = null,
    isReverificationRequired = false,
) => {
    const formattedDate = rawDate ? formatFullDateTime(rawDate) : null;
    const changeByName = historyItem?.change_by_snapshot;
    const s = status?.toLowerCase();

    switch (s) {
        case "draft":
            return {
                label: "Proses Melengkapi Data",
                color: "blue",
                icon: FileEdit,
                isVerified: false,
                timestamp: formattedDate,
                changeByName: changeByName,
            };
        case "pending":
            return {
                label: "Menunggu Aktivasi",
                color: "amber",
                icon: Clock,
                isVerified: false,
                timestamp: formattedDate,
                changeByName: changeByName,
            };
        case "approved":
            return {
                label: isReverificationRequired
                    ? "Pembaruan Ditinjau"
                    : "Terverifikasi",
                color: isReverificationRequired ? "amber" : "green",
                icon: isReverificationRequired ? Clock : BadgeCheck,
                isVerified: true,
                isReverifying: isReverificationRequired,
                timestamp: isReverificationRequired
                    ? formatFullDateTime(lastSubmissionAt)
                    : formatFullDateTime(rawDate),
                changeByName: changeByName,
            };
        case "rejected":
            return {
                label: "Verifikasi Ditolak",
                color: "red",
                icon: BadgeAlert,
                isVerified: false,
                timestamp: formattedDate,
                changeByName: changeByName,
            };
        case "banned":
            return {
                label: "Akun Diblokir",
                color: "red",
                icon: XCircle,
                isVerified: false,
                timestamp: formattedDate,
                changeByName: changeByName,
            };
        case "deactivation_requested":
            return {
                label: "Proses Tutup Toko",
                color: "rose",
                icon: BadgeAlert,
                isVerified: false,
                timestamp: formattedDate,
                changeByName: changeByName,
            };
        default:
            return {
                label: "Status Tidak Diketahui",
                color: "gray",
                icon: BadgeHelp,
                isVerified: false,
                timestamp: formattedDate,
                changeByName: changeByName,
            };
    }
};

export const getOwnerVerificationStatus = (
    status,
    rawDate = null,
    historyItem = null,
) => {
    const formattedDate = rawDate ? formatFullDateTime(rawDate) : null;
    const changeByName = historyItem?.change_by_snapshot;
    const s = status?.toLowerCase();

    switch (s) {
        case "draft":
            return {
                label: "Proses Melengkapi Data",
                color: "blue",
                icon: FileEdit,
                isVerified: false,
                timestamp: formattedDate,
                changeByName: changeByName,
            };
        case "pending":
            return {
                label: "Direview",
                color: "amber",
                icon: Clock,
                isVerified: false,
                timestamp: formattedDate,
                changeByName: changeByName,
            };
        case "approved":
            return {
                label: "Terverifikasi",
                color: "green",
                icon: BadgeCheck,
                isVerified: true,
                timestamp: formattedDate,
                changeByName: changeByName,
            };
        case "rejected":
            return {
                label: "Data Owner Ditolak",
                color: "red",
                icon: BadgeAlert,
                isVerified: false,
                timestamp: formattedDate,
                changeByName: changeByName,
            };
        default:
            return {
                label: "Belum ada Data",
                color: "gray",
                icon: BadgeHelp,
                isVerified: false,
                timestamp: formattedDate,
                changeByName: changeByName,
            };
    }
};

export const getProfileVerificationStatus = (
    status,
    rawDate = null,
    historyItem = null,
) => {
    const formattedDate = rawDate ? formatFullDateTime(rawDate) : null;
    const changeByName = historyItem?.change_by_snapshot;
    const s = status?.toLowerCase();

    switch (s) {
        case "draft":
            return {
                label: "Melengkapi Data",
                color: "blue",
                icon: FileEdit,
                isVerified: false,
                timestamp: formattedDate,
                changeByName: changeByName,
            };
        case "pending":
            return {
                label: "Direview",
                color: "amber",
                icon: Clock,
                isVerified: false,
                timestamp: formattedDate,
                changeByName: changeByName,
            };
        case "approved":
            return {
                label: "Terverifikasi",
                color: "green",
                icon: BadgeCheck,
                isVerified: true,
                timestamp: formattedDate,
                changeByName: changeByName,
            };
        case "rejected":
            return {
                label: "Ditolak",
                color: "red",
                icon: BadgeAlert,
                isVerified: false,
                timestamp: formattedDate,
                changeByName: changeByName,
            };
        default:
            return {
                label: "Belum ada Data",
                color: "gray",
                icon: BadgeHelp,
                isVerified: false,
                timestamp: null,
                changeByName: null,
            };
    }
};

export const getPayoutVerificationStatus = (
    status,
    rawDate = null,
    historyItem = null,
) => {
    const formattedDate = rawDate ? formatFullDateTime(rawDate) : null;
    const changeByName = historyItem?.change_by_snapshot;
    const s = status?.toLowerCase();

    switch (s) {
        case "draft":
            return {
                label: "Melengkapi Data",
                color: "blue",
                icon: FileEdit,
                isVerified: false,
                timestamp: formattedDate,
                changeByName: changeByName,
            };
        case "pending":
            return {
                label: "Direview",
                color: "amber",
                icon: Clock,
                isVerified: false,
                timestamp: formattedDate,
                changeByName: changeByName,
            };
        case "approved":
            return {
                label: "Rekening Terverfikasi",
                color: "green",
                icon: BadgeCheck,
                isVerified: true,
                timestamp: formattedDate,
                changeByName: changeByName,
            };
        case "rejected":
            return {
                label: "Rekening Bermasalah",
                color: "red",
                icon: XCircle,
                isVerified: false,
                timestamp: formattedDate,
                changeByName: changeByName,
            };
        default:
            return {
                label: "Belum Ada Rekening",
                color: "gray",
                icon: BadgeHelp,
                isVerified: false,
                timestamp: formattedDate,
                changeByName: changeByName,
            };
    }
};

export const checkSectionCompletion = (merchant, section) => {
    const isAddressComplete = (addressObj) => {
        if (!addressObj) return false;
        return !!(
            addressObj.address &&
            addressObj.village_code &&
            addressObj.district_code &&
            addressObj.city_code &&
            addressObj.province_code &&
            addressObj.postal_code
        );
    };

    switch (section) {
        case "basic":
            return !!(
                merchant?.name &&
                merchant?.phone_verified_at &&
                merchant?.email_verified_at
            );
        case "profile":
            const profile = merchant?.profile;
            const isProfileAddressComplete = isAddressComplete(
                profile?.address,
            );
            return !!(
                profile?.business_name &&
                profile?.business_email &&
                profile?.business_phone_number &&
                profile?.business_type &&
                isProfileAddressComplete
            );
        case "owner":
            const owner = merchant?.owner;
            const isOwnerAddressComplete = isAddressComplete(owner?.address);
            return !!(
                owner?.name &&
                owner?.nik &&
                owner?.gender &&
                owner?.date_of_birth &&
                owner?.photo_path &&
                owner?.ktp_photo_path &&
                owner?.selfie_photo_path &&
                isOwnerAddressComplete
            );
        case "payout":
            const primaryAccount = merchant?.payout_methods?.find(
                (m) => m.is_primary,
            );
            if (!primaryAccount) return false;

            return calculateSinglePayoutProgress(primaryAccount) === 100;
        default:
            return false;
    }
};

export const getOverallProgress = (merchant) => {
    const steps = ["basic", "profile", "owner", "payout"];
    const completed = steps.filter((step) =>
        checkSectionCompletion(merchant, step),
    );
    return Math.round((completed.length / steps.length) * 100);
};

export const calculateSinglePayoutProgress = (payoutObj) => {
    if (!payoutObj) return 0;
    const fields = [
        !!payoutObj.provider_name,
        !!payoutObj.account_number,
        !!payoutObj.account_holder_name,
    ];
    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
};

export const getSectionProgress = (merchant, section, options = {}) => {
    const isAddressComplete = (addressObj) => {
        if (!addressObj) return [false];
        return [
            !!addressObj.address,
            !!addressObj.village_code,
            !!addressObj.district_code,
            !!addressObj.city_code,
            !!addressObj.province_code,
            !!addressObj.postal_code,
        ];
    };

    let fields = [];

    switch (section) {
        case "basic":
            fields = [
                !!merchant?.name,
                !!merchant?.phone_verified_at,
                !!merchant?.email_verified_at,
            ];
            break;
        case "profile":
            const profile = merchant?.profile;
            fields = [
                !!profile?.business_name,
                !!profile?.business_email,
                !!profile?.business_phone_number,
                !!profile?.business_type,
                !!profile?.nib,
                ...isAddressComplete(profile?.address),
            ];
            break;
        case "owner":
            const owner = merchant?.owner;
            fields = [
                !!owner?.name,
                !!owner?.nik,
                !!owner?.gender,
                !!owner?.date_of_birth,
                !!owner?.photo_path,
                !!owner?.ktp_photo_path,
                !!owner?.selfie_photo_path,
                ...isAddressComplete(owner?.address),
            ];
            break;
        case "payout":
            if (options?.currentPayout) {
                return calculateSinglePayoutProgress(options.currentPayout);
            }

            const methods = merchant?.payout_methods || [];
            const primary = methods.find((m) => m.is_primary) || methods[0];
            return calculateSinglePayoutProgress(primary);
        default:
            return 0;
    }

    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
};
