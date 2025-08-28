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
    // Mengubah "Rp 100.000" menjadi 100000 (number)
    return Number(value.replace(/\D/g, ""));
};
