import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import IconButton from "@/components/Common/IconButton";

export default function ThemeToggle({ tooltipPlacement = "top" }) {
    const { isDark, toggleTheme } = useTheme();

    return (
        <IconButton
            onClick={toggleTheme}
            tooltip={isDark ? "Ubah ke mode terang" : "Ubah ke mode gelap"}
            tooltipPlacement={tooltipPlacement}
            aria-label={isDark ? "Ubah ke mode terang" : "Ubah ke mode gelap"}
            className={`rounded-full transition-colors duration-300 ${
                isDark
                    ? "bg-secondary-700 hover:bg-secondary-700 hover:ring-secondary-700 dark:hover:ring-primary-600"
                    : "bg-secondary-50 hover:bg-secondary-100 hover:ring-secondary-200 focus:ring-secondary-200"
            }`}
        >
            {isDark ? (
                <Moon className="w-4 h-4 text-white" />
            ) : (
                <Sun className="w-4 h-4 text-yellow-400 hover:text-yellow-00" />
            )}
        </IconButton>
    );
}
