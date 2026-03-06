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

    const activeContent =
        activeTab?.children && activeSubIndex !== null
            ? activeTab.children[activeSubIndex]?.content
            : activeTab?.content;

    return (
        <div
            className={twMerge(
                "w-full flex",
                orientation === "vertical"
                    ? "flex-col md:flex-row"
                    : "flex-col",
            )}
        >
            <div
                className={twMerge(
                    orientation === "horizontal"
                        ? "flex flex-row gap-2 border-b border-secondary-200 dark:border-secondary-700 overflow-x-auto scrollbar-hide"
                        : "flex flex-col gap-2 border-secondary-200 dark:border-secondary-700 w-full md:w-64",
                )}
            >
                {tabs.map((tab, index) => {
                    const isActive = index === activeIndex;
                    const hasChildren = !!tab.children;

                    return (
                        <div
                            key={tab.id || index}
                            className={
                                orientation === "horizontal"
                                    ? "flex-shrink-0"
                                    : "w-full"
                            }
                        >
                            <button
                                type="button"
                                onClick={() =>
                                    hasChildren
                                        ? toggleExpand(index)
                                        : handleClick(index)
                                }
                                className={twMerge(
                                    "px-4 py-2 text-sm font-medium transition-colors flex items-center justify-between focus:outline-none",
                                    orientation === "horizontal"
                                        ? [
                                              "whitespace-nowrap",
                                              isActive
                                                  ? "border-b-2 border-primary-500 font-semibold text-primary-500"
                                                  : "text-secondary-400 hover:text-secondary-700 border-b-2 border-transparent",
                                          ]
                                        : [
                                              "w-full text-left",
                                              isActive
                                                  ? "border-l-4 border-primary-600 text-primary-700 dark:text-white font-bold bg-primary-100 dark:bg-primary-900 rounded-md md:rounded-r-md md:rounded-l-none"
                                                  : "border-l-4 border-transparent hover:text-primary-600 hover:bg-secondary-50 dark:hover:bg-secondary-800 rounded-md",
                                          ],
                                    className,
                                )}
                            >
                                {tab.label}
                                {hasChildren && (
                                    <span className="ml-2">
                                        {expandedTabs[index] ? (
                                            <ChevronDown className="w-4 h-4 text-secondary-400" />
                                        ) : (
                                            <ChevronRight className="w-4 h-4 text-secondary-400" />
                                        )}
                                    </span>
                                )}
                            </button>

                            {hasChildren && expandedTabs[index] && (
                                <divf className="ml-4 mt-1 flex flex-col gap-1">
                                    {tab.children.map((child, subIndex) => {
                                        const isSubActive =
                                            isActive &&
                                            subIndex === activeSubIndex;
                                        return (
                                            <button
                                                type="button"
                                                key={child.id || subIndex}
                                                onClick={() =>
                                                    handleSubClick(
                                                        index,
                                                        subIndex,
                                                    )
                                                }
                                                className={twMerge(
                                                    "px-3 py-2 text-sm rounded-md transition-colors text-left",
                                                    isSubActive
                                                        ? "text-primary-700 dark:text-white font-bold bg-primary-100 dark:bg-primary-900"
                                                        : "hover:bg-primary-50 dark:hover:bg-primary-800",
                                                )}
                                            >
                                                {child.label}
                                            </button>
                                        );
                                    })}
                                </divf>
                            )}

                            {orientation === "vertical" && isActive && (
                                <div className="block md:hidden py-4 px-2 border-b border-secondary-100 dark:border-secondary-800">
                                    {activeContent}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div
                className={twMerge(
                    "p-2 flex-1 dark:border-secondary-700 ",
                    orientation === "vertical"
                        ? "hidden md:block mt-0 md:mx-6 border-l"
                        : "block",
                    contentClassName,
                )}
            >
                {activeContent || null}
            </div>
        </div>
    );
}
