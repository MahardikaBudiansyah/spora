import { ChevronDown } from "lucide-react";
import Dropdown from "@/Components/Common/Dropdown"; // Sesuaikan path
import Checkbox from "@/Components/Common/Checkbox"; // Sesuaikan path

export default function MultiSelectCheckboxInput({
    options = [],
    value = [], // Ini biasanya state dari useForm Inertia atau useState biasa
    onChange,
    placeholder = "Pilih opsi...",
    className = "",
}) {
    const selectedValues = Array.isArray(value) ? value : [];

    const handleToggle = (val, e) => {
        // Mencegah klik pada item menutup dropdown
        e.stopPropagation();

        let updated;
        if (selectedValues.includes(val)) {
            updated = selectedValues.filter((item) => item !== val);
        } else {
            updated = [...selectedValues, val];
        }

        if (onChange) onChange(updated);
    };

    const selectedLabels = options
        .filter((opt) => selectedValues.includes(opt.value))
        .map((opt) => opt.label)
        .join(", ");

    return (
        <Dropdown>
            <Dropdown.Trigger>
                <button
                    type="button"
                    className={`w-full flex justify-between items-center rounded-md border border-gray-300 dark:border-secondary-700 px-3 py-2 bg-white dark:bg-secondary-800 text-sm text-gray-700 dark:text-gray-200 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition ${className}`}
                >
                    <span className="truncate">
                        {selectedLabels || placeholder}
                    </span>
                    <ChevronDown className="ml-2 w-4 h-4 text-gray-400" />
                </button>
            </Dropdown.Trigger>

            <Dropdown.Content
                align="left"
                width="w-full"
                // Mencegah dropdown menutup saat area konten (background putihnya) diklik
                onClick={(e) => e.stopPropagation()}
                contentClasses="bg-white dark:bg-secondary-800 shadow-xl rounded-md p-1 max-h-60 overflow-y-auto border dark:border-secondary-700"
            >
                {options.length > 0 ? (
                    options.map((opt) => (
                        <div
                            key={opt.value}
                            className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-secondary-700 rounded transition-colors"
                            onClick={(e) => handleToggle(opt.value, e)}
                        >
                            <Checkbox
                                checked={selectedValues.includes(opt.value)}
                                readOnly // Karena handleToggle sudah dihandle oleh parent div
                                className="mr-3"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-200 select-none">
                                {opt.label}
                            </span>
                        </div>
                    ))
                ) : (
                    <div className="px-3 py-4 text-sm text-center text-gray-500 dark:text-gray-400">
                        Tidak ada opsi tersedia
                    </div>
                )}
            </Dropdown.Content>
        </Dropdown>
    );
}
