import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import { ChevronDown, ChevronRight } from "lucide-react";

export function AccordionItem({
    title,
    children,
    defaultOpen = false,
    className = "",
    headerLeft = null, // konten di kiri title
    headerRight = null, // konten di kanan title
}) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div
            className={twMerge(
                "border-b border-secondary-300 dark:border-secondary-700",
                className
            )}
        >
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className="w-full flex justify-between items-center py-2 px-3 text-left font-medium text-sm hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors rounded-md"
            >
                <div className="flex items-center gap-2">
                    {headerLeft}
                    <span>{title}</span>
                </div>

                {headerRight || (
                    <span>
                        {isOpen ? (
                            <ChevronDown className="w-4 h-4 text-secondary-500" />
                        ) : (
                            <ChevronRight className="w-4 h-4 text-secondary-500" />
                        )}
                    </span>
                )}
            </button>

            {isOpen && <div className="pl-4 pb-2">{children}</div>}
        </div>
    );
}

export function Accordion({ children, className = "" }) {
    return (
        <div className={twMerge("flex flex-col space-y-1", className)}>
            {children}
        </div>
    );
}
