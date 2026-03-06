// components/Common/CardSkeleton.jsx
import React from "react";

export default function CardSkeleton({ grid = 4, className = "" }) {
    // Mapping jumlah grid ke class Tailwind
    const gridConfig = {
        1: "grid-cols-1",
        2: "grid-cols-1 md:grid-cols-2",
        3: "grid-cols-1 md:grid-cols-3",
        4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    };

    return (
        <div
            className={`grid ${
                gridConfig[grid] || gridConfig[4]
            } gap-4 ${className}`}
        >
            {[...Array(grid)].map((_, i) => (
                <div
                    key={i}
                    className="p-5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-sm animate-pulse"
                >
                    <div className="flex justify-between items-start mb-4">
                        {/* Label Skeleton */}
                        <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-24" />
                        {/* Icon Skeleton */}
                        <div className="h-10 w-10 bg-stone-100 dark:bg-stone-800 rounded-lg" />
                    </div>

                    {/* Value/Number Skeleton */}
                    <div className="h-8 bg-stone-200 dark:bg-stone-800 rounded w-32 mb-3" />

                    {/* Subtext/Trend Skeleton */}
                    <div className="h-3 bg-stone-100 dark:bg-stone-900 rounded w-20" />
                </div>
            ))}
        </div>
    );
}
