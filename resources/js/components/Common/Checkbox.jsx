import { twMerge } from "tailwind-merge";

export default function Checkbox({ className = "", ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={twMerge(
                "rounded bg-white dark:bg-secondary-800 border-secondary-300 dark:border-secondary-500 text-primary-600 shadow-sm focus:ring-primary-500 dark:focus:ring-primary-500 focus:border-primary-500 dark:focus:border-primary-500 cursor-pointer",
                className
            )}
        />
    );
}
