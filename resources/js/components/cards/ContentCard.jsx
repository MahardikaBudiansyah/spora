import {
    Card,
    CardBody,
    CardHeader,
    CardFooter,
} from "@/components/common/Card";
import { twMerge } from "tailwind-merge";

export default function ContentCard({
    title,
    icon: Icon,
    action,
    children,
    footer,
    variant = "plain",
    className = "",
    headerClassName = "",
    titleClassName = "",
    bodyClassName = "",
}) {
    const variantStyles = {
        plain: {
            header: "bg-secondary-50/30 dark:bg-secondary-800/50 border-b border-secondary-100 dark:border-secondary-800",
            body: "bg-white dark:bg-secondary-800",
            footer: "bg-white dark:bg-secondary-800",
        },

        soft: {
            header: "bg-white dark:bg-secondary-900 border-b border-secondary-100 dark:border-secondary-700",
            body: "bg-secondary-50/60 dark:bg-secondary-800/60",
            footer: "bg-secondary-50/60 dark:bg-secondary-800/60",
        },

        elevated: {
            header: "bg-gradient-to-r from-secondary-100 to-white dark:from-secondary-800 dark:to-secondary-900 border-b border-secondary-200 dark:border-secondary-700",
            body: "bg-secondary-50/30 dark:bg-secondary-900/30 backdrop-blur-sm",
            footer: "bg-secondary-50/30 dark:bg-secondary-900/30",
        },

        accent: {
            header: "bg-cyan-50/50 dark:bg-cyan-900/20 border-b border-cyan-100 dark:border-cyan-800",
            body: "bg-white dark:bg-secondary-950",
            footer: "bg-white dark:bg-secondary-950",
        },
    };

    const currentVariant = variantStyles[variant] || variantStyles.white;

    return (
        <Card
            className={twMerge(
                "flex flex-col shadow-sm overflow-hidden",
                className,
            )}
        >
            <CardHeader
                className={twMerge(
                    "flex items-center justify-between",
                    currentVariant.header,
                    headerClassName,
                )}
            >
                <div className="font-bold flex items-center gap-3">
                    {Icon && <Icon size={18} className="text-primary-500" />}
                    <h3
                        className={twMerge(
                            "text-sm font-bold uppercase tracking-widest text-secondary-600 dark:text-secondary-300",
                            titleClassName,
                        )}
                    >
                        {title}
                    </h3>
                </div>
                {action && (
                    <div className="flex items-center gap-1">{action}</div>
                )}
            </CardHeader>

            <CardBody
                className={twMerge(
                    "p-6",
                    currentVariant.body,
                    !footer && "rounded-b-xl",
                    bodyClassName,
                )}
            >
                {children}
            </CardBody>

            {footer && (
                <CardFooter
                    className={twMerge(
                        "border-none p-5 pt-0 rounded-b-xl",
                        currentVariant.footer,
                    )}
                >
                    {footer}
                </CardFooter>
            )}
        </Card>
    );
}
