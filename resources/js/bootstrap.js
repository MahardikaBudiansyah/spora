import axios from "axios";
window.axios = axios;

window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

// console.log("VITE ENV:", import.meta.env);

if (import.meta.env.VITE_ENABLE_ECHO === "true") {
    import("laravel-echo").then(({ default: Echo }) => {
        const Pusher = require("pusher-js");
        window.Pusher = Pusher;

        window.Echo = new Echo({
            broadcaster: "pusher",
            key: import.meta.env.VITE_PUSHER_APP_KEY,
            wsHost: import.meta.env.VITE_PUSHER_HOST,
            wsPort: import.meta.env.VITE_PUSHER_PORT,
            wssPort: import.meta.env.VITE_PUSHER_PORT,
            forceTLS: false,
            encrypted: false,
            disableStats: true,
            enabledTransports: ["ws", "wss"],
            cluster: "mt1",
        });

        // Bind event hanya setelah Echo dibuat
        window.Echo.connector.pusher.connection.bind("connected", () => {
            console.log("✅ Laravel WebSockets connected");
        });

        window.Echo.connector.pusher.connection.bind("disconnected", () => {
            console.log("⚠️ Laravel WebSockets disconnected");
        });

        window.Echo.connector.pusher.connection.bind("error", (err) => {
            console.error("❌ WebSocket connection error:", err);
        });
    });
}
