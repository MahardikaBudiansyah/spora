import { twMerge } from "tailwind-merge";
import { Info, CheckCircle, AlertTriangle, X } from "lucide-react";

const typeStyles = {
    info: "text-blue-800 bg-blue-100 dark:bg-blue-200 dark:text-blue-900",
    success:
        "text-green-800 bg-green-100 dark:bg-green-200 dark:text-green-900",
    warning:
        "text-yellow-800 bg-yellow-100 dark:bg-yellow-200 dark:text-yellow-900",
    error: "text-red-800 bg-red-100 dark:bg-red-200 dark:text-red-900",
};

const typeIcons = {
    info: <Info className="w-4 h-4 mr-2" />,
    success: <CheckCircle className="w-4 h-4 mr-2" />,
    warning: <AlertTriangle className="w-4 h-4 mr-2" />,
    error: <X className="w-4 h-4 mr-2" />,
};

export default function BannerAlert({
    type = "info",
    children,
    className = "",
    closable = false,
    onClose,
    ...props
}) {
    const baseClasses =
        "flex items-center justify-between p-4 my-4 text-sm rounded-lg";
    const typeClass = typeStyles[type] || typeStyles.info;
    const icon = typeIcons[type] || typeIcons.info;

    return (
        <div className={twMerge(baseClasses, typeClass, className)} {...props}>
            <div className="flex items-center">
                {icon}
                <span>{children}</span>
            </div>
            {closable && (
                <button
                    onClick={onClose}
                    className="ml-4 text-inherit hover:opacity-70"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    );
}
