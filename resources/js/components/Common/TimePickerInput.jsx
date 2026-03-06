import { forwardRef, useEffect, useRef, useImperativeHandle } from "react";
import { twMerge } from "tailwind-merge";
import { Clock } from "lucide-react";

const TimePickerInput = forwardRef(function TimePickerInput(
    { className = "", isFocused = false, isError = false, ...props },
    ref
) {
    const internalRef = useRef(null);

    useImperativeHandle(ref, () => internalRef.current);

    useEffect(() => {
        if (isFocused && internalRef.current) {
            internalRef.current.focus();
        }
    }, [isFocused]);

    const baseWrapperClasses = twMerge(
        "block w-full rounded-md shadow-sm border border-secondary-300 " +
            "focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500 hover:border-primary-500 " +
            "dark:border-secondary-600 dark:bg-secondary-800 dark:text-white " +
            "placeholder:text-xs placeholder:italic placeholder-secondary-400 dark:placeholder:text-secondary-500",
        isError &&
            "border-red-500 dark:border-red-500 focus-within:border-red-500 focus-within:ring-red-500 hover:border-red-500"
    );

    const openPicker = () => {
        if (internalRef.current) {
            if (typeof internalRef.current.showPicker === "function") {
                internalRef.current.showPicker();
            } else {
                internalRef.current.focus();
            }
        }
    };

    return (
        <div
            className={twMerge(
                baseWrapperClasses,
                "cursor-pointer group flex items-center justify-between ",
                className
            )}
            onClick={openPicker}
        >
            <input
                {...props}
                type="time"
                title=""
                ref={internalRef}
                className="w-full border-none outline-none focus:ring-0 bg-transparent text-sm cursor-pointer appearance-none"
            />
            <Clock className="w-4 h-4 mx-4 text-secondary-500 dark:text-secondary-400 shrink-0" />
        </div>
    );
});

export default TimePickerInput;
