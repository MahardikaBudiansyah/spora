import React from "react";
import { twMerge } from "tailwind-merge";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

export default function ToggleSwitch({
    checked = false,
    onChange,
    label,
    className = "", // container label + switch
    switchClassName = "", // div toggle
    handleClassName = "", // lingkaran toggle
    size = "md", // sm | md | lg
    icons = null, // label icon on/off
    innerContent = null, // content di dalam toggle
    tooltipOn = "",
    tooltipOff = "",
    labelPosition = "right", // right | left | top | bottom
}) {
    const sizes = {
        sm: "w-8 h-4 after:w-3 after:h-3 after:translate-x-1 peer-checked:after:translate-x-4",
        md: "w-12 h-6 after:w-5 after:h-5 after:translate-x-1 peer-checked:after:translate-x-6",
        lg: "w-12 h-7 after:w-6 after:h-6 after:translate-x-1 peer-checked:after:translate-x-5",
    };

    const innerSizes = {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
    };

    const positionClasses = {
        right: "flex-row items-center gap-2",
        left: "flex-row-reverse items-center gap-2",
        top: "flex-col-reverse items-center gap-1",
        bottom: "flex-col items-center gap-1",
    };

    // Toggle div with inner content
    const toggleDiv = (
        <div
            className={twMerge(
                "relative rounded-full bg-secondary-300 dark:bg-secondary-800 peer-checked:bg-primary-600 dark:peer-checked:bg-primary-500 transition-colors",
                "after:content-[''] after:absolute after:bg-white after:rounded-full after:top-0.5 after:left-0.5 after:transition-all",
                sizes[size],
                switchClassName,
                handleClassName
            )}
        >
            {innerContent && (
                <div
                    className={twMerge(
                        "absolute inset-0 flex items-center justify-center pointer-events-none",
                        innerSizes[size]
                    )}
                >
                    {typeof innerContent === "function"
                        ? innerContent(checked)
                        : innerContent}
                </div>
            )}
        </div>
    );

    return (
        <label
            className={twMerge(
                "inline-flex cursor-pointer relative group",
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

            {tooltipOn || tooltipOff ? (
                <Tippy content={checked ? tooltipOn : tooltipOff} delay={100}>
                    {toggleDiv}
                </Tippy>
            ) : (
                toggleDiv
            )}

            {label && (
                <span className="flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-gray-300">
                    {checked && icons?.on}
                    {!checked && icons?.off}
                    {label}
                </span>
            )}
        </label>
    );
}
