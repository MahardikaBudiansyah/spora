import React from "react";

export default function ProgressBar({
    value = 0,
    max = 100,
    color = "cyan",
    size = "md",
    showLabel = false,
    labelSuffix = "%",
    className = "",
}) {
    const sizeClasses = {
        xs: "h-1",
        sm: "h-2",
        md: "h-3",
        lg: "h-5",
    };

    const colorClasses = {
        cyan: "bg-cyan-500",
        green: "bg-green-500",
        orange: "bg-orange-500",
        red: "bg-red-500",
        blue: "bg-blue-500",
    };

    const textColors = {
        cyan: "text-cyan-600 dark:text-cyan-400",
        green: "text-green-600 dark:text-green-400",
        orange: "text-orange-600 dark:text-orange-400",
        red: "text-red-600 dark:text-red-400",
        blue: "text-blue-600 dark:text-blue-400",
    };

    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
        <div className={`w-full ${className}`}>
            {showLabel && (
                <div className="flex justify-between items-center mb-1">
                    <span
                        className={`text-xs font-bold ${textColors[color] || textColors.cyan}`}
                    >
                        {percentage}%{" "}
                        {labelSuffix === "%" ? "Lengkap" : labelSuffix}
                    </span>
                </div>
            )}
            <div
                className={`w-full bg-secondary-100 dark:bg-secondary-700 rounded-full overflow-hidden ${sizeClasses[size]}`}
            >
                <div
                    className={`${colorClasses[color] || colorClasses.cyan} h-full transition-all duration-700 ease-out rounded-full`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}
