import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import Button from "@/components/Common/Button";

const IconButton = forwardRef(
    (
        {
            className = "",
            children,
            tooltip,
            tooltipPlacement = "top",
            variant = "primary",
            size = "sm",
            ...props
        },
        ref,
    ) => {
        return (
            <Button
                ref={ref}
                variant={variant}
                size={size}
                tooltip={tooltip}
                className={twMerge(
                    "p-2 aspect-square hover:ring-2 focus:ring-2",
                    className,
                )}
                {...props}
            >
                {children}
            </Button>
        );
    },
);

IconButton.displayName = "IconButton";

export default IconButton;
