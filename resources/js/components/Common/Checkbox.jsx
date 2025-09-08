import { twMerge } from "tailwind-merge";
import { useRef, useEffect } from "react";

export default function Checkbox({
    className = "",
    indeterminate = false,
    ...props
}) {
    const ref = useRef(null);

    useEffect(() => {
        if (ref.current) {
            // Atur properti indeterminate langsung di DOM
            ref.current.indeterminate = !!indeterminate;
        }
    }, [indeterminate]);

    return (
        <input
            {...props}
            ref={ref}
            type="checkbox"
            className={twMerge(
                "rounded bg-white dark:bg-secondary-800 border-secondary-300 dark:border-secondary-500 text-primary-500 dark:text-primary-400 shadow-sm focus:ring-primary-400 dark:focus:ring-primary-400 focus:border-primary-400 dark:focus:border-primary-400 cursor-pointer hover:border-primary-500 dark:hover:border-primary-500",
                className
            )}
        />
    );
}
