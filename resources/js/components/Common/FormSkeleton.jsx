// components/Common/FormSkeleton.jsx
import React from "react";

export default function FormSkeleton({ className = "" }) {
    return (
        <div className={`animate-pulse p-4 flex flex-col gap-6 ${className}`}>
            {/* Header Skeleton */}
            <div className="h-6 bg-stone-200 dark:bg-stone-800 rounded w-1/3 mb-2" />

            <div className="flex flex-col gap-5">
                {/* Field 1: Venue Selection */}
                <div className="space-y-2">
                    <div className="h-3 bg-stone-200 dark:bg-stone-800 rounded w-20" />
                    <div className="h-10 bg-stone-100 dark:bg-stone-900 rounded w-full" />
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                    {/* Kolom Kiri: Inputs */}
                    <div className="w-full space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="space-y-2">
                                <div className="h-3 bg-stone-200 dark:bg-stone-800 rounded w-24" />
                                <div className="h-10 bg-stone-100 dark:bg-stone-900 rounded w-full" />
                            </div>
                        ))}
                    </div>

                    {/* Kolom Kanan: Notes/TextArea */}
                    <div className="w-full space-y-2">
                        <div className="h-3 bg-stone-200 dark:bg-stone-800 rounded w-20" />
                        <div className="h-40 bg-stone-100 dark:bg-stone-900 rounded w-full" />
                    </div>
                </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-2 mt-4">
                <div className="h-8 bg-stone-100 dark:bg-stone-800 rounded w-20" />
                <div className="h-8 bg-stone-200 dark:bg-stone-700 rounded w-32" />
            </div>
        </div>
    );
}
