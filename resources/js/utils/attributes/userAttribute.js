import { formatFullDateTime } from "@/utils/date";

export const getVerificationStatus = (timestamp) => {
    if (timestamp) {
        return {
            label: "Terverifikasi",
            color: "green",
            isVerified: true,
            timestamp: formatFullDateTime(timestamp),
        };
    }
    return {
        label: "Belum Verifikasi",
        color: "red",
        isVerified: false,
        timestamp: null,
    };
};

export const getUserStatus = (status, verifiedAt = null) => {
    const time = verifiedAt ? formatFullDateTime(verifiedAt) : null;

    switch (status) {
        case "pending":
            return {
                label: "Menunggu Verifikasi",
                color: "orange",
                timestamp: time,
            };
        case "verified":
            return { label: "Terverifikasi", color: "green", timestamp: time };
        case "banned":
            return { label: "Tidak Aktif", color: "red", timestamp: time };
        case "deactivation_requested":
            return {
                label: "Proses Hapus Akun",
                color: "rose",
                timestamp: time,
            };
        default:
            return { label: "Tidak Diketahui", color: "gray", timestamp: time };
    }
};

export const getUserMembershipStatus = (count) => {
    const total = Number(count) || 0;

    if (total > 0) {
        return {
            label: `Member (${total})`,
            color: "green",
        };
    }

    return {
        label: "Tidak Ada",
        color: "gray",
    };
};

export const getUserBookingStatus = (count) => {
    const total = Number(count) || 0;

    if (total > 0) {
        return {
            label: `Booking (${total}x)`,
            color: "green",
        };
    }

    return {
        label: "Tidak Ada",
        color: "gray",
    };
};
