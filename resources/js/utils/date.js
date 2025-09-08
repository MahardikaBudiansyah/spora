// utils/date.js
import { DateTime } from "luxon";

/**
 * Parser utama supaya semua input (string, Date, DateTime)
 * dikonversi ke DateTime Luxon yang valid.
 */
export function parseDate(value) {
    if (!value) return null;
    if (value instanceof DateTime) return value;
    if (value instanceof Date) return DateTime.fromJSDate(value);
    if (typeof value === "string") return DateTime.fromISO(value);

    return null;
}

/**
 * Format standar pakai preset bawaan Luxon.
 */
export function formatDate(value, preset = "DATE_MED") {
    const dt = parseDate(value);
    if (!dt || !dt.isValid) return "";
    return dt.setLocale("id").toLocaleString(DateTime[preset]);
}

/**
 * Format custom.
 */
export function formatWithPattern(value, format = "dd MMM yyyy") {
    const dt = parseDate(value);
    if (!dt || !dt.isValid) return "";
    return dt.setLocale("id").toFormat(format);
}

export function formatFullDate(value) {
    const dt = parseDate(value);
    if (!dt || !dt.isValid) return "";
    return dt.setLocale("id").toFormat("d LLLL yyyy");
}

export function formatShortDate(value) {
    const dt = parseDate(value);
    if (!dt || !dt.isValid) return "";
    return dt.setLocale("id").toFormat("d LLL yyyy");
}

/**
 * Format singkat khusus kalender: "ccc dd/MM"
 */
export function formatDayShort(value) {
    const dt = parseDate(value);
    if (!dt || !dt.isValid) return "";
    return dt.setLocale("id").toFormat("ccc dd/MM");
}

/**
 * Cek apakah dua tanggal jatuh pada hari yang sama.
 */
export function isSameDate(a, b) {
    const dtA = parseDate(a);
    const dtB = parseDate(b);
    if (!dtA || !dtB || !dtA.isValid || !dtB.isValid) return false;
    return dtA.hasSame(dtB, "day");
}

/**
 * Hari ini (ISO string)
 */
export function todayISO() {
    return DateTime.now().toISODate();
}

/**
 * Konversi ke ISO string (YYYY-MM-DD).
 */
export function toISODate(value) {
    const dt = parseDate(value);
    return dt && dt.isValid ? dt.toISODate() : "";
}
