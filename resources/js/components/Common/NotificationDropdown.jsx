import { Bell } from "lucide-react";
import { useState } from "react";

export default function NotificationDropdown() {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="relative p-2 rounded-full hover:bg-secondary-100 dark:hover:bg-secondary-700"
            >
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-secondary-800" />
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-secondary-800 border rounded-md shadow-lg z-50 text-sm">
                    <div className="p-4">Belum ada notifikasi</div>
                </div>
            )}
        </div>
    );
}
