import { forwardRef, useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";

export default forwardRef(function TextInput(
    {
        type = "text",
        className = "",
        variant = "default",
        isFocused = false,
        isError = false,
        disabled = false,
        readOnly = false,
        keepCaretOnFocus = false,
        onEnter = null,
        onValueChange = null,
        invalid = false,
        ...props
    },
    ref
) {
    const input = ref ? ref : useRef();

    // Fokus otomatis
    useEffect(() => {
        if (isFocused && input.current && !disabled && !readOnly) {
            input.current.focus();
            if (keepCaretOnFocus) {
                const len = input.current.value.length;
                input.current.setSelectionRange(len, len);
            }
        }
    }, [isFocused, disabled, readOnly, keepCaretOnFocus]);

    // Handler keydown
    const handleKeyDown = (e) => {
        if (onEnter && e.key === "Enter") {
            e.preventDefault();
            onEnter(e);
        }
        if (props.onKeyDown) props.onKeyDown(e);
    };

    // Handler change → dual mode
    const handleChange = (e) => {
        if (e && e.target) {
            // form lama
            props.onChange?.(e);
            onValueChange?.(e.target.value);
        } else {
            // inline editing
            onValueChange?.(e);
        }
    };

    // Styling berdasarkan variant
    const baseClass = twMerge(
        "block w-full px-3 py-2 rounded-md border shadow-sm text-sm " +
            "placeholder:text-xs placeholder:text-secondary-400 dark:placeholder:text-secondary-500 ",
        variant === "inline-edit"
            ? "bg-transparent " +
                  "border-transparent dark:border-transparent " +
                  "hover:border-primary-500 hover:ring-1 hover:ring-primary-500 " +
                  "focus:border focus:border-primary-500 focus:ring-1 focus:ring-primary-500 "
            : "dark:bg-secondary-800 " +
                  "border-secondary-300 dark:border-secondary-600 " +
                  "hover:border-primary-500 hover:ring-1 hover:ring-primary-500 " +
                  "focus:border focus:border-primary-500 focus:ring-1 focus:ring-primary-500 ",
        invalid
            ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
            : "hover:border-primary-500 focus:border-primary-500 focus:ring-primary-500",
        (disabled || readOnly) &&
            "text-secondary-400 dark:text-secondary-500 " +
                "bg-secondary-100 dark:bg-secondary-900 " +
                "hover:border-secondary-300 hover:ring-0 " +
                "focus:border-secondary-300 dark:border-secondary-600 focus:ring-0 " +
                "cursor-default ",
        isError &&
            "border-red-500 focus:border-red-500 focus:ring-red-500 dark:border-red-500",
        className
    );

    return (
        <input
            {...props}
            type={type}
            ref={input}
            className={baseClass}
            disabled={disabled}
            readOnly={readOnly}
            aria-invalid={invalid ? "true" : undefined}
            onKeyDown={handleKeyDown}
            onChange={handleChange}
        />
    );
});
