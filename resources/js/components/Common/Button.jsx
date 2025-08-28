import { React, forwardRef } from "react";
import { tv } from "tailwind-variants";

const button = tv({
    base: "inline-flex items-center justify-center rounded-lg px-4 py-2 font-semibold transition-all focus:outline-none focus:ring-4",
    variants: {
        variant: {
            primary:
                "bg-primary-500 hover:bg-primary-600 dark:bg-primary-800 dark:hover:bg-primary-900 focus:ring-primary-200 dark:focus:ring-primary-900 text-white",
            secondary:
                "bg-secondary-500 hover:bg-secondary-600 dark:bg-secondary-700 dark:hover:bg-secondary-800 focus:ring-secondary-200 dark:focus:ring-secondary-800 text-white",
            outline:
                "border bg-transparent border-primary-300 dark:border-primary-600 dark:hover:border-primary-800 hover:bg-primary-100 dark:hover:bg-primary-800 focus:ring-primary-200 dark:focus:ring-primary-900 text-primary-700 dark:text-white",
            tertiary:
                "bg-tertiary-600 hover:bg-tertiary-700 dark:bg-tertiary-800 dark:hover:bg-tertiary-900 focus:ring-tertiary-200 dark:focus:ring-tertiary-900 text-white",
            danger: "bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 focus:ring-red-300 dark:focus:ring-red-900 text-white",
            warning:
                "bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-700 dark:hover:bg-yellow-800 focus:ring-yellow-300 dark:focus:ring-yellow-800 text-white",
            success:
                "bg-green-600 hover:bg-green-700 dark:bg-green-800 dark:hover:bg-green-900 focus:ring-green-200 dark:focus:ring-green-900 text-white",
            info: "bg-sky-600 hover:bg-sky-700 dark:bg-sky-800 dark:hover:bg-sky-900 focus:ring-sky-300 dark:focus:ring-sky-900 text-white",
            light: "border border-secondary-300 dark:border-secondary-600 bg-white hover:bg-secondary-50 dark:bg-secondary-800 dark:hover:bg-secondary-900 focus:ring-secondary-300 dark:focus:ring-secondary-900 text-secondary-600 dark:text-secondary-100",
        },
        size: {
            xs: "text-xs",
            sm: "text-sm",
            md: "text-base",
            lg: "text-lg",
        },
        disabled: {
            true: "opacity-50 cursor-not-allowed pointer-events-none",
        },
    },
    defaultVariants: {
        variant: "primary",
        size: "sm",
    },
});

const Button = forwardRef(
    (
        {
            type = "button",
            variant,
            size,
            disabled = false,
            className = "",
            children,
            ...props
        },
        ref
    ) => {
        return (
            <button
                type={type}
                disabled={disabled}
                ref={ref}
                className={button({ variant, size, disabled, className })}
                {...props}
            >
                {children}
            </button>
        );
    }
);

Button.displayName = "Button";

export default Button;
