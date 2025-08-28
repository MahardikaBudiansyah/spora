import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({
    isDark: false,
    toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        // Hanya jalankan saat window tersedia
        if (typeof window !== "undefined") {
            const savedTheme = localStorage.getItem("theme");
            const prefersDark = window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches;

            // Set awal dari localStorage atau preferensi OS
            setIsDark(savedTheme === "dark" || (!savedTheme && prefersDark));
        }
    }, []);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const root = window.document.documentElement;
            if (isDark) {
                root.classList.add("dark");
                localStorage.setItem("theme", "dark");
            } else {
                root.classList.remove("dark");
                localStorage.setItem("theme", "light");
            }
        }
    }, [isDark]);

    const toggleTheme = () => setIsDark((prev) => !prev);

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
