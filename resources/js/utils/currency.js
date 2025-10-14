export const formatRupiah = (value) => {
    if (!value) return "Rp 0";
    return "Rp " + Number(value).toLocaleString("id-ID");
};

export const formatPriceInput = (value) => {
    if (!value) return "";
    const number = Number(value);
    return "Rp " + number.toLocaleString("id-ID");
};

export const parseRupiahToNumber = (value) => {
    return Number(value.replace(/\D/g, ""));
};

export const formatDiscount = (type, value) => {
    if (value === null || value === undefined) return "-";

    if (type === "percentage") {
        // sesuaikan dengan DB
        const formatted = Number(value);
        if (isNaN(formatted)) return "-"; // jika bukan angka
        return formatted % 1 === 0
            ? formatted.toString() + "%"
            : formatted.toFixed(2) + "%";
    }

    if (type === "fixed") return formatRupiah(value);

    return value;
};

export const translateDiscountType = (type) => {
    switch (type) {
        case "percentage":
            return "Persen";
        case "fixed":
            return "Rupiah";
        default:
            return type;
    }
};
