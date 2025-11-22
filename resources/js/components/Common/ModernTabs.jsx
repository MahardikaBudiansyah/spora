import { useState } from "react";
import { twMerge } from "tailwind-merge";

export default function ModernTabs({
    tabs = [],
    defaultActive = 0,
    orientation = "horizontal", // horizontal | vertical
    onChange,
    className = "",
    contentClassName = "",
}) {
    const [active, setActive] = useState(defaultActive);

    const handleClick = (index) => {
        setActive(index);
        if (onChange) onChange(index, tabs[index]);
    };

    const isVertical = orientation === "vertical";

    return (
        <div
            className={twMerge(
                "w-full flex",
                isVertical ? "flex-row" : "flex-col",
                className
            )}
        >
            {/* Tabs Navigation */}
            <div
                className={twMerge(
                    isVertical
                        ? "flex flex-col w-56 border-r border-secondary-200 dark:border-secondary-700"
                        : "flex flex-row gap-2 border-b border-secondary-200 dark:border-secondary-700 overflow-x-auto no-scrollbar"
                )}
            >
                {tabs.map((tab, i) => {
                    const activeStyle = isVertical
                        ? "bg-primary-100 dark:bg-primary-900 text-primary font-semibold border-l-4 border-primary"
                        : "border-b-2 border-primary text-primary font-semibold";

                    return (
                        <button
                            key={i}
                            onClick={() => handleClick(i)}
                            className={twMerge(
                                "px-4 py-2 whitespace-nowrap text-gray-600 dark:text-gray-300 hover:text-primary transition-colors",
                                active === i && activeStyle
                            )}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Content */}
            <div
                className={twMerge(
                    "flex-1 p-4",
                    isVertical
                        ? "border-l border-secondary-200 dark:border-secondary-700"
                        : "",
                    contentClassName
                )}
            >
                {tabs[active]?.content}
            </div>
        </div>
    );
}
