import { MoreVertical } from "lucide-react";
import { twMerge } from "tailwind-merge";

export default function KebabButton({
    isOpen,
    onClick,
    ariaControls,
    className,
    iconClassName,
}) {
    return (
        <button
            onClick={onClick}
            type="button"
            className={twMerge(
                "inline-flex items-center justify-center text-sm text-secondary-600 dark:text-secondary-300",
                className,
            )}
            aria-controls={ariaControls}
            aria-expanded={isOpen}
        >
            <span className="sr-only">Open main menu</span>
            <MoreVertical className={twMerge("w-6 h-6", iconClassName)} />
        </button>
    );
}
