import { forwardRef, useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";
import { NumericFormat } from "react-number-format";

export default forwardRef(function NumericInput(
    {
        value,
        onChange,
        isError,
        placeholder = "",
        prefix = "",
        suffix = "",
        thousandSeparator = ".",
        decimalSeparator = ",",
        decimalScale = null,
        fixedDecimalScale = false,
        allowNegative = false,
        disabled = false,
        readOnly = false,
        className = "",
        isFocused = false,
        ...props
    },
    ref
) {
    const inputRef = ref ? ref : useRef();

    useEffect(() => {
        if (isFocused && inputRef.current && !disabled && !readOnly) {
            inputRef.current.focus();
        }
    }, [isFocused, disabled, readOnly]);

    const baseClass = twMerge(
        "block w-full px-3 py-2 rounded-md border shadow-sm text-sm " +
            "dark:bg-secondary-800 " +
            "border-secondary-300 dark:border-secondary-600 " +
            "hover:border-primary-500 hover:ring-1 hover:ring-primary-500 " +
            "focus:border focus:border-primary-500 focus:ring-1 focus:ring-primary-500 " +
            "placeholder:text-xs placeholder:text-secondary-400 dark:placeholder:text-secondary-500 ",
        isError &&
            "border-red-500 dark:border-red-500 " +
                "focus:border-red-500 focus:ring-red-500 " +
                "hover:border-red-500 hover:ring-red-500 ",
        (disabled || readOnly) &&
            "text-secondary-400 dark:text-secondary-500 " +
                "bg-secondary-100 dark:bg-secondary-900 " +
                "hover:border-secondary-300 hover:ring-0 " +
                "focus:border-secondary-300 dark:border-secondary-600 focus:ring-0 " +
                "cursor-default ",
        className
    );

    return (
        <NumericFormat
            {...props}
            value={value ?? ""}
            getInputRef={inputRef}
            onFocus={(e) => {
                e.target.select();
            }}
            onValueChange={(values) =>
                onChange?.(values.value === "" ? null : values.value)
            }
            className={baseClass}
            placeholder={placeholder}
            prefix={prefix}
            suffix={suffix}
            thousandSeparator={thousandSeparator}
            decimalSeparator={decimalSeparator}
            decimalScale={decimalScale}
            fixedDecimalScale={fixedDecimalScale}
            allowNegative={allowNegative}
            disabled={disabled}
            readOnly={readOnly}
        />
    );
});
