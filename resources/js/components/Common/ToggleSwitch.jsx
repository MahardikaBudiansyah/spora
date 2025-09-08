import React from "react";
import { twMerge } from "tailwind-merge";

export default function ToggleSwitch({
    checked = false,
    onChange,
    label,
    className = "",
    size = "md", // sm, md, lg
    icons = null, // { on: <IconOn />, off: <IconOff /> }
    tooltipOn = "",
    tooltipOff = "",
    labelPosition = "right", // left | right | top | bottom
}) {
    const sizes = {
        sm: "w-8 h-4 after:w-3 after:h-3 after:translate-x-1 peer-checked:after:translate-x-4",
        md: "w-12 h-6 after:w-5 after:h-5 after:translate-x-1 peer-checked:after:translate-x-6",
        lg: "w-16 h-8 after:w-7 after:h-7 after:translate-x-1 peer-checked:after:translate-x-8",
    };

    // Atur orientasi label + switch
    const positionClasses = {
        right: "flex-row items-center gap-2",
        left: "flex-row-reverse items-center gap-2",
        top: "flex-col-reverse items-center gap-1",
        bottom: "flex-col items-center gap-1",
    };

    return (
        <label
            className={twMerge(
                "text-balance inline-flex cursor-pointer relative group",
                positionClasses[labelPosition],
                className
            )}
        >
            <input
                type="checkbox"
                className="sr-only peer"
                checked={checked}
                onChange={(e) => onChange?.(e.target.checked)}
            />
            <div
                className={twMerge(
                    "relative rounded-full bg-secondary-300 dark:bg-secondary-800 peer-checked:bg-primary-500 dark:peer-checked:bg-primary-900 transition-colors",
                    "after:content-[''] after:absolute after:bg-white after:rounded-full after:top-0.5 after:left-0.5 after:transition-all",
                    sizes[size]
                )}
            ></div>

            {label && (
                <span className="flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-gray-300">
                    {checked && icons?.on}
                    {!checked && icons?.off}
                    {label}
                </span>
            )}

            {(tooltipOn || tooltipOff) && (
                <div className="absolute -top-9 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap pointer-events-none">
                    {checked ? tooltipOn : tooltipOff}
                </div>
            )}
        </label>
    );
}
