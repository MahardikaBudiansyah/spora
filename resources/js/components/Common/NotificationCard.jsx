import React from "react";
import {
    Building2,
    UserPlus,
    Sparkles,
    Bell,
    ShieldCheck,
    XCircle,
    Store,
    Archive,
    Pin,
    Trash,
    Trash2,
    PinOff,
} from "lucide-react";
import Checkbox from "@/components/Common/Checkbox";
import IconButton from "@/components/Common/IconButton";

export default function NotificationCard({
    title,
    type,
    message,
    time,
    isRead = false,
    isPinned = false,
    variant = "page",
    className = "",
    checked = false,
    isProcessing = false,
    onChange,
    onArchive,
    onPin,
    onDelete,
}) {
    const renderIcon = () => {
        const config = {
            registration: {
                icon: Building2,
                bg: "bg-blue-100 dark:bg-blue-900/30",
                color: "text-blue-600 dark:text-blue-400",
            },
            user_registration: {
                icon: UserPlus,
                bg: "bg-green-100 dark:bg-green-900/30",
                color: "text-green-600 dark:text-green-400",
            },
            welcome: {
                icon: Sparkles,
                bg: "bg-yellow-100 dark:bg-yellow-900/30",
                color: "text-yellow-600 dark:text-yellow-400",
            },
            verification_approved: {
                icon: ShieldCheck,
                bg: "bg-emerald-100 dark:bg-emerald-900/30",
                color: "text-emerald-600 dark:text-emerald-400",
            },
            verification_rejected: {
                icon: XCircle,
                bg: "bg-red-100 dark:bg-red-900/30",
                color: "text-red-600 dark:text-red-400",
            },
            venue_registration: {
                icon: Store,
                bg: "bg-purple-100 dark:bg-purple-900/30",
                color: "text-purple-600 dark:text-purple-400",
            },
            venue_status: {
                icon: Store,
                bg: "bg-emerald-100 dark:bg-emerald-900/30",
                color: "text-emerald-600 dark:text-emerald-400",
            },
        };

        const selected = config[type] || {
            icon: Bell,
            bg: "bg-secondary-100 dark:bg-secondary-800",
            color: "text-secondary-600 dark:text-secondary-400",
        };

        const IconComponent = selected.icon;

        return (
            <div
                className={`flex flex-shrink-0 items-center justify-center rounded-xl ${selected} 
            ${variant === "dropdown" ? "w-3 h-3" : "hidden md:flex w-3 h-3"}`}
            >
                <IconComponent
                    size={variant === "dropdown" ? 16 : 22}
                    className={selected.color}
                />
            </div>
        );
    };

    const handleAction = (e, callback) => {
        e.stopPropagation();
        if (isProcessing) return;
        callback();
    };

    return (
        <div
            className={`relative flex flex-row items-center gap-2 md:gap-4 text-xs
                ${
                    !isRead
                        ? "bg-primary-50/50 dark:bg-secondary-900/80 hover:bg-primary-100 dark:hover:bg-secondary-700"
                        : "bg-white dark:bg-secondary-900 opacity-80 hover:opacity-100"
                }
                ${checked ? "bg-primary-200/50 dark:bg-secondary-800" : ""}
                ${variant === "dropdown" ? "py-3 px-4" : "p-4 border-y dark:border-secondary-800"}
                ${className}`}
        >
            {variant !== "dropdown" && (
                <div
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    className="relative z-10"
                >
                    <Checkbox
                        tooltip="Pilih Notifikasi"
                        checked={checked}
                        onChange={() => onChange()}
                    />
                </div>
            )}

            <div className="flex-1 min-w-0 space-y-1">
                <div className="flex flex-row gap-2 items-center">
                    <div className="flex flex-row gap-1 items-center">
                        {renderIcon()}
                        <h3
                            className={`${!isRead ? "font-bold text-secondary-900 dark:text-white" : "font-medium text-secondary-600 dark:text-secondary-400"}`}
                        >
                            {title}
                        </h3>
                        {variant !== "dropdown" && isPinned && (
                            <Pin
                                size={12}
                                className="text-yellow-500 fill-current rotate-45"
                            />
                        )}
                    </div>
                    {!isRead && (
                        <div
                            className={`${variant === "dropdown" ? "top-3 right-3" : "top-3 right-3"} absolute flex h-2 w-2`}
                        >
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-600"></span>
                        </div>
                    )}
                </div>
                <p
                    className={` 
                        ${variant === "dropdown" ? "line-clamp-2" : "line-clamp-1"} 
                        ${checked ? "text-secondary-600 dark:text-secondary-400" : "text-secondary-500 dark:text-secondary-400"}
                        break-words`}
                >
                    {message}
                </p>
                <span
                    className={`text-[10px]  font-medium block uppercase tracking-wider ${checked ? "text-secondary-500 " : "text-secondary-400"}`}
                >
                    {time}
                </span>
            </div>
            {variant !== "dropdown" && !checked && (
                <div className="flex gap-2">
                    <IconButton
                        variant="info"
                        size="xs"
                        tooltip="Arsip"
                        onClick={(e) => handleAction(e, onArchive)}
                        disabled={isProcessing}
                        className="p-1 rounded-md"
                    >
                        <Archive size={14} />
                    </IconButton>
                    <IconButton
                        variant="warning"
                        size="xs"
                        tooltip={isPinned ? "Lepas Pin" : "Pin Notifikasi"}
                        onClick={(e) => handleAction(e, onPin)}
                        disabled={isProcessing}
                        className="p-1 rounded-md"
                    >
                        {isPinned ? (
                            <PinOff size={14} />
                        ) : (
                            <Pin size={14} className="rotate-45" />
                        )}
                    </IconButton>
                    <IconButton
                        variant="danger"
                        size="xs"
                        tooltip="Hapus"
                        onClick={(e) => handleAction(e, onDelete)}
                        disabled={isProcessing}
                        className="p-1 rounded-md"
                    >
                        <Trash2 size={14} />
                    </IconButton>
                </div>
            )}
        </div>
    );
}
