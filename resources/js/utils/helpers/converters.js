// utils/table/converters.js

/**
 * Convert string ke number
 */
export function toNumber(value, defaultValue = 0) {
    const num = parseFloat(value);
    return isNaN(num) ? defaultValue : num;
}

/**
 * Convert string ke boolean
 */
export function toBoolean(value) {
    if (value === "true" || value === true) return true;
    if (value === "false" || value === false) return false;
    return Boolean(value);
}

/**
 * Trim string
 */
export function trimString(value) {
    return typeof value === "string" ? value.trim() : value;
}

/**
 * Convert empty string ke null
 */
export function emptyToNull(value) {
    return value === "" ? null : value;
}
