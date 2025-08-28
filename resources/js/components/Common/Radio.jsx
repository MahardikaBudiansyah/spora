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

    const baseLabel = twMerge(
        "flex items-start rounded-2xl border p-3 transition-all",
        sizes.gap,
        "border-gray-300 dark:border-zinc-700",
        "hover:border-gray-400 dark:hover:border-zinc-600",
        disabled && "opacity-60 cursor-not-allowed",
        invalid && "border-red-500 ring-2 ring-red-200/60 dark:ring-red-500/20",
        className
    );

    const controlClass = twMerge(
        "relative inline-flex flex-shrink-0 items-center justify-center rounded-full border",
        sizes.control,
        "border-gray-400 dark:border-zinc-500 bg-white dark:bg-zinc-900",
        "transition-all",
        "peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-primary/60 dark:peer-focus-visible:ring-primary/40",
        invalid && "border-red-500"
    );

    const dotClass = twMerge(
        "pointer-events-none rounded-full opacity-0 scale-75 transform transition",
        sizes.dot,
        "peer-checked:opacity-100 peer-checked:scale-100",
        "bg-primary"
    );

    const textWrap = twMerge(
        "flex flex-col",
        sizes.gap.replace("gap-", "space-y-")
    );
    const labelClass = twMerge("font-medium text-foreground", sizes.label);
    const descClass = twMerge("text-muted-foreground", sizes.desc);

    return (
        <div className="relative w-full">
            <label htmlFor={id} className={baseLabel}>
                <input
                    id={id}
                    type="radio"
                    name={name}
                    value={String(value)}
                    className="peer sr-only"
                    disabled={disabled}
                    checked={checked}
                    onChange={(e) => onChange && onChange(e.target.value)}
                    aria-invalid={invalid || undefined}
                />

                <span aria-hidden className={controlClass}>
                    <span className={dotClass} />
                </span>

                <span className={textWrap}>
                    {label && <span className={labelClass}>{label}</span>}
                    {description && (
                        <span className={descClass}>{description}</span>
                    )}
                </span>
            </label>
        </div>
    );
}
