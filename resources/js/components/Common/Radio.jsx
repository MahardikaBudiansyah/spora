import React, { useId } from "react";
import { twMerge } from "tailwind-merge";

const sizeMap = {
    sm: {
        control: "h-4 w-4",
        dot: "h-2 w-2",
        label: "text-sm",
        desc: "text-xs",
        gap: "gap-2",
    },
    md: {
        control: "h-5 w-5",
        dot: "h-2.5 w-2.5",
        label: "text-base",
        desc: "text-sm",
        gap: "gap-3",
    },
    lg: {
        control: "h-6 w-6",
        dot: "h-3 w-3",
        label: "text-lg",
        desc: "text-sm",
        gap: "gap-3.5",
    },
};

export default function Radio({
    name,
    value,
    onChange,
    checked,
    label,
    description,
    disabled = false,
    invalid = false,
    size = "md",
    className,
}) {
    const id = useId();
    const sizes = sizeMap[size] ?? sizeMap.md;

    // Lingkaran Luar - Kita gunakan logic prop 'checked' agar pasti sinkron
    const controlClass = twMerge(
        "relative inline-flex flex-shrink-0 items-center justify-center  rounded-full border transition-all duration-200 mt-1",
        sizes.control,
        invalid
            ? "border-red-500"
            : checked
            ? "border-primary-600 ring-1 ring-primary-600"
            : "border-secondary-400",
        checked ? "bg-white" : "bg-white dark:bg-secondary-900",
        disabled && "bg-gray-100 dark:bg-secondary-900"
    );

    // Titik Tengah (Dot) - Menggunakan logic ternary agar tidak bergantung pada peer Tailwind
    const dotClass = twMerge(
        "pointer-events-none rounded-full transform transition-all duration-200 bg-primary-600 ",
        sizes.dot,
        checked ? "opacity-100 scale-100" : "opacity-0 scale-50"
    );

    const labelWrapperClass = twMerge(
        "flex items-start bg-white dark:bg-secondary-800 rounded-lg border p-3 transition-all cursor-pointer",
        sizes.gap,
        "border-secondary-300 dark:border-secondary-700",
        "hover:border-secondary-400 dark:hover:border-secondary-600",
        checked &&
            "border border-primary-500 bg-primary-50 dark:bg-primary-900/10 hover:border-primary-600",
        invalid && "border-red-500 ring-2 ring-red-200/60",
        disabled && "opacity-60 cursor-not-allowed",
        className
    );

    return (
        <div className="relative w-full">
            <label htmlFor={id} className={labelWrapperClass}>
                <input
                    id={id}
                    type="radio"
                    name={name}
                    value={String(value)}
                    className="sr-only"
                    disabled={disabled}
                    checked={checked}
                    onChange={(e) => onChange && onChange(e.target.value)}
                    aria-invalid={invalid ? "true" : undefined}
                />

                {/* Visual Radio Custom */}
                <span aria-hidden className={controlClass}>
                    <span className={dotClass} />
                </span>

                {/* Konten Teks */}
                <div className="flex flex-col leading-tight">
                    {label && (
                        <span
                            className={twMerge(
                                "font-medium text-gray-900 dark:text-white",
                                sizes.label
                            )}
                        >
                            {label}
                        </span>
                    )}
                    {description && (
                        <span
                            className={twMerge(
                                "text-gray-500 dark:text-secondary-400 mt-1",
                                sizes.desc
                            )}
                        >
                            {description}
                        </span>
                    )}
                </div>
            </label>
        </div>
    );
}
