import { forwardRef, useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";

export default forwardRef(function TextInput(
    {
        type = "text",
        className = "",
        isFocused = false,
        disabled = false,
        readOnly = false,
        ...props
    },
    ref
) {
    const input = ref ? ref : useRef();

    useEffect(() => {
        if (isFocused && input.current && !disabled && !readOnly) {
            input.current.focus();
        }
    }, [isFocused, disabled, readOnly]);

    const baseClass = twMerge(
        "block w-full rounded-md shadow-md border-secondary-300 shadow-sm " +
            "focus:border-primary-500 focus:ring-2 focus:ring-primary-500 hover:border-primary-500 dark:hover:border-primary-500 " +
            "dark:border-secondary-600 dark:bg-secondary-800 dark:text-white " +
            "placeholder:text-xs placeholder-secondary-400 dark:placeholder-secondary-500 ",
        (disabled || readOnly) &&
            "bg-gray-100 dark:bg-secondary-700 text-gray-500 dark:text-gray-400 cursor-not-allowed border-secondary-300 dark:border-secondary-600 focus:ring-0 focus:border-secondary-300 hover:border-secondary-300 ",
        className
    );

    return (
        <input
            {...props}
            type={type}
            className={baseClass}
            ref={input}
            disabled={disabled}
            readOnly={readOnly}
        />
    );
});
