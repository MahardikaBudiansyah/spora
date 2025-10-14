// utils/stringFormatter.js

// Helper: normalize string, ganti underscore, dash, dsb. jadi spasi
function normalize(str = "") {
    return str
        .replace(/[-_]+/g, " ") // ganti - dan _ jadi spasi
        .replace(/\s+/g, " ") // rapikan spasi berlebih
        .trim();
}

/**
 * Convert string to camelCase
 * Example: "hello world" -> "helloWorld"
 */
export function toCamelCase(str = "") {
    return normalize(str)
        .toLowerCase()
        .replace(/ (.)/g, (_, chr) => chr.toUpperCase());
}

/**
 * Convert string to PascalCase
 * Example: "hello world" -> "HelloWorld"
 */
export function toPascalCase(str = "") {
    const camel = toCamelCase(str);
    return camel.charAt(0).toUpperCase() + camel.slice(1);
}

/**
 * Convert string to snake_case
 * Example: "Hello World" -> "hello_world"
 */
export function toSnakeCase(str = "") {
    return normalize(str).replace(/\s+/g, "_").toLowerCase();
}

/**
 * Convert string to kebab-case
 * Example: "Hello World" -> "hello-world"
 */
export function toKebabCase(str = "") {
    return normalize(str).replace(/\s+/g, "-").toLowerCase();
}

/**
 * Convert string to Title Case
 * Example: "hello world" -> "Hello World"
 */
export function toTitleCase(str = "") {
    return normalize(str)
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());
}
