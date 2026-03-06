import { Search } from "lucide-react";
import { twMerge } from "tailwind-merge";

export default function SearchInput({
    onClick,
    placeholder = "Cari...",
    readOnly = false,
    isError = false,
    className = "",
    ...props
}) {
    const inputClasses = twMerge(
        "pl-10 pr-4 py-2 w-full rounded-md text-xs dark:bg-secondary-800 " +
            "border-secondary-300 dark:border-secondary-600 " +
            "hover:border-primary-500 hover:ring-1 hover:ring-primary-500 " +
            "focus:border focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ",

        isError &&
            "border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-red-500 hover:border-red-500 hover:ring-red-500"
    );

    return (
        <div
            className={twMerge("relative cursor-pointer", className)}
            onClick={onClick}
        >
            <Search
                className={twMerge(
                    "absolute left-3 top-2 w-4 h-4 transition-colors",
                    isError
                        ? "text-red-500"
                        : "text-secondary-400 hover:text-secondary-500"
                )}
            />
            <input
                {...props}
                type="text"
                readOnly={readOnly}
                placeholder={placeholder}
                className={inputClasses}
            />
        </div>
    );
}
