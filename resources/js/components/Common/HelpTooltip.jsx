import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { HelpCircle } from "lucide-react";
import { twMerge } from "tailwind-merge";

export default function HelpTooltip({
    text,
    trigger = "hover",
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
                <HelpCircle
                    className={twMerge("w-5 h-5 text-gray-500", iconClassName)}
                />
            </span>
        </Tippy>
    );
}
