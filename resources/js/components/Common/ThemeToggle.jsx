import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import IconButton from "@/components/Common/IconButton";

export default function ThemeToggle({ tooltipPlacement = "top" }) {
    const { isDark, toggleTheme } = useTheme();

    return (
        <IconButton
            onClick={toggleTheme}
            tooltip={isDark ? "Ubah ke mode terang" : "Ubah ke mode gelap"}
            tooltipPlacement={tooltipPlacement} // ← diteruskan
            aria-label={isDark ? "Ubah ke mode terang" : "Ubah ke mode gelap"}
            className={`w-8 h-8 rounded-full transition-colors duration-300 ${
                isDark ? "bg-secondary-800" : "bg-secondary-50"
            }`}
        >
            {isDark ? (
                <Moon className="w-5 h-5 text-white" />
            ) : (
                <Sun className="w-5 h-5 text-yellow-500" />
            )}
        </IconButton>
    );
}
