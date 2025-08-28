import { forwardRef, useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";
import { formatTo08 } from "@/utils/numberPhone";

/**
 * PhoneInput
 * Props:
 * - value: string
 * - onChange: function({ target: { name, value } })
 * - isFocused: boolean, auto focus
 * - className: tambahan class Tailwind
 * - ...props: id, name, placeholder, required, dll
 */
export default forwardRef(function PhoneInput(
    { className = "", isFocused = false, value = "", onChange, ...props },
    ref
) {
    const inputRef = ref || useRef();

    useEffect(() => {
        if (isFocused && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isFocused]);

    const baseClass =
        "block w-full rounded-md shadow-md border-secondary-300 shadow-sm " +
        "focus:border-primary-500 focus:ring-2 focus:ring-primary-500 hover:border-primary-500 " +
        "dark:border-secondary-600 dark:bg-secondary-800 dark:text-white " +
        "placeholder:text-xs placeholder:italic placeholder-secondary-400 dark:placeholder-secondary-500";

    const handleKeyDown = (e) => {
        // Hanya izinkan angka, +, spasi
        const allowed = /[0-9+\s]/;
        const controlKeys = [
            "Backspace",
            "Delete",
            "ArrowLeft",
            "ArrowRight",
            "Tab",
        ];
        if (!allowed.test(e.key) && !controlKeys.includes(e.key)) {
            e.preventDefault();
        }
    };

    const handleChange = (e) => {
        const rawValue = e.target.value;
        const formatted = formatTo08(rawValue); // otomatis ke 08xxxx
        // Kirim format ke parent sesuai konvensi event target
        onChange?.({ target: { name: props.name, value: formatted } });
    };

    return (
        <input
            {...props}
            type="tel"
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className={twMerge(baseClass, className)}
            ref={inputRef}
        />
    );
});
