/**
 * Ubah alamat ke format Title Case
 * ex: "MLATI, KABUPATEN SLEMAN" -> "Mlati, Kabupaten Sleman"
 */
export function formatAddressName(str = "") {
    return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Gabungkan district + city jadi satu string
 */
export function formatDistrictCity(district, city) {
    return `${formatAddressName(district)}, ${formatAddressName(city)}`;
}
