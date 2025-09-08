import { twMerge } from "tailwind-merge";
import { NumericFormat } from "react-number-format";
import { useAuth } from "@/contexts/AuthContext";

export default function TimeSlotButton({ slot, selected, disabled, onClick }) {
    const { user } = useAuth();
    const role = user?.role ?? "guest"; // guest kalau belum login

    const statusLabel = slot.status_label || slot.status || "Tersedia";

    // Semua style per status
    const stylesByStatus = {
        Tersedia: {
            base: "bg-white dark:bg-secondary-800 border-secondary-200 dark:border-secondary-600",
            selected:
                "border border-teal-400 bg-teal-100 dark:bg-teal-400 dark:text-secondary-900",
            hover: "hover:bg-teal-200 dark:hover:bg-teal-700 hover:border-teal-400 dark:hover:border-teal-800",
        },
        Dipesan: {
            base: "bg-rose-100 dark:bg-rose-300 border-rose-300 dark:border-rose-500 dark:text-secondary-900",
            selected: "border border-rose-600 bg-rose-200 dark:bg-rose-400",
            hover: "hover:bg-rose-200 dark:hover:bg-rose-400",
        },
        Event: {
            base: "bg-yellow-100 dark:bg-yellow-300 border-yellow-300 dark:border-yellow-500 dark:text-secondary-900",
            selected:
                "border border-yellow-600 bg-yellow-200 dark:bg-yellow-400",
            hover: "hover:bg-yellow-200 dark:hover:bg-yellow-400",
        },
        Pemeliharaan: {
            base: "bg-sky-100 dark:bg-sky-300 border-sky-300 dark:border-sky-500 dark:text-secondary-900",
            selected: "border border-sky-600 bg-sky-200 dark:bg-sky-400",
            hover: "hover:bg-sky-200 dark:hover:bg-sky-400",
        },
    };

    const statusStyles = stylesByStatus[statusLabel] || stylesByStatus.Tersedia;

    // Base style per role
    const baseStyle = twMerge(
        `
      px-4 py-3 border rounded-lg
      flex flex-col gap-1 items-center text-center
      text-xs cursor-pointer transition
    `,
        role === "partner"
            ? "dark:text-blue-200"
            : role === "guest"
            ? "dark:text-white"
            : "dark:text-white"
    );

    const mergedClassName = twMerge(
        baseStyle,
        statusStyles.base,
        selected && statusStyles.selected,
        !disabled && statusStyles.hover,
        disabled && "opacity-50 cursor-not-allowed"
    );

    return (
        <button
            type="button"
            onClick={disabled ? undefined : onClick}
            className={mergedClassName}
            disabled={disabled}
            aria-pressed={selected}
        >
            <span className="font-bold">{slot.time}</span>
            <NumericFormat
                value={slot.price ?? 0}
                displayType="text"
                thousandSeparator="."
                decimalSeparator=","
                prefix="Rp "
                decimalScale={0}
                className="font-light"
            />
            <span className="font-semibold">{statusLabel}</span>
        </button>
    );
}
