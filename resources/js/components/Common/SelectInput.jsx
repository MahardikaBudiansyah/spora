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
    ...props
}) {
    const handleChange = (selected) => {
        // Jika isClearable = true dan tidak dipilih apa-apa
        onChange(selected ? selected.value : "");
    };

    // Format opsi agar sesuai { value: string, label: string }
    const selectedOption = options.find((opt) => opt.value === value) || null;

    return (
        <Select
            id={id}
            name={name}
            value={selectedOption}
            onChange={handleChange}
            options={options}
            placeholder={placeholder}
            isClearable={isClearable}
            isSearchable={isSearchable}
            onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                    e.preventDefault();
                    // memaksa menu terbuka
                    e.currentTarget.click();
                }
            }}
            classNames={{
                menuButton: ({ isDisabled }) =>
                    twMerge(
                        "flex justify-between text-sm text-left py-0.5 px-3 w-full bg-white dark:bg-secondary-800 rounded-md border border-secondary-300 dark:border-secondary-600 shadow-sm cursor-pointer",
                        isDisabled
                            ? "bg-secondary-300"
                            : "hover:border-primary-500 dark:hover:border-primary-500 focus:ring-2 focus:ring-primary-500",
                        !value
                            ? "text-secondary-400 dark:text-secondary-500 italic text-xs cursor-pointer"
                            : "text-secondary-900 dark:text-white cursor-pointer",
                        className
                    ),
                menu: "absolute z-10 w-full bg-white dark:bg-secondary-800 border border-secondary-300 dark:border-secondary-600 rounded-md shadow-lg mt-1 max-h-60 overflow-auto custom-scrollbar",
                listItem: ({ isSelected }) =>
                    `block transition duration-200 px-3 py-2 text-sm text-left cursor-pointer capitalize ${
                        isSelected
                            ? "bg-primary-400 text-secondary-800"
                            : "hover:bg-primary-400 dark:hover:text-secondary-800"
                    }`,
            }}
            {...props}
        />
    );
}
