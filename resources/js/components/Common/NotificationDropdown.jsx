// resources/js/components/Common/NotificationDropdown.jsx
import { Bell } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import NotificationCard from "@/components/Common/NotificationCard";
import NotificationDropdownMobile from "@/components/Common/NotificationDropdownMobile";
import { Link } from "@inertiajs/react";

export default function NotificationDropdown({
    notifications = [],
    onMarkAllRead,
}) {
    const [open, setOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const dropdownRef = useRef(null);

    const unreadCount = notifications.filter((n) => !n.isRead).length;
    const scrollItems = notifications.slice(0, 10);

    // Auto close desktop dropdown
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

    // Handle click berdasarkan mode device
    const handleToggle = () => {
        if (window.innerWidth < 768) {
            // mode mobile
            setMobileOpen(true);
        } else {
            // mode desktop
            setOpen(!open);
        }
    };

    return (
        <>
            {/* BUTTON */}
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={handleToggle}
                    className="relative p-2 rounded-full hover:bg-secondary-100 dark:hover:bg-secondary-700 transition"
                >
                    <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />

                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-0 inline-flex items-center justify-center px-1.5 py-1 text-[10px] font-bold leading-none text-white bg-red-500 rounded-full">
                            {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                    )}
                </button>

                {/* DESKTOP DROPDOWN */}
                <div
                    className={`
                        absolute right-0 mt-2 w-80 bg-white dark:bg-secondary-800 border
                        dark:border-secondary-700 rounded-lg shadow-lg z-50 text-xs 
                        transition-all duration-200 origin-top-right
                        ${
                            open
                                ? "opacity-100 scale-100"
                                : "opacity-0 scale-95 pointer-events-none"
                        }
                    `}
                >
                    {/* HEADER */}
                    <div className="flex justify-between items-center px-4 py-2 bg-secondary-50 dark:bg-secondary-900 border-b dark:border-secondary-600 rounded-t-lg">
                        <span className="font-semibold">Pemberitahuan</span>
                        {notifications.length > 0 && (
                            <button
                                onClick={onMarkAllRead}
                                className="text-primary-600 dark:text-primary-400 text-[11px] hover:underline"
                            >
                                Tandai dibaca
                            </button>
                        )}
                    </div>

                    {/* BODY */}
                    <div
                        className={`${
                            scrollItems.length > 5
                                ? "max-h-80 overflow-y-auto custom-scrollbar"
                                : ""
                        }`}
                    >
                        {notifications.length === 0 ? (
                            <div className="p-3 text-center text-gray-500">
                                Tidak ada Notifikasi.
                            </div>
                        ) : (
                            scrollItems.map((n, i) => (
                                <div
                                    key={i}
                                    className="hover:bg-secondary-100 dark:hover:bg-secondary-700 transition"
                                >
                                    <NotificationCard
                                        title={n.title}
                                        message={n.message}
                                        time={n.time}
                                        isRead={n.isRead}
                                        variant="dropdown"
                                    />
                                </div>
                            ))
                        )}
                    </div>

                    {/* FOOTER */}
                    {notifications.length > 0 && (
                        <Link
                            href="/notifications"
                            className="block text-center py-2 text-primary-600 dark:text-primary-400 hover:underline border-t dark:border-secondary-700"
                        >
                            Lihat Semua
                        </Link>
                    )}
                </div>
            </div>

            {/* MOBILE VERSION */}
            <NotificationDropdownMobile
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
                notifications={notifications}
                onMarkAllRead={onMarkAllRead}
            />
        </>
    );
}
