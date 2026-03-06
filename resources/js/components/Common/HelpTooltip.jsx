import Tippy from "@tippyjs/react";
import { HelpCircle, Info } from "lucide-react";
import { twMerge } from "tailwind-merge";

export default function HelpTooltip({
    text,
    trigger = "mouseenter focus",
    placement = "top",
    className = "",
    tooltipClassName = "",
    iconClassName = "",
    onClose,
}) {
    return (
        <Tippy
            content={text}
            trigger={trigger} // hover, click, focus, dll
            interactive={true} // bisa klik di dalam tooltip
            placement={placement} // top, right, bottom, left
            onClickOutside={onClose}
            animation="shift-away"
        >
            <span // pakai span agar tidak ada style button default
                className={twMerge(
                    "inline-flex items-center justify-center cursor-pointer",
                    className
                )}
            >
                <Info
                    strokeWidth={2}
                    size={16}
                    className={twMerge(
                        "text-secondary-500 dark:text-secondary-200",
                        iconClassName
                    )}
                />
            </span>
        </Tippy>
    );
}
