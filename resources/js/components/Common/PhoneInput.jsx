import { forwardRef, useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";
import { formatTo08 } from "@/utils/numberPhone";

export default forwardRef(function PhoneInput(
    {
        className = "",
        isFocused = false,
        value = "",
        onChange,
        isError = false,
        disabled = false,
        readOnly = false,
        onEnter = null,
        ...props
    },
    ref
) {
    const inputRef = ref || useRef();

    useEffect(() => {
        if (isFocused && inputRef.current && !disabled && !readOnly) {
            inputRef.current.focus();
        }
    }, [isFocused, disabled, readOnly]);

    const baseClass = twMerge(
        "block w-full px-3 py-2 rounded-md border shadow-sm " +
            "dark:bg-secondary-800 " +
            "border-secondary-300 dark:border-secondary-600 " +
            "hover:border-primary-500 hover:ring-1 hover:ring-primary-500 " +
            "focus:border focus:border-primary-500 focus:ring-1 focus:ring-primary-500 " +
            "placeholder:text-xs placeholder:text-secondary-400 dark:placeholder:text-secondary-500 ",

        isError &&
            "border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-red-500 hover:border-red-500 hover:ring-red-500",
        (disabled || readOnly) &&
            "text-secondary-400 dark:text-secondary-500 " +
                "bg-secondary-100 dark:bg-secondary-900 " +
                "hover:border-secondary-300 hover:ring-0 " +
                "focus:border-secondary-300 dark:border-secondary-600 focus:ring-0 " +
                "cursor-default ",
        className
    );

    const handleKeyDown = (e) => {
        if (onEnter && e.key === "Enter") {
            e.preventDefault();
            onEnter(e);
        }

        const allowed = /[0-9+\s]/;
        const controlKeys = [
            "Backspace",
            "Delete",
            "ArrowLeft",
            "ArrowRight",
            "Tab",
            "Enter",
        ];
        if (!allowed.test(e.key) && !controlKeys.includes(e.key)) {
            e.preventDefault();
        }
        if (props.onKeyDown) props.onKeyDown(e);
    };

    const handleChange = (e) => {
        if (readOnly) return;

        const rawValue = e.target.value;
        const formatted = formatTo08(rawValue);
        onChange?.({ target: { name: props.name, value: formatted } });
    };

    return (
        <input
            {...props}
            type="tel"
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="08XXXXXXXXXX"
            className={baseClass}
            ref={inputRef}
            disabled={disabled}
            readOnly={readOnly}
        />
    );
});
