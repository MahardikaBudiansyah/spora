import {
    BadgeAlert,
    BadgeCheck,
    BadgeHelp,
    Clock,
    FileEdit,
} from "lucide-react";
import { formatFullDateTime } from "@/utils/date";

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

export const getVenueStatus = (status, rawDate = null, historyItem = null) => {
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
                timestamp: formattedDate,
                changeByName: changeByName,
            };
    }
};

export const getVenuesCountBadge = (count) => {
    let color = "gray";

    if (count >= 1 && count <= 10) {
        color = colors[count - 1];
    } else if (count > 10) {
        color = colors[colors.length - 1];
    }

    return {
        label: count ?? 0,
        color: color,
    };
};

export const getVenueCourtsCountBadge = (count) => {
    let color = "gray";

    if (count >= 1 && count <= 10) {
        color = colors[count - 1];
    } else if (count > 10) {
        color = colors[colors.length - 1];
    }

    return {
        label: count ?? 0,
        color: color,
    };
};

const categoryColorMap = {
    Indoor: "blue",
    Outdoor: "emerald",
    "Semi Indoor": "cyan",
    Premium: "amber",
    Standard: "slate",
    Economy: "green",
};

export const getCategoryBadge = (category) => {
    const categoryName = category?.name || category;
    const categoryLabel = category?.label || category;

    const color = categoryColorMap[categoryName] || "gray";

    return {
        label: categoryLabel,
        color: color,
    };
};
