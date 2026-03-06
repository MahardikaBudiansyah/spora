import { React, forwardRef } from "react";
import { Link } from "@inertiajs/react";
import { tv } from "tailwind-variants";
import Tippy from "@tippyjs/react";

const buttonStyles = tv({
    base: "inline-flex items-center justify-center rounded-lg px-4 py-2 font-semibold focus:outline-none focus:ring-4",
    variants: {
        variant: {
            primary:
                "border-primary-300 dark:border-primary-600 bg-primary-500 hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700 focus:ring-primary-400 dark:focus:ring-primary-500 hover:ring-primary-200 dark:hover:ring-primary-600 text-white",
            secondary:
                "border-secondary-300 dark:border-secondary-600 bg-secondary-500 hover:bg-secondary-600 dark:bg-secondary-700 dark:hover:bg-secondary-800 focus:ring-secondary-200 dark:focus:ring-secondary-500 hover:ring-secondary-200 dark:hover:ring-secondary-600 text-white",
            outline:
                "border bg-transparent border-primary-300 dark:border-primary-600 dark:hover:border-primary-800 hover:bg-primary-100 dark:hover:bg-primary-600 focus:ring-primary-200 dark:focus:ring-primary-700 text-primary-700 dark:text-white",
            tertiary:
                "border-tertiary-300 dark:border-tertiary-600 bg-tertiary-600 hover:bg-tertiary-700 dark:bg-tertiary-800 dark:hover:bg-tertiary-900 focus:ring-tertiary-200 dark:focus:ring-tertiary-900 text-white",
            light: "border border-secondary-300 dark:border-secondary-600 bg-white hover:bg-secondary-50 dark:bg-secondary-800 dark:hover:bg-secondary-900 focus:ring-secondary-200 dark:focus:ring-secondary-600 hover:ring-secondary-200 dark:hover:ring-secondary-600 text-secondary-600 dark:text-secondary-100",
            ghost: "bg-transparent hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 focus:ring-2 focus:ring-stone-200 dark:focus:ring-stone-800",
            success:
                "border-green-300 dark:border-green-600 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 focus:ring-green-200 dark:focus:ring-green-600 hover:ring-green-200 dark:hover:ring-green-600 text-white",
            warning:
                "border-yellow-300 dark:border-yellow-600 bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 focus:ring-yellow-200 dark:focus:ring-yellow-500 hover:ring-yellow-200 dark:hover:ring-yellow-600 text-white",
            info: "border-blue-300 dark:border-blue-600 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 focus:ring-blue-200 dark:focus:ring-blue-600 text-white",
            danger: "border-red-300 dark:border-red-600 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 focus:ring-red-200 dark:focus:ring-red-500 hover:ring-red-200 dark:hover:ring-red-600 text-white",
            violet: "bg-violet-600 hover:bg-violet-700 dark:bg-violet-800 dark:hover:bg-violet-900 focus:ring-violet-200 dark:focus:ring-violet-900  text-white",
            purple: "bg-purple-600 hover:bg-purple-700 dark:bg-purple-800 dark:hover:bg-purple-900 focus:ring-purple-200 dark:focus:ring-purple-900 text-white",
            pink: "bg-pink-600 hover:bg-pink-700 dark:bg-pink-800 dark:hover:bg-pink-900 focus:ring-pink-200 dark:focus:ring-pink-900 text-white",
            sky: "bg-sky-600 hover:bg-sky-700 dark:bg-sky-700 dark:hover:bg-sky-800 focus:ring-sky-200 dark:focus:ring-sky-900 text-white",
            indigo: "bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 focus:ring-indigo-200 dark:focus:ring-indigo-900 text-white",
            cyan: "bg-cyan-500 hover:bg-cyan-600 dark:bg-cyan-700 dark:hover:bg-cyan-800 focus:ring-cyan-200 dark:focus:ring-cyan-900 text-white",
            teal: "bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-800 focus:ring-teal-200 dark:focus:ring-teal-900 text-white",
            emerald:
                "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800 focus:ring-emerald-200 dark:focus:ring-emerald-900 text-white",
            lime: "bg-lime-500 hover:bg-lime-600 dark:bg-lime-700 dark:hover:bg-lime-800 focus:ring-lime-200 dark:focus:ring-lime-900 text-black dark:text-white",
            orange: "bg-orange-500 hover:bg-orange-600 dark:bg-orange-700 dark:hover:bg-orange-800 focus:ring-orange-200 dark:focus:ring-orange-900 text-white",
            amber: "bg-amber-500 hover:bg-amber-600 dark:bg-amber-700 dark:hover:bg-amber-800 focus:ring-amber-200 dark:focus:ring-amber-900 text-black dark:text-white",
            fuchsia:
                "bg-fuchsia-600 hover:bg-fuchsia-700 dark:bg-fuchsia-700 dark:hover:bg-fuchsia-800 focus:ring-fuchsia-200 dark:focus:ring-fuchsia-900 text-white",
            rose: "bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-800 focus:ring-rose-200 dark:focus:ring-rose-900 text-white",
            slate: "bg-slate-600 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-800 focus:ring-slate-300 dark:focus:ring-slate-900 text-white",
            gray: "bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-800 focus:ring-gray-300 dark:focus:ring-gray-900 text-white",
            zinc: "bg-zinc-700 hover:bg-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-900 focus:ring-zinc-300 dark:focus:ring-zinc-900 text-white",
            neutral:
                "bg-neutral-600 hover:bg-neutral-700 dark:bg-neutral-700 dark:hover:bg-neutral-800 focus:ring-neutral-300 dark:focus:ring-neutral-900 text-white",
            stone: "bg-stone-600 hover:bg-stone-700 dark:bg-stone-700 dark:hover:bg-stone-800 focus:ring-stone-300 dark:focus:ring-stone-900 text-white",
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
        size: "xs",
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
            tooltip,
            href,
            preserveScroll,
            preserveState,
            only,
            onClick,
            loading,
            isLoading = false,
            ...props
        },
        ref,
    ) => {
        const isActuallyLoading = isLoading || loading;
        const isButtonDisabled = disabled || isActuallyLoading;

        const classes = buttonStyles({
            variant,
            size,
            disabled: isButtonDisabled,
            className,
        });

        if (href && !isButtonDisabled) {
            const linkContent = (
                <Link
                    href={href}
                    ref={ref}
                    className={classes}
                    preserveScroll={preserveScroll}
                    preserveState={preserveState}
                    only={only}
                    onClick={onClick}
                    {...props}
                >
                    {children}
                </Link>
            );
            return tooltip ? (
                <Tippy content={tooltip}>{linkContent}</Tippy>
            ) : (
                linkContent
            );
        }

        const buttonContent = (
            <button
                type={type}
                disabled={isButtonDisabled}
                ref={ref}
                className={classes}
                onClick={onClick}
                {...props}
            >
                {children}
            </button>
        );

        return tooltip ? (
            <Tippy content={tooltip}>{buttonContent}</Tippy>
        ) : (
            buttonContent
        );
    },
);

Button.displayName = "Button";

export default Button;
