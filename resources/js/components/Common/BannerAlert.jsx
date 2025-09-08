import { twMerge } from "tailwind-merge";
import {
    Info,
    CheckCircle,
    AlertTriangle,
    X,
    TriangleAlert,
} from "lucide-react";

const variantStyles = {
    subtle: {
        info: "text-blue-800 bg-blue-100 dark:bg-blue-200 dark:text-blue-900",
        success:
            "text-green-800 bg-green-100 dark:bg-green-200 dark:text-green-900",
        warning:
            "text-yellow-800 bg-yellow-100 dark:bg-yellow-200 dark:text-yellow-900",
        error: "text-red-800 bg-red-100 dark:bg-red-200 dark:text-red-900",
    },
    solid: {
        info: "text-white bg-blue-600 dark:bg-blue-700",
        success: "text-white bg-green-600 dark:bg-green-700",
        warning: "text-white bg-yellow-600 dark:bg-yellow-700",
        error: "text-white bg-red-600 dark:bg-red-700",
    },
    outline: {
        info: "text-blue-800 border border-blue-600 bg-transparent dark:text-blue-400",
        success:
            "text-green-800 border border-green-600 bg-transparent dark:text-green-400",
        warning:
            "text-yellow-800 border border-yellow-600 bg-transparent dark:text-yellow-400",
        error: "text-red-800 border border-red-600 bg-transparent dark:text-red-400",
    },
};

const sizeStyles = {
    sm: "p-2 text-xs",
    md: "p-4 text-sm",
    lg: "p-6 text-base",
};

const iconSizes = {
    xs: "w-2 h-2",
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
};

const typeIcons = {
    info: (size) => <Info className={`${size} mr-2`} />,
    success: (size) => <CheckCircle className={`${size} mr-2`} />,
    warning: (size) => <AlertTriangle className={`${size} mr-2`} />,
    error: (size) => <TriangleAlert className={`${size} mr-2`} />,
};

export default function BannerAlert({
    type = "info",
    variant = "subtle",
    size = "md",
    typeIconSize, // ukuran icon tipe
    closeIconSize, // ukuran icon close
    showIcon = true, // kontrol apakah type icon muncul
    customIcon = null, // custom icon override
    title,
    children,
    className = "",
    closable = false,
    onClose,
    ...props
}) {
    // base class → default items-center biar rapi
    const baseClasses = "flex items-center justify-between my-4 rounded-lg";
    const variantClass =
        variantStyles[variant]?.[type] || variantStyles.subtle.info;
    const sizeClass = sizeStyles[size] || sizeStyles.md;

    // resolusi ukuran ikon
    const resolvedTypeIconSize = typeIconSize || iconSizes[size];
    const resolvedCloseIconSize = closeIconSize || iconSizes[size];

    // pilih ikon: custom > bawaan > default info
    const icon = customIcon
        ? customIcon
        : typeIcons[type]?.(resolvedTypeIconSize) ??
          typeIcons.info(iconSizes.md);

    return (
        <div
            className={twMerge(baseClasses, variantClass, sizeClass, className)}
            {...props}
        >
            <div className="flex items-center">
                {showIcon && icon}
                <div className="flex flex-col">
                    {title && <span className="font-semibold">{title}</span>}
                    <span>{children}</span>
                </div>
            </div>
            {closable && (
                <button
                    onClick={onClose}
                    className="ml-4 text-inherit hover:opacity-70"
                >
                    <X className={resolvedCloseIconSize} />
                </button>
            )}
        </div>
    );
}
