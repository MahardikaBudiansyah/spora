import React from "react";
import { Link } from "@inertiajs/react";
import { twMerge } from "tailwind-merge";

export const Card = React.forwardRef(function Card(
    { children, className = "", onClick, href, ...props },
    ref
) {
    const baseClass =
        "bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-700 rounded-xl shadow-md overflow-hidden";
    const mergedClass = twMerge(baseClass, className);

    if (href) {
        return (
            <Link
                href={href}
                ref={ref}
                className={mergedClass}
                style={{ cursor: "pointer", display: "block" }}
                {...props}
            >
                {children}
            </Link>
        );
    }

    return (
        <div
            ref={ref}
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
            {...props}
        >
            {children}
        </div>
    );
});

Card.displayName = "Card";

export function CardHeader({ children, className = "" }) {
    const baseClass =
        "p-4 border-b border-secondary-200 dark:border-secondary-700";
    const mergedClass = twMerge(baseClass, className);

    return <div className={mergedClass}>{children}</div>;
}

export function CardBody({ children, className = "" }) {
    const baseClass = "p-4";
    const mergedClass = twMerge(baseClass, className);

    return <div className={mergedClass}>{children}</div>;
}

export function CardFooter({ children, className = "" }) {
    const baseClass =
        "p-4 border-t border-secondary-200 dark:border-secondary-700";
    const mergedClass = twMerge(baseClass, className);

    return <div className={mergedClass}>{children}</div>;
}
