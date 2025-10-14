import { useState, useEffect } from "react";
import Dropdown from "@/components/Common/Dropdown"; // path sesuaikan
import Checkbox from "@/components/Common/Checkbox";
import { ChevronDown } from "lucide-react";

export default function MultiSelectCheckboxInput({
    options = [], // [{ value: 1, label: "Option 1" }]
    value = [],
    onChange,
    placeholder = "Pilih opsi...",
}) {
    const [selectedValues, setSelectedValues] = useState(value);

    useEffect(() => {
        setSelectedValues(value);
    }, [value]);

    const handleToggle = (val) => {
        let updated;
        if (selectedValues.includes(val)) {
            updated = selectedValues.filter((item) => item !== val);
        } else {
            updated = [...selectedValues, val];
        }
        setSelectedValues(updated);
        if (onChange) onChange(updated);
    };

    const selectedLabels = options
        .filter((opt) => selectedValues.includes(opt.value))
        .map((opt) => opt.label)
        .join(", ");

    return (
        <Dropdown>
            {/* Trigger */}
            <Dropdown.Trigger>
                <button
                    type="button"
                    className="w-full flex justify-between items-center rounded-md border border-secondary-300 dark:border-secondary-600 px-3 py-2 bg-white dark:bg-secondary-800 text-sm text-gray-700 dark:text-gray-200 shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500 hover:border-primary-500 dark:hover:border-primary-500 "
                >
                    <span className="truncate ">
                        {selectedLabels || placeholder}
                    </span>
                    <ChevronDown className="w-4 h-4 text-secondary-400" />
                </button>
            </Dropdown.Trigger>

            {/* Content */}
            <Dropdown.Content
                align="left"
                contentClasses="bg-white dark:bg-secondary-800 shadow-lg rounded-md p-2 max-h-64 w-full overflow-y-auto"
            >
                {options.length > 0 ? (
                    options.map((opt) => (
                        <label
                            key={opt.value}
                            className="flex items-center px-2 py-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-secondary-700 rounded"
                        >
                            <Checkbox
                                checked={selectedValues.includes(opt.value)}
                                onChange={() => handleToggle(opt.value)}
                                className="mr-2"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-200">
                                {opt.label}
                            </span>
                        </label>
                    ))
                ) : (
                    <div className="px-2 py-1 text-sm text-gray-400">
                        Tidak ada opsi
                    </div>
                )}
            </Dropdown.Content>
        </Dropdown>
    );
}
