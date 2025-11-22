import { useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { ChevronDown, ChevronRight } from "lucide-react";

export default function Tabs({
    tabs = [],
    defaultActive = 0,
    orientation = "horizontal",
    onChange,
    className = "",
    contentClassName = "",
}) {
    const [activeIndex, setActiveIndex] = useState(defaultActive);
    const [activeSubIndex, setActiveSubIndex] = useState(null);
    const [expandedTabs, setExpandedTabs] = useState({});

    const activeTab = tabs[activeIndex];

    useEffect(() => {
        if (activeTab && !activeTab.content && activeTab.children?.length > 0) {
            // otomatis buka group dan pilih subtab pertama
            setExpandedTabs((prev) => ({ ...prev, [activeIndex]: true }));
            setActiveSubIndex(0);
        } else {
            setActiveSubIndex(null);
        }
    }, [activeIndex, tabs]);

    const handleClick = (index) => {
        setActiveIndex(index);
        setActiveSubIndex(null);
        if (onChange) onChange(index, tabs[index]);
    };

    const handleSubClick = (parentIndex, subIndex) => {
        setActiveIndex(parentIndex);
        setActiveSubIndex(subIndex);
        if (onChange) onChange(subIndex, tabs[parentIndex].children[subIndex]);
    };

    const toggleExpand = (index) => {
        setExpandedTabs((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    // ✅ Tentukan konten aktif
    const activeContent =
        activeTab?.children && activeSubIndex !== null
            ? activeTab.children[activeSubIndex]?.content
            : activeTab?.content;

    return (
        <div
            className={twMerge(
                "w-full flex",
                orientation === "vertical" ? "flex-row" : "flex-col"
            )}
        >
            {/* Nav */}
            <div
                className={twMerge(
                    orientation === "horizontal"
                        ? "flex flex-row gap-2 border-b border-secondary-200 dark:border-secondary-700"
                        : "flex flex-col gap-2 border-secondary-200 dark:border-secondary-700 w-64"
                )}
            >
                {tabs.map((tab, index) => {
                    const isActive = index === activeIndex;
                    const hasChildren = !!tab.children;

                    return (
                        <div key={tab.id || index}>
                            <button
                                onClick={() =>
                                    hasChildren
                                        ? toggleExpand(index)
                                        : handleClick(index)
                                }
                                className={twMerge(
                                    "px-4 py-2 font-medium rounded-md transition-colors w-full flex items-center justify-between",
                                    className,
                                    orientation === "horizontal"
                                        ? isActive
                                            ? "border-b-2 border-primary text-primary"
                                            : "text-gray-500 hover:text-gray-700"
                                        : isActive
                                        ? "border-l-4 border-primary-600 text-primary-700 dark:text-white font-bold bg-primary-100 dark:bg-primary-900"
                                        : "border-l-4 border-transparent hover:text-primary-600 hover:bg-secondary-50 dark:hover:bg-secondary-800"
                                )}
                            >
                                {tab.label}
                                {hasChildren && (
                                    <span className="ml-2">
                                        {expandedTabs[index] ? (
                                            <ChevronDown className="w-4 h-4 text-gray-400" />
                                        ) : (
                                            <ChevronRight className="w-4 h-4 text-gray-400" />
                                        )}
                                    </span>
                                )}
                            </button>

                            {/* Sub Tabs */}
                            {hasChildren && expandedTabs[index] && (
                                <div className="ml-4 mt-1 flex flex-col gap-1">
                                    {tab.children.map((child, subIndex) => {
                                        const isSubActive =
                                            isActive &&
                                            subIndex === activeSubIndex;
                                        return (
                                            <button
                                                key={child.id || subIndex}
                                                onClick={() =>
                                                    handleSubClick(
                                                        index,
                                                        subIndex
                                                    )
                                                }
                                                className={twMerge(
                                                    "px-3 py-2 text-sm rounded-md transition-colors text-left",
                                                    isSubActive
                                                        ? "text-primary-700 dark:text-white font-bold bg-primary-100 dark:bg-primary-900"
                                                        : "hover:bg-primary-50 dark:hover:bg-primary-800"
                                                )}
                                            >
                                                {child.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Content */}
            <div
                className={twMerge(
                    "mt-4 flex-1 border-l border-secondary-200 dark:border-secondary-700 pl-4",
                    orientation === "vertical" && "mt-0 ml-4",
                    contentClassName
                )}
            >
                {activeContent || null}
            </div>
        </div>
    );
}
