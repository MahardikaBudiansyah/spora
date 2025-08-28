import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { Card } from "@/components/common/Card";

export default function Tabs({
    tabs = [],
    defaultActive = 0,
    orientation = "horizontal", // 👈 tambahan prop
    onChange,
}) {
    const [activeIndex, setActiveIndex] = useState(defaultActive);

    const handleClick = (index) => {
        setActiveIndex(index);
        if (onChange) onChange(index, tabs[index]);
    };

    return (
        <div
            className={twMerge(
                "w-full flex",
                orientation === "vertical" && "flex-row"
            )}
        >
            {/* Nav */}
            <div
                className={twMerge(
                    orientation === "horizontal"
                        ? "flex gap-2 border-b border-secondary-200"
                        : "flex flex-col gap-2 border-secondary-200 w-48"
                )}
            >
                {tabs.map((tab, index) => (
                    <button
                        key={tab.id || index}
                        onClick={() => handleClick(index)}
                        className={twMerge(
                            "px-4 py-2 font-medium rounded-md transition-colors text-left",
                            orientation === "horizontal"
                                ? index === activeIndex
                                    ? "border-b-2 border-primary text-primary"
                                    : "text-gray-500 hover:text-gray-700"
                                : index === activeIndex
                                ? "border-l-4 border-primary-600 text-primary-500 dark:text-primary-400 bg-secondary-100 dark:bg-secondary-900"
                                : "border-l-4 border-transparent hover:text-primary-600 hover:bg-secondary-50 dark:hover:bg-secondary-800"
                        )}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div
                className={twMerge(
                    "mt-4 flex-1 border-l",
                    orientation === "vertical" && "mt-0 ml-4"
                )}
            >
                {tabs[activeIndex]?.content || null}
            </div>
        </div>
    );
}
