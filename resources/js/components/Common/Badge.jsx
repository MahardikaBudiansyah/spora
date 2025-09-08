import { twMerge } from "tailwind-merge";

export default function Badge({ children, color = "gray", className = "" }) {
    const baseStyle =
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium";

    const colorMap = {
        gray: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100",
        green: "bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100",
        red: "bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100",
        blue: "bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-100",
        yellow: "bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100",
        indigo: "bg-indigo-100 text-indigo-800 dark:bg-indigo-700 dark:text-indigo-100",
        cyan: "bg-cyan-100 text-cyan-800 dark:bg-cyan-700 dark:text-cyan-100",
    };

    const combined = twMerge(
        baseStyle,
        colorMap[color] || colorMap.gray,
        className
    );

    return <span className={combined}>{children}</span>;
}
