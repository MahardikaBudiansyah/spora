import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import Tippy from "@tippyjs/react";

const IconButton = forwardRef(
    (
        {
            className = "",
            children,
            tooltip,
            tooltipPlacement = "top",
            ...props
        },
        ref
    ) => {
        const buttonEl = (
            <button
                ref={ref}
                type="button"
                className={twMerge(
                    "inline-flex items-center justify-center focus:outline-none",
                    className
                )}
                {...props}
            >
                {children}
            </button>
        );

        if (tooltip) {
            return (
                <Tippy
                    content={tooltip}
                    placement={tooltipPlacement}
                    trigger="mouseenter focus"
                >
                    {buttonEl}
                </Tippy>
            );
        }

        return buttonEl;
    }
);

IconButton.displayName = "IconButton";

export default IconButton;
