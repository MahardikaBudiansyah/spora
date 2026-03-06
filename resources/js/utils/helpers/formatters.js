// utils/table/formatters.js

/**
 * Format angka menjadi rupiah
 */
export function formatCurrency(value) {
    if (!value && value !== 0) return "";
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
    }).format(value);
}

/**
 * Format tanggal ke format full
 */
export function formatDateFull(value) {
    if (!value) return "";
    const date = new Date(value);
    return date.toLocaleString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

/**
 * Format tanggal pendek
 */
export function formatDateShort(value) {
    if (!value) return "";
    const date = new Date(value);
    return date.toLocaleDateString("id-ID");
}

/**
 * Uppercase string
 */
export function uppercase(value) {
    return typeof value === "string" ? value.toUpperCase() : value;
}
