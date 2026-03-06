import React from "react";
import { Trash2 } from "lucide-react";
import Button from "@/components/Common/Button";
import Checkbox from "@/components/Common/Checkbox";

export default function NotificationCardBackup({
    title,
    message,
    time,
    isRead = false,
    onDelete,
    variant = "page",
    className = "",
    checked = false,
    onChange,
}) {
    return (
        <div
            className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4
                ${
                    checked || !isRead
                        ? "bg-gray-50 dark:bg-secondary-800"
                        : "bg-white dark:bg-secondary-900 shadow-none"
                }
                ${variant === "dropdown" ? "text-sm py-3 px-4" : "p-4"}
                ${className}`}
        >
            {variant !== "dropdown" && (
                <Checkbox checked={checked} onChange={onChange} />
            )}

            <div className="flex-1 space-y-1">
                <h3 className={`${isRead ? "font-semibold" : "font-bold"}`}>
                    {title}
                </h3>
                <p
                    className={`${
                        variant === "dropdown" ? "text-sm" : "text-sm"
                    } truncate`}
                >
                    {message}
                </p>
                <small className="text-gray-400 block">{time}</small>
            </div>

            {variant !== "dropdown" && onDelete && (
                <Button variant="danger" className="p-2" onClick={onDelete}>
                    <Trash2 className="w-4 h-4" />
                </Button>
            )}
        </div>
    );
}
