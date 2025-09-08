import { forwardRef, useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";

export default forwardRef(function TextInput(
    { type = "text", className = "", isFocused = false, ...props },
    ref
) {
    const input = ref ? ref : useRef();

    useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, []);

    const baseClass =
        "block w-full rounded-md shadow-md border-secondary-300 shadow-sm " +
        "focus:border-primary-500 focus:ring-2 focus:ring-primary-500 hover:border-primary-500 dark:hover:border-primary-500 " +
        "dark:border-secondary-600 dark:bg-secondary-800 dark:text-white " +
        "placeholder:text-xs placeholder-secondary-400 dark:placeholder-secondary-500";

    return (
        <input
            {...props}
            type={type}
            className={twMerge(baseClass, className)}
            ref={input}
        />
    );
});
