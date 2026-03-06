import { X } from "lucide-react";
import PropTypes from "prop-types";
import { twMerge } from "tailwind-merge";

export default function CloseButtonModal({ onClose, className = "" }) {
    CloseButtonModal.propTypes = {
        onClose: PropTypes.func.isRequired,
    };

    return (
        <button
            type="button"
            onClick={onClose}
            className={twMerge(
                `absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-white focus:outline-none`,
                className,
            )}
        >
            <X className="w-5 h-5" />
        </button>
    );
}
