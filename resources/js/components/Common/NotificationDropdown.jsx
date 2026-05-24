import { useState, useRef, useEffect } from "react";
import { Link } from "@inertiajs/react";
import { Bell } from "lucide-react";
import NotificationCard from "@/components/Common/NotificationCard";
import NotificationDropdownMobile from "@/components/Common/NotificationDropdownMobile";
import IconButton from "@/components/Common/IconButton";
import Button from "./Button";

export default function NotificationDropdown({
    notifications = [],
    unreadCount = 0,
    onMarkAllRead,
    onNotificationClick,
    viewAllNotification = "/notifications",
}) {
    const [open, setOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const dropdownRef = useRef(null);

    const unreadItems = notifications.filter((n) => !n.is_read);
    const readItems = notifications.filter((n) => n.is_read).slice(0, 3);

    useEffect(() => {
        function handleClickOutside(e) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target)
            ) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleToggle = () => {
        if (window.innerWidth < 768) {
            setMobileOpen(true);
        } else {
            setOpen(!open);
        }
    };

    return (
        <>
            <div className="relative" ref={dropdownRef}>
                <IconButton
                    variant="light"
                    onClick={handleToggle}
                    className="relative rounded-full border-none bg-transparent hover:bg-secondary-100 dark:hover:bg-secondary-700 outline-none hover:ring-2"
                >
                    <Bell className="w-4 h-4 text-secondary-600 dark:text-secondary-300 outline-none" />

                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-0 min-w-[18px] h-[18px] inline-flex items-center justify-center px-1 py-1 text-[10px] font-bold leading-none text-white bg-red-500 rounded-full">
                            {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                    )}
                </IconButton>

                <div
                    className={`
                        absolute right-0 mt-2 w-[400px] bg-white dark:bg-secondary-800 border
                        dark:border-secondary-700 rounded-lg shadow-lg z-dropdown text-xs 
                        transition-all duration-200 origin-top-right
                        ${
                            open
                                ? "opacity-100 scale-100"
                                : "opacity-0 scale-95 pointer-events-none"
                        }
                    `}
                >
                    <div className="flex justify-between items-center px-4 py-2 bg-secondary-50 dark:bg-secondary-900 border-b dark:border-secondary-600 rounded-t-lg">
                        <span className="font-semibold uppercase tracking-wider">
                            Notifikasi
                        </span>
                        {notifications.length > 0 && (
                            <Button
                                variant="ghost"
                                onClick={onMarkAllRead}
                                className="py-1 px-2 text-primary-600 dark:text-primary-400 text-[11px] hover:underline rounded-md"
                            >
                                Semua dibaca
                            </Button>
                        )}
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                        <div className="py-0">
                            {unreadItems.length > 0 ? (
                                unreadItems.map((n) => (
                                    <div
                                        key={n.id || i}
                                        onClick={() => {
                                            onNotificationClick(n.id);
                                            setOpen(false);
                                        }}
                                        className="cursor-pointer hover:bg-primary-200 dark:hover:bg-secondary-700 transition"
                                    >
                                        <NotificationCard
                                            title={n.data.title}
                                            type={n.data.type}
                                            message={n.data.message}
                                            time={n.created_at_human}
                                            isRead={n.is_read}
                                            variant="dropdown"
                                        />
                                    </div>
                                ))
                            ) : (
                                <div className="p-4 text-center text-secondary-400 text-[11px]">
                                    Tidak ada notifikasi terbaru.
                                </div>
                            )}
                        </div>

                        {readItems.length > 0 && (
                            <div className="border-t dark:border-secondary-700">
                                <div className="px-4 py-2 text-[10px] font-bold text-secondary-400 uppercase tracking-wider bg-secondary-50/50 dark:bg-secondary-900/50">
                                    Notifikasi Terakhir
                                </div>
                                {readItems.map((n) => (
                                    <div
                                        key={n.id}
                                        onClick={() =>
                                            onNotificationClick(n.id)
                                        }
                                        className="opacity-70 hover:opacity-100 cursor-pointer"
                                    >
                                        <NotificationCard
                                            title={n.data.title}
                                            type={n.data.type}
                                            message={n.data.message}
                                            time={n.created_at_human}
                                            isRead={n.is_read}
                                            variant="dropdown"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {notifications.length > 0 && (
                        <Link
                            href={viewAllNotification}
                            onClick={() => setOpen(false)}
                            className="block text-center py-2 text-primary-600 dark:text-primary-400 hover:underline border-t dark:border-secondary-700"
                        >
                            Lihat Semua
                        </Link>
                    )}
                </div>
            </div>

            <NotificationDropdownMobile
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
                notifications={notifications}
                onMarkAllRead={onMarkAllRead}
                onNotificationClick={onNotificationClick}
                viewAllNotification={viewAllNotification}
            />
        </>
    );
}
