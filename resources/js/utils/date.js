// utils/date.js
import { DateTime } from "luxon";

/**
 * Format standar pakai preset bawaan Luxon.
 * Contoh preset: DATE_MED, DATE_FULL, TIME_SIMPLE, DATETIME_SHORT, dll.
 */
export function formatDate(value, preset = "DATE_MED") {
    if (!value) return "";

    const dt =
        typeof value === "string"
            ? DateTime.fromISO(value)
            : value instanceof Date
            ? DateTime.fromJSDate(value)
            : DateTime.invalid("Invalid date");

    return dt.setLocale("id").toLocaleString(DateTime[preset]);
}

/**
 * Format dengan pola custom, seperti "dd/MM/yyyy" atau "cccc, dd MMMM yyyy".
 */
export function formatCustom(value, format = "dd MMM yyyy") {
    if (!value) return "";

    const dt =
        typeof value === "string"
            ? DateTime.fromISO(value)
            : value instanceof Date
            ? DateTime.fromJSDate(value)
            : DateTime.invalid("Invalid date");

    return dt.setLocale("id").toFormat(format);
}

/**
 * Format singkat khusus untuk kalender:
 * Output format: "ccc dd/MM" (misal: "Sen 10/07")
 */
export function formatDayShort(value) {
    if (!value) return "";

    let dt;
    if (value instanceof DateTime) {
        dt = value;
    } else if (typeof value === "string") {
        dt = DateTime.fromISO(value);
    } else if (value instanceof Date) {
        dt = DateTime.fromJSDate(value);
    } else {
        dt = DateTime.invalid("Invalid date");
    }

    if (!dt.isValid) return "";

    return dt.setLocale("id").toFormat("ccc dd/MM");
}

/**
 * Cek apakah dua tanggal jatuh pada hari yang sama.
 */
export function isSameDate(a, b) {
    if (!a || !b) return false;

    const dtA =
        a instanceof Date ? DateTime.fromJSDate(a) : DateTime.fromISO(a);
    const dtB =
        b instanceof Date ? DateTime.fromJSDate(b) : DateTime.fromISO(b);

    return dtA.hasSame(dtB, "day");
}

/**
 * Ambil hari ini dalam format ISO (YYYY-MM-DD).
 */
export function todayISO() {
    return DateTime.now().toISODate();
}

/**
 * Konversi nilai ke format ISO date (YYYY-MM-DD)
 */
export function toISODate(value) {
    if (!value) return "";

    return value instanceof Date
        ? DateTime.fromJSDate(value).toISODate()
        : typeof value === "string"
        ? DateTime.fromISO(value).toISODate()
        : "";
}
