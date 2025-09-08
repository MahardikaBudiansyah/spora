import Select from "react-tailwindcss-select";
import { twMerge } from "tailwind-merge";

export default function SelectInput({
    id,
    name,
    value,
    onChange,
    options = [],
    className = "",
    isClearable = false,
    isSearchable = true,
    placeholder = "Pilih...",
    multiple = false, // <-- default single, bisa diubah saat pemanggilan
    ...props
}) {
    // Handle change untuk single atau multi
    const handleChange = (selected) => {
        if (multiple) {
            // Multi select: simpan array value
            onChange(selected ? selected.map((s) => s.value) : []);
        } else {
            // Single select: simpan string
            onChange(selected ? selected.value : null);
        }
    };

    // Sesuaikan selectedOption untuk single/multi
    const selectedOption = multiple
        ? options.filter((opt) =>
              Array.isArray(value) ? value.includes(opt.value) : false
          )
        : options.find((opt) => opt.value === value) || null;

    return (
        <Select
            id={id}
            name={name}
            value={selectedOption}
            onChange={handleChange}
            options={options}
            placeholder={placeholder}
            searchInputPlaceholder="Cari..."
            isClearable={isClearable}
            isSearchable={isSearchable}
            isMultiple={multiple} // <-- penting
            styles={{
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
            }}
            classNames={{
                menuButton: ({ isDisabled }) =>
                    twMerge(
                        "flex justify-between text-sm text-left py-0.5 px-3 w-full bg-white dark:bg-secondary-800 rounded-md border border-secondary-300 dark:border-secondary-600 shadow-sm cursor-pointer focus:outline-none ",
                        isDisabled
                            ? "bg-secondary-200 dark:bg-secondary-900"
                            : "hover:border-primary-500 dark:hover:border-primary-500 focus:ring-2 focus:ring-primary-500",
                        !value || (multiple && value.length === 0)
                            ? "text-secondary-400 dark:text-secondary-500 text-xs items-center cursor-pointer "
                            : "text-secondary-900 dark:text-white cursor-pointer ",
                        className
                    ),
                menu: "absolute z-10 w-full bg-white dark:bg-secondary-800 border border-secondary-300 dark:border-secondary-600 shadow-lg mt-1 py-1  max-h-60 overflow-auto custom-scrollbar ",
                listItem: ({ isSelected }) =>
                    `block transition duration-200 px-3 py-2 rounded text-xs text-left cursor-pointer capitalize ${
                        isSelected
                            ? "bg-primary-400 text-secondary-800"
                            : "hover:bg-primary-100 dark:hover:bg-primary-400 dark:hover:text-secondary-800"
                    }`,
                searchBox:
                    "pl-8 w-full bg-secondary-100 dark:bg-secondary-800 border-none rounded outline-none focus:ring-secondary-300 dark:focus:ring-secondary-600 text-xs placeholder:text-secondary-500",
                searchIcon: "absolute w-4 h-4 mt-2 ml-2 text-secondary-500",
            }}
            {...props}
        />
    );
}
