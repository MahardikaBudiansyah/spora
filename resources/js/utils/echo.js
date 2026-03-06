// utils/echo.js

/**
 * Mengecek apakah Echo aktif
 * @returns {boolean}
 */
export function echoEnabled() {
    return typeof window !== "undefined" && !!window.Echo;
}

/**
 * Mendapatkan channel jika Echo aktif
 * @param {string} name
 * @returns {object|null}
 */
export function echoChannel(name) {
    if (!echoEnabled()) return null;
    return window.Echo.channel(name);
}

/**
 * Listen event pada channel (auto skip jika Echo mati)
 * @param {string} channelName
 * @param {string} eventName
 * @param {Function} callback
 * @returns {Function|null}  cleanup function
 */
export function echoListen(channelName, eventName, callback) {
    const channel = echoChannel(channelName);
    if (!channel) {
        console.warn(
            `[Echo disabled] Skip listening: ${channelName}:${eventName}`
        );
        return null;
    }

    channel.listen(eventName, callback);

    // Return cleanup untuk dipakai di useEffect
    return () => channel.stopListening(eventName);
}
