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
    multiple = false,
    disabled = false,
    ...props
}) {
    const handleChange = (selected) => {
        if (multiple) {
            onChange(selected ? selected.map((s) => s.value) : []);
        } else {
            onChange(selected ? selected.value : null);
        }
    };

    const selectedOption = multiple
        ? options.filter((opt) =>
              Array.isArray(value) ? value.includes(opt.value) : false,
          )
        : options.find((opt) => opt.value === value) || null;

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
        }
    };

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
            isMultiple={multiple}
            isDisabled={disabled}
            onKeyDown={handleKeyDown}
            classNames={{
                menuButton: ({ isDisabled }) =>
                    twMerge(
                        "relative flex w-full px-3 rounded-md border shadow-sm text-sm ",
                        "dark:bg-secondary-800 border-secondary-300 dark:border-secondary-600 outline-none ",

                        !isDisabled &&
                            "hover:border-primary-500 hover:ring-1 hover:ring-primary-500 " +
                                "focus:border-primary-500 focus:ring-1 focus:ring-primary-500 cursor-pointer",

                        !value || (multiple && value.length === 0)
                            ? "text-secondary-400 dark:text-secondary-500 text-xs items-center"
                            : "text-secondary-900 dark:text-white",

                        isDisabled &&
                            "text-secondary-400 dark:text-secondary-500 " +
                                "bg-secondary-100 dark:bg-secondary-900 " +
                                "hover:border-secondary-300 hover:ring-0 " +
                                "focus:border-secondary-300 dark:border-secondary-600 focus:ring-0 " +
                                "cursor-default ",
                    ),
                menu: "absolute z-[900] w-full bg-white dark:bg-secondary-800 border border-secondary-300 dark:border-secondary-600 shadow-lg mt-1 py-1  max-h-60 overflow-auto custom-scrollbar ",
                listItem: ({ isSelected }) =>
                    `block transition duration-200 px-2 py-2 rounded text-xs text-left cursor-pointer capitalize ${
                        isSelected
                            ? "bg-primary-400 text-secondary-800"
                            : "hover:bg-primary-100 dark:hover:bg-primary-400 dark:hover:text-secondary-800"
                    }`,
                tagItem: ({ isDisabled }) =>
                    twMerge(
                        "flex-none bg-secondary-200 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-200 " +
                            "text-[10px] rounded px-1.5 py-0.5 gap-1",
                        isDisabled && "opacity-50 bg-gray-200 text-gray-500",
                    ),
                searchBox:
                    "pl-8 w-full bg-secondary-100 dark:bg-secondary-800 border-none rounded outline-none focus:ring-secondary-300 dark:focus:ring-secondary-600 text-xs placeholder:text-secondary-500",
                searchIcon: "absolute w-4 h-4 mt-2 ml-2 ",
                ChevronIcon: ({ open }) =>
                    twMerge(
                        "w-4 h-4 transition duration-300 text-red-500",
                        open
                            ? "text-red-500"
                            : "text-red-400 dark:text-red-500",
                    ),
            }}
            {...props}
        />
    );
}
