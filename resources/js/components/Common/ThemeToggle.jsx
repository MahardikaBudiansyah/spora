import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export default function ThemeToggle() {
    const { isDark, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                isDark ? "bg-secondary-800" : "bg-secondary-50"
            }`}
            title="Toggle Theme"
        >
            {isDark ? (
                <Moon className="w-5 h-5 text-white" />
            ) : (
                <Sun className="w-5 h-5 text-yellow-500" />
            )}
        </button>
    );
}
