import React from "react";
import { twMerge } from "tailwind-merge";

export default function DescriptionItem({
    label,
    value,
    children,
    layout = "stacked",
    className = "",
    labelClassName = "",
    valueClassName = "",
    renderFallback = true,
}) {
    const hasValue = value !== null && value !== undefined && value !== "";
    const hasChildren = React.Children.count(children) > 0;

    let displayValue;
    if (hasValue) {
        displayValue = value;
    } else if (hasChildren) {
        displayValue = children;
    } else if (renderFallback) {
        displayValue = (
            <span className="text-secondary-400 dark:text-secondary-500 font-normal italic">
                -
            </span>
        );
    }

    const isHorizontal = layout === "horizontal";

    return (
        <div
            className={twMerge(
                isHorizontal
                    ? "flex justify-between items-center w-full gap-4" // Gaya Rincian Biaya
                    : "space-y-1.5", // Gaya Informasi Konsumen (Lama)
                className
            )}
        >
            <span
                className={twMerge(
                    "block text-secondary-400 dark:text-secondary-400 uppercase font-bold tracking-wider",
                    isHorizontal ? "text-[11px]" : "text-[10px]",
                    labelClassName
                )}
            >
                {label}
            </span>
            <div
                className={twMerge(
                    "font-medium text-secondary-900 dark:text-white leading-relaxed",
                    isHorizontal ? "text-sm text-right" : "text-sm",
                    valueClassName
                )}
            >
                {displayValue}
            </div>
        </div>
    );
}
