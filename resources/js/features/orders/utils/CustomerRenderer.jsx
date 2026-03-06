import React from "react";
import { formatTo08 } from "@/utils/numberPhone";
import { twMerge } from "tailwind-merge";

export const renderItemCustomer = (cust, input, isActive) => {
    const phone08 = formatTo08(cust.phone_number);
    const input08 = formatTo08(input);
    const index = phone08.indexOf(input08);

    const before = index >= 0 ? phone08.slice(0, index) : phone08;
    const match =
        index >= 0 ? phone08.slice(index, index + input08.length) : "";
    const after = index >= 0 ? phone08.slice(index + input08.length) : "";

    // Tentukan warna teks berdasarkan status aktif (hover/keyboard nav)
    const phoneColor = isActive
        ? "text-white dark:text-secondary-900"
        : "text-secondary-700 dark:text-white";

    const subInfoColor = isActive
        ? "text-white/90 dark:text-secondary-800"
        : "text-secondary-500 dark:text-secondary-400";

    return (
        <div className="flex flex-col">
            <div className={twMerge("font-semibold", phoneColor)}>
                {before}
                {match && (
                    <span className="font-bold text-primary-600 dark:text-primary-500">
                        {match}
                    </span>
                )}
                {after}
            </div>
            <div
                className={twMerge(
                    "text-xs transition-colors truncate",
                    subInfoColor
                )}
            >
                {cust.name} {cust.email ? `· ${cust.email}` : ""}
            </div>
        </div>
    );
};
