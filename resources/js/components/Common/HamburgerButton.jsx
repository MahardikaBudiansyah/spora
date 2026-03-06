import { Menu } from "lucide-react";

export default function HamburgerButton({
    isOpen,
    onClick,
    ariaControls,
    className = "md:hidden",
}) {
    return (
        <button
            onClick={onClick}
            type="button"
            className={`inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-600 rounded-lg hover:bg-secondary-100 focus:outline-none focus:ring-2 focus:ring-secondary-200 dark:text-gray-300 dark:hover:bg-secondary-700 dark:focus:ring-secondary-600 transition-colors ${className}`}
            aria-controls={ariaControls}
            aria-expanded={isOpen}
        >
            <span className="sr-only">Open main menu</span>
            <Menu className="w-6 h-6" />
        </button>
    );
}
