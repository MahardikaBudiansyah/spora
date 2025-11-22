import { formatShortDate } from "@/utils/date";

const colors = [
    "red",
    "green",
    "blue",
    "yellow",
    "purple",
    "pink",
    "indigo",
    "teal",
    "orange",
    "lime",
    "cyan",
    "rose",
];

export const getMembershipDuration = (duration) => {
    let color = "gray"; // default untuk >12 bulan
    if (duration >= 1 && duration <= 12) {
        color = colors[duration - 1];
    }
    return { label: `${duration} Bulan`, color };
};

export const getMembershipStatus = (status, isQueued = false) => {
    if (status === "active" && isQueued) {
        return { label: "Menunggu Periode Selanjutnya", color: "yellow" };
    }

    switch (status) {
        case "pending":
            return { label: "Menunggu Pembayaran", color: "orange" };
        case "active":
            return { label: "Membership Aktif", color: "green" };
        case "expired":
            return { label: "Kedaluwarsa", color: "gray" };
        case "cancelled":
            return { label: "Dibatalkan", color: "red" };
        default:
            return { label: "Non Membership", color: "red" };
    }
};

export function formatDiscountLimit(limit) {
    if (!limit || limit <= 0) {
        return { label: "0", color: "red" }; // 0 atau null → merah
    }
    return { label: `${limit} slot/jam`, color: "blue" }; // >0 → biru
}

export function formatMembershipPeriod(membership) {
    if (!membership) return null; // ⬅️ return null biar gampang hidden
    return `${formatShortDate(membership.start_date)} - ${formatShortDate(
        membership.end_date
    )}`;
}

export function formatDiscountLimitUsage(limit, used = 0) {
    if (!limit) return null; // unlimited → tidak ditampilkan

    const remaining = limit - used;
    let color = "green"; // default masih penuh

    if (remaining <= 0) {
        color = "red"; // habis
    } else if (remaining <= limit / 2) {
        color = "yellow"; // tinggal setengah atau kurang
    }

    return {
        label: `Tersisa ${remaining} dari ${limit}`,
        color,
        tooltip: `${limit} slot/jam`, // info limit asli
    };
}
