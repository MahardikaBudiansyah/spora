// resources/js/components/Navigation/NavbarLink.jsx
import { NavLink } from "@inertiajs/react";
import { twMerge } from "tailwind-merge";

export default function NavbarLink({ href, label, icon: Icon, active }) {
    return (
        <NavLink
            href={href}
            className={twMerge(
                "inline-flex items-center px-3 py-2 text-sm font-medium transition-colors",
                active
                    ? "text-primary-600 dark:text-primary-400 border-b-2 border-primary-600"
                    : "text-secondary-600 hover:text-primary-600 dark:text-secondary-300 dark:hover:text-primary-400"
            )}
        >
            {Icon && <Icon className="mr-2 h-4 w-4" />}
            {label}
        </NavLink>
    );
}
