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
            className={`w-8 h-8 rounded-full hover:ring-4  transition-colors duration-300 ${
                isDark
                    ? "bg-secondary-700 hover:bg-secondary-700 hover:ring-secondary-700"
                    : "bg-secondary-50 hover:bg-secondary-100 hover:ring-secondary-100"
            }`}
        >
            {isDark ? (
                <Moon className="w-5 h-5 text-white" />
            ) : (
                <Sun className="w-5 h-5 text-yellow-400 hover:text-yellow-00" />
            )}
        </IconButton>
    );
}
