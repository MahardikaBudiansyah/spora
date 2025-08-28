import { forwardRef, useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";
import { Clock } from "lucide-react";

const TimeInput = forwardRef(function TimeInput(
    { className = "", isFocused = false, ...props },
    ref
) {
    const inputRef = ref ? ref : useRef();

    useEffect(() => {
        if (isFocused) {
            inputRef.current.focus();
        }
    }, [isFocused]);

    const baseClass =
        "block w-full rounded-md shadow-sm border border-secondary-300 " +
        "focus:border-primary-500 focus:ring-2 focus:ring-primary-500 hover:border-primary-500 " +
        "dark:border-secondary-600 dark:bg-secondary-800 dark:text-white " +
        "placeholder:text-xs placeholder:italic placeholder-secondary-400 dark:placeholder-secondary-500";

    // fungsi khusus untuk buka overlay
    const openPicker = () => {
        if (inputRef.current && inputRef.current.showPicker) {
            inputRef.current.showPicker(); // hanya aman dipanggil dari user gesture
        } else {
            inputRef.current.focus(); // fallback
        }
    };

    return (
        <div
            className="relative w-full overflow-visible"
            onClick={openPicker} // klik div wrapper = buka overlay
        >
            <input
                {...props}
                type="time"
                ref={inputRef}
                className={twMerge(
                    baseClass,
                    "pr-10 cursor-pointer",
                    className
                )}
            />
            <Clock
                className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 
                   text-secondary-700 dark:text-white pointer-events-none"
            />
        </div>
    );
});

export default TimeInput;
