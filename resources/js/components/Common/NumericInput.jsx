import { forwardRef, useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";
import { NumericFormat } from "react-number-format";

export default forwardRef(function NumericInput(
    {
        value,
        onChange,
        placeholder = "",
        prefix = "", // misal "Rp "
        suffix = "", // misal "%"
        thousandSeparator = ".",
        decimalSeparator = ",",
        decimalScale = null, // jumlah angka di belakang koma, null = fleksibel
        fixedDecimalScale = false,
        allowNegative = false,
        disabled = false,
        className = "",
        isFocused = false,
        ...props
    },
    ref
) {
    const inputRef = ref ? ref : useRef();

    useEffect(() => {
        if (isFocused && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isFocused]);

    const baseClass =
        "block w-full rounded-md shadow-md border-secondary-300 shadow-sm " +
        "focus:border-primary-500 focus:ring-2 focus:ring-primary-500 hover:border-primary-500 dark:hover:border-primary-500 " +
        "dark:border-secondary-600 dark:bg-secondary-800 dark:text-white " +
        "placeholder:text-xs placeholder-secondary-400 dark:placeholder-secondary-500";

    return (
        <NumericFormat
            {...props}
            value={value ?? ""}
            getInputRef={inputRef}
            onValueChange={(values) =>
                onChange?.(values.value === "" ? null : values.value)
            }
            className={twMerge(baseClass, className)}
            placeholder={placeholder}
            prefix={prefix}
            suffix={suffix}
            thousandSeparator={thousandSeparator}
            decimalSeparator={decimalSeparator}
            decimalScale={decimalScale}
            fixedDecimalScale={fixedDecimalScale}
            allowNegative={allowNegative}
            disabled={disabled}
        />
    );
});
