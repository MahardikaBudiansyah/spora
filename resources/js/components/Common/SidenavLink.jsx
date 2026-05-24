import { Link } from "@inertiajs/react";
import { twMerge } from "tailwind-merge";

export default function SidenavLink({
    href,
    label,
    icon: Icon,
    routeName,
    params = {},
    children,
    className = "",
    ...props
}) {
    const isActive = routeName
        ? route().current(routeName, params)
        : route().current(href);

    return (
        <div>
            <Link
                href={href}
                {...props}
                className={twMerge(
                    "flex items-center px-4 py-2 font-normal text-sm rounded-lg",
                    isActive
                        ? "bg-primary-400 text-dark "
                        : "text-dark hover:bg-primary-400 dark:text-light dark:hover:text-dark",
                    className,
                )}
            >
                {Icon && <Icon className="mr-2 w-5" />}
                {label}
            </Link>

            {children && <div className="ml-6 mt-1 space-y-1">{children}</div>}
        </div>
    );
}
