import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
} from "react";
import { router } from "@inertiajs/react";
import axios from "axios";
import { toast } from "react-toastify";

// Axios instance
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000",
    withCredentials: true,
    headers: { "X-Requested-With": "XMLHttpRequest" },
});

const AuthContext = createContext();

export function AuthProvider({
    children,
    initialUser = null,
    initialRole = null,
}) {
    const [user, setUser] = useState(initialUser);
    const [role, setRole] = useState(initialRole); // simpan role sekarang
    const [loading, setLoading] = useState(!initialUser);
    const [error, setError] = useState(null);

    const authenticated = !!user;

    // Ambil data user sesuai role
    const fetchUser = useCallback(
        async (roleParam = role || "user") => {
            try {
                // Tentukan endpoint berdasarkan role
                let endpoint = "/api/user";
                if (roleParam === "merchant") endpoint = "/api/merchant/user";
                else if (roleParam === "admin") endpoint = "/api/admin/user";

                const { data } = await api.get(endpoint);
                setUser(data.user);
                setRole(roleParam);
                setError(null);
                // console.log(
                //     `Logged in as (${roleParam}):`,
                //     data.user.name,
                //     "-",
                //     data.user.email
                // );
            } catch (err) {
                setUser(null);
                setRole(null);
            } finally {
                setLoading(false);
            }
        },
        [role]
    );

    // Login sesuai role
    const login = async (credentials, roleParam = "user") => {
        try {
            setLoading(true);
            setError(null);

            await api.get("/sanctum/csrf-cookie");

            let loginEndpoint = "/login";
            if (roleParam === "merchant") loginEndpoint = "/merchant/login";
            else if (roleParam === "admin") loginEndpoint = "/admin/login";

            const res = await api.post(loginEndpoint, credentials);

            // delay kecil supaya session siap
            await new Promise((res) => setTimeout(res, 100));
            await fetchUser(roleParam);

            localStorage.setItem("authEvent", "login");

            return { success: true, message: res.data.message };
        } catch (err) {
            const msg = err.response?.data?.message || "Terjadi kesalahan.";
            setError(msg);
            toast.error(msg, { position: "top-right" });
            return { success: false, message: msg };
        } finally {
            setLoading(false);
        }
    };

    // Logout umum
    const logout = useCallback(async (serverLogout = true) => {
        try {
            setLoading(true);
            setError(null);

            if (serverLogout) {
                await api.post("/logout");
                router.visit(route("home"));
                toast.success("Berhasil logout.");
            }

            setUser(null);
            setRole(null);
            localStorage.setItem("authEvent", "logout");
        } catch {
            setError("Logout gagal.");
            toast.error("Logout gagal.", { position: "top-right" });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!initialUser) {
            api.get("/sanctum/csrf-cookie").then(() => {
                fetchUser();
            });
        } else {
            setLoading(false);
        }

        // Sinkron multi-tab login/logout
        const syncAuth = (event) => {
            if (event.key === "authEvent") {
                if (event.newValue === "logout") {
                    setUser(null);
                    setRole(null);
                } else if (event.newValue === "login") {
                    fetchUser();
                }
            }
        };
        window.addEventListener("storage", syncAuth);

        // Auto-refresh session tiap 5 menit
        const interval = setInterval(async () => {
            if (authenticated) {
                try {
                    await fetchUser();
                    console.log("Session refreshed");
                } catch {
                    console.warn("Session expired");
                    toast.warning(
                        "Sesi Anda telah berakhir. Anda akan keluar otomatis."
                    );
                    setTimeout(() => {
                        logout(false);
                    }, 3000);
                }
            }
        }, 5 * 60 * 1000);

        return () => {
            window.removeEventListener("storage", syncAuth);
            clearInterval(interval);
        };
    }, [authenticated, fetchUser, logout, initialUser]);

    return (
        <AuthContext.Provider
            value={{
                user,
                role,
                authenticated,
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
