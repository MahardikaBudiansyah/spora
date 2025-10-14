import { formatRupiah } from "@/utils/currency";

export const formatAmountByType = (type, value) => {
    if (value === null || value === undefined) return "-";

    if (type === "percentage") {
        const formatted = Number(value);
        if (isNaN(formatted)) return "-";
        return formatted % 1 === 0
            ? formatted.toString() + "%"
            : formatted.toFixed(2) + "%";
    }

    if (type === "fixed") return formatRupiah(value);

    return value;
};

export const translateAmountType = (type) => {
    switch (type) {
        case "percentage":
            return "Persentase";
        case "fixed":
            return "Rupiah";
        default:
            return type;
    }
};
