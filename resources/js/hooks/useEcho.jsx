import { useEffect } from "react";
import { echoListen } from "@/utils/echo";

/**
 * Hook sederhana untuk mendengarkan event Echo
 *
 * @param {string} channel
 * @param {string} event
 * @param {Function} callback
 */
export default function useEcho(channel, event, callback) {
    useEffect(() => {
        const cleanup = echoListen(channel, event, callback);

        return () => {
            if (cleanup) cleanup();
        };
    }, [channel]);
}
