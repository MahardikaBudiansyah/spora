import { formatShortDate, formatFullDate } from "@/utils/date";

export const getMembershipCardInfo = (card) => {
    if (card?.member_no) {
        return {
            label: card.member_no,
            color: "cyan",
            isActive: Boolean(card.is_active),
        };
    }
    return { label: "Belum Member", color: "red", isActive: false };
};

export const getMembershipOrderStatus = (status, isQueued = false) => {
    if (status === "active" && isQueued) {
        return { label: "Menunggu Periode", color: "yellow" };
    }

    const states = {
        pending: { label: "Menunggu Pembayaran", color: "orange" },
        active: { label: "Aktif", color: "emerald" },
        queued: { label: "Dalam Antrean", color: "amber" },
        expired: { label: "Kedaluwarsa", color: "gray" },
        cancelled: { label: "Dibatalkan", color: "red" },
    };

    return states[status] || { label: "Tidak Ada Paket", color: "red" };
};

export const formatMembershipQuota = (limit, remaining) => {
    if (limit === null || limit === undefined) return null;

    let color = "green";
    if (remaining <= 0) color = "red";
    else if (remaining <= limit / 2) color = "yellow";

    return {
        label: `Sisa ${remaining} dari ${limit} sesi`,
        color,
        isExhausted: remaining <= 0,
    };
};

export const formatMembershipPeriod = (start, end) => {
    if (!start || !end) return "-";
    return `${formatFullDate(start)} - ${formatFullDate(end)}`;
};

export const getMembershipPackageDuration = (duration) => {
    const months = Number(duration);

    if (months <= 0) {
        return { label: "Tanpa Durasi", color: "gray" };
    }

    const config = {
        1: { label: "1 Bulan", color: "blue" },
        3: { label: "3 Bulan", color: "indigo" },
        6: { label: "6 Bulan", color: "violet" },
        12: { label: "12 Bulan", color: "purple" },
    };

    if (!config[months]) {
        let color = "slate";
        if (months < 3) color = "sky";
        else if (months < 6) color = "cyan";
        else if (months < 12) color = "fuchsia";

        return {
            label: `${months} Bulan`,
            color: color,
        };
    }

    return config[months];
};
