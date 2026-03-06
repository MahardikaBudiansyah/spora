export function formatTitleCase(str = "") {
    if (!str) return "";
    return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

export function formatAddressName(name = "") {
    if (!name) return "";
    const cleaned = name.replace(/(KABUPATEN|KOTA|PROVINSI)\s+/gi, "");
    return formatTitleCase(cleaned);
}

export function formatDistrictCity(district, city) {
    const d = formatAddressName(district);
    const c = formatAddressName(city);

    if (d && c) return `${d}, ${c}`;
    return d || c || "-";
}

export const formatFullAddress = (addressInput, shouldFormat = true) => {
    if (!addressInput) return "-";

    let rawAddress =
        typeof addressInput === "string"
            ? addressInput
            : addressInput.full_address;

    if (!rawAddress) return "-";

    // Gunakan Title Case agar rapi (Jalan Merdeka bukan JALAN MERDEKA)
    return shouldFormat ? formatTitleCase(rawAddress) : rawAddress;
};
