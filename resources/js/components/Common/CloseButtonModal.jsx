import { X } from "lucide-react";
import PropTypes from "prop-types";

export default function CloseButtonModal({ onClose }) {
    CloseButtonModal.propTypes = {
        onClose: PropTypes.func.isRequired,
    };

    return (
        <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-white"
        >
            <X className="w-5 h-5" />
        </button>
    );
}
