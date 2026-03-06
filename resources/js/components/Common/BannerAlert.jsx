import { twMerge } from "tailwind-merge";
import {
    Info,
    CheckCircle,
    AlertTriangle,
    X,
    TriangleAlert,
} from "lucide-react";
import { motion } from "framer-motion";

const variantStyles = {
    subtle: {
        info: "text-blue-800 bg-blue-100 dark:bg-blue-400 dark:text-blue-900",
        success:
            "text-green-800 bg-green-100 dark:bg-green-400 dark:text-green-900",
        warning:
            "text-yellow-800 bg-yellow-100 dark:bg-yellow-400 dark:text-yellow-900",
        error: "text-red-800 bg-red-100 dark:bg-red-400 dark:text-red-900",
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
    xs: "py-3 px-4 text-xs",
    sm: "py-2 px-4 text-sm",
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
    info: (size) => <Info className={`${size}`} />,
    success: (size) => <CheckCircle className={`${size}`} />,
    warning: (size) => <AlertTriangle className={`${size}`} />,
    error: (size) => <TriangleAlert className={`${size}`} />,
};
export default function BannerAlert({
    type = "info",
    variant = "subtle",
    size = "md",
    typeIconSize,
    closeIconSize,
    showIcon = false,
    customIcon = null,
    title,
    titleClassName = "",
    descriptionClassName = "",
    children,
    className = "",
    closable = false,
    onClose,
    alignItems = "start",
    ...props
}) {
    const baseClasses = twMerge(
        "flex justify-between my-2 rounded-lg overflow-hidden",
        className,
    );

    const variantClass =
        variantStyles[variant]?.[type] || variantStyles.subtle.info;
    const sizeClass = sizeStyles[size] || sizeStyles.md;

    const resolvedTypeIconSize = typeIconSize || iconSizes[size];
    const resolvedCloseIconSize = closeIconSize || iconSizes[size];

    const icon = customIcon
        ? customIcon
        : (typeIcons[type]?.(resolvedTypeIconSize) ??
          typeIcons.info(iconSizes.md));

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={twMerge(" ", baseClasses, variantClass, sizeClass)}
            {...props}
        >
            {showIcon && <div className="mt-0.5 shrink-0">{icon}</div>}

            <div className="flex flex-col flex-1 leading-relaxed">
                {title && (
                    <div
                        className={twMerge(
                            "font-bold uppercase tracking-wide",
                            titleClassName,
                        )}
                    >
                        {title}
                    </div>
                )}
                <div className={twMerge(descriptionClassName)}>{children}</div>
            </div>

            {closable && (
                <button
                    onClick={onClose}
                    className="ml-2 shrink-0 self-start mt-0.5 hover:opacity-60 transition-opacity"
                >
                    <X className={resolvedCloseIconSize} />
                </button>
            )}
        </motion.div>
    );
}
