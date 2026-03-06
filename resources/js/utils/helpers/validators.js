// utils/table/validators.js

/**
 * Cek apakah value kosong
 */
export function required(value) {
    if (value === null || value === undefined || value === "") {
        return false;
    }
    return true;
}

/**
 * Cek apakah value adalah number
 */
export function isNumber(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
}

/**
 * Cek min/max number
 */
export function minValue(value, min) {
    return isNumber(value) && Number(value) >= min;
}

export function maxValue(value, max) {
    return isNumber(value) && Number(value) <= max;
}

/**
 * Validasi panjang string
 */
export function minLength(value, len) {
    return typeof value === "string" && value.length >= len;
}

export function maxLength(value, len) {
    return typeof value === "string" && value.length <= len;
}
