import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    useRef,
} from "react";
import { router } from "@inertiajs/react";
import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000",
    withCredentials: true,
    headers: { "X-Requested-With": "XMLHttpRequest" },
});

const AuthContext = createContext();

export function AuthProvider({ children, initialUser = null }) {
    const [user, setUser] = useState(initialUser);
    const [authLoading, setAuthLoading] = useState(false);
    const [loading, setLoading] = useState(!initialUser);
    const [error, setError] = useState(null);

    const loginInProgressRef = useRef(false);
    const authenticated = !!user;

    // Fetch current user
    const fetchUser = useCallback(async () => {
        try {
            const { data } = await api.get("/api/user");
            setUser(data.user);
            setError(null);
        } catch {
            setUser(null);
            setError(null);
        } finally {
            setLoading(false);
        }
    }, []);

    // Login
    const login = async (credentials) => {
        if (loginInProgressRef.current)
            return { success: false, message: "In progress" };

        loginInProgressRef.current = true;
        setAuthLoading(true);
        setError(null);

        try {
            await api.get("/sanctum/csrf-cookie");
            const res = await api.post("/login", credentials);

            localStorage.setItem("authEvent", "login");

            // tunggu fetchUser selesai
            await fetchUser();

            toast.success(res.data?.message || "Berhasil login");

            return { success: true };
        } catch (err) {
            let msg = "Email atau nomor HP / kata sandi salah.";
            if (!err.response)
                msg =
                    "Tidak dapat terhubung ke server. Silakan coba lagi nanti.";
            else if (err.response?.status === 429)
                msg = Object.values(err.response.data.errors).flat().join(" ");
            else if (err.response.data?.message)
                msg = err.response.data.message;

            setError(msg);
            toast.error(msg);

            return { success: false };
        } finally {
            loginInProgressRef.current = false;
            setAuthLoading(false);
        }
    };

    // Logout
    const logout = useCallback(async (serverLogout = true) => {
        try {
            setLoading(true);
            setError(null);

            if (serverLogout) {
                await api.post("/logout");
                toast.success("Berhasil logout.");
                router.visit(route("home"));
            }

            setUser(null);
            localStorage.setItem("authEvent", "logout");
        } catch {
            toast.error("Logout gagal.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // Fetch CSRF cookie first, then user
        api.get("/sanctum/csrf-cookie").then(() => {
            fetchUser();
        });

        // Listen storage event for cross-tab login/logout
        const syncAuth = (event) => {
            if (event.key === "authEvent") {
                if (event.newValue === "logout") setUser(null);
                else if (event.newValue === "login") fetchUser();
            }
        };
        window.addEventListener("storage", syncAuth);

        // Auto-refresh user data every 5 minutes
        const interval = setInterval(async () => {
            if (user) {
                // <-- pakai user terbaru
                try {
                    await fetchUser();
                } catch {
                    toast.warning(
                        "Sesi berakhir, Anda akan keluar secara otomatis dalam 3 detik."
                    );
                    setTimeout(() => logout(false), 3000);
                }
            }
        }, 5 * 60 * 1000);

        return () => {
            window.removeEventListener("storage", syncAuth);
            clearInterval(interval);
        };
    }, [fetchUser, logout, user]); // <-- user sebagai dependency

    return (
        <AuthContext.Provider
            value={{
                user,
                authenticated,
                authLoading,
                loading,
                error,
                login,
                logout,
                fetchUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
