export function formatTo08(phone) {
    if (!phone) return "";
    phone = phone.replace(/\D/g, "");
    if (phone.startsWith("62")) return "0" + phone.slice(2);
    if (phone.startsWith("+62")) return "0" + phone.slice(3);
    return phone;
}

/**
 * Normalisasi ke format 62xxxxxxxx
 */
export function normalizePhone(phone) {
    if (!phone) return "";
    phone = phone.replace(/\D/g, "");
    if (phone.startsWith("0")) return "62" + phone.slice(1);
    if (phone.startsWith("+62")) return phone.slice(1); // +62 → 62
    return phone; // sudah 62…
}
