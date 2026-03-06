import { twMerge } from "tailwind-merge";
import { useRef, useEffect } from "react";
import Tippy from "@tippyjs/react";

export default function Checkbox({
    id,
    name,
    indeterminate = false,
    className = "",
    tooltip,
    ...props
}) {
    const ref = useRef(null);

    useEffect(() => {
        if (ref.current) {
            ref.current.indeterminate = !!indeterminate;
        }
    }, [indeterminate]);

    const checkboxInput = (
        <input
            {...props}
            id={id}
            name={name}
            ref={ref}
            type="checkbox"
            className={twMerge(
                "rounded bg-white dark:bg-secondary-800 border-secondary-300 dark:border-secondary-500 text-primary-500 dark:text-primary-400 shadow-sm focus:ring-primary-400 dark:focus:ring-primary-400 focus:border-primary-400 dark:focus:border-primary-400 cursor-pointer hover:border-primary-500 dark:hover:border-primary-500",
                className,
            )}
        />
    );

    return tooltip ? (
        <Tippy content={tooltip}>
            <div className="inline-flex">{checkboxInput}</div>
        </Tippy>
    ) : (
        checkboxInput
    );
}
