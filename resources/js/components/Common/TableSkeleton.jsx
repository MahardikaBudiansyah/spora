import React from "react";

export default function TableSkeleton({
    columns,
    rows = 5,
    className = "",
    showPagination = true, // Tambahkan props ini
}) {
    return (
        <div className={`w-full overflow-hidden ${className}`}>
            <div className="flex flex-col w-full bg-white dark:bg-transparent">
                {/* Header Skeleton */}
                <div className="flex border-b border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/30">
                    {columns.map((col, index) => (
                        <div
                            key={`head-skel-${index}`}
                            className={`p-4 flex-1 items-center justify-center ${
                                col.className || ""
                            }`}
                        >
                            <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded animate-pulse w-2/3 mx-auto" />
                        </div>
                    ))}
                </div>

                {/* Body Skeleton */}
                {[...Array(rows)].map((_, rowIndex) => (
                    <div
                        key={`row-skel-${rowIndex}`}
                        className="flex border-b border-stone-100 dark:border-stone-900 last:border-0 items-center"
                    >
                        {columns.map((col, colIndex) => (
                            <div
                                key={`col-skel-${colIndex}`}
                                className={`p-4 flex-1 ${col.className || ""}`}
                            >
                                <div
                                    className={`h-3 bg-stone-100 dark:bg-stone-900 rounded animate-pulse mx-auto ${
                                        colIndex === 1 ? "w-3/4" : "w-1/2"
                                    }`}
                                />
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {/* Pagination Skeleton (Kondisional) */}
            {showPagination && (
                <div className="p-4 flex justify-between items-center border-t border-stone-100 dark:border-stone-900">
                    <div className="h-4 bg-stone-100 dark:bg-stone-900 rounded w-32 animate-pulse" />
                    <div className="flex gap-2">
                        <div className="h-8 w-8 bg-stone-100 dark:bg-stone-900 rounded animate-pulse" />
                        <div className="h-8 w-8 bg-stone-100 dark:bg-stone-900 rounded animate-pulse" />
                    </div>
                </div>
            )}
        </div>
    );
}
