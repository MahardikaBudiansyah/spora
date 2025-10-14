import React from "react";
import { twMerge } from "tailwind-merge";

/**
 * 🧩 Card — komponen container fleksibel dengan dukungan ref dan onClick.
 */
export const Card = React.forwardRef(function Card(
    { children, className = "", onClick },
    ref
) {
    const baseClass =
        "bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-700 rounded-2xl shadow-md overflow-hidden";
    const mergedClass = twMerge(baseClass, className);

    return (
        <div
            ref={ref} // ✅ agar bisa di-scroll atau diakses lewat ref
            className={mergedClass}
            onClick={onClick}
            role={onClick ? "button" : undefined}
            tabIndex={onClick ? 0 : undefined}
            onKeyDown={(e) => {
                if (onClick && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    onClick(e);
                }
            }}
            style={onClick ? { cursor: "pointer" } : undefined}
        >
            {children}
        </div>
    );
});

// Tambahkan displayName agar muncul di React DevTools
Card.displayName = "Card";

/**
 * 🧩 Bagian header dari Card
 */
export function CardHeader({ children, className = "" }) {
    const baseClass =
        "px-4 py-2 border-b border-secondary-200 dark:border-secondary-700";
    const mergedClass = twMerge(baseClass, className);

    return <div className={mergedClass}>{children}</div>;
}

/**
 * 🧩 Bagian body dari Card
 */
export function CardBody({ children, className = "" }) {
    const baseClass = "px-4 py-2";
    const mergedClass = twMerge(baseClass, className);

    return <div className={mergedClass}>{children}</div>;
}

/**
 * 🧩 Bagian footer dari Card
 */
export function CardFooter({ children, className = "" }) {
    const baseClass =
        "px-4 py-2 border-t border-secondary-200 dark:border-secondary-700";
    const mergedClass = twMerge(baseClass, className);

    return <div className={mergedClass}>{children}</div>;
}
