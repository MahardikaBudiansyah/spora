import { twMerge } from "tailwind-merge";

export function Card({ children, className = "", onClick }) {
    const baseClass =
        "bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-700 rounded-2xl shadow-md overflow-hidden";
    const mergedClass = twMerge(baseClass, className);
    return (
        <div
            className={mergedClass}
            onClick={onClick}
            role={onClick ? "button" : undefined} // supaya aksesibilitas lebih baik
            tabIndex={onClick ? 0 : undefined} // agar bisa di-focus dan diklik pakai keyboard
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
}

export function CardHeader({ children, className = "" }) {
    const baseClass =
        "px-4 py-2 border-b border-secondary-200 dark:border-secondary-700";
    const mergedClass = twMerge(baseClass, className);

    return <div className={mergedClass}>{children}</div>;
}

export function CardBody({ children, className = "" }) {
    const baseClass = "px-4 py-2";
    const mergedClass = twMerge(baseClass, className);

    return <div className={mergedClass}>{children}</div>;
}

export function CardFooter({ children, className = "" }) {
    const baseClass =
        "px-4 py-2 border-t border-secondary-200 dark:border-secondary-700";
    const mergedClass = twMerge(baseClass, className);

    return <div className={mergedClass}>{children}</div>;
}
