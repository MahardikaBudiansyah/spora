// resources/js/components/Common/NotificationDropdownMobile.jsx
import { X } from "lucide-react";
import NotificationCard from "@/components/Common/NotificationCard";
import { Link } from "@inertiajs/react";

export default function NotificationDropdownMobile({
    open,
    onClose,
    notifications = [],
    onMarkAllRead,
}) {
    return (
        <>
            {/* BACKDROP */}
            <div
                className={`
                    fixed inset-0 bg-black/40 z-[90] 
                    transition-opacity duration-200
                    ${open ? "opacity-100" : "opacity-0 pointer-events-none"}
                `}
                onClick={onClose}
            />

            {/* MOBILE SHEET */}
            <div
                className={`
        fixed top-0 inset-x-0 z-[100] bg-white dark:bg-secondary-800 
        rounded-b-md shadow-xl 
        transition-transform duration-300 
        ${open ? "translate-y-0" : "-translate-y-full"}
        min-h-[20vh] max-h-[75vh] flex flex-col
    `}
            >
                {/* HEADER */}
                <div className="flex justify-between items-center px-4 py-3 border-b dark:border-secondary-700">
                    <h2 className="font-semibold text-sm">Pemberitahuan</h2>

                    <div className="flex items-center gap-3">
                        {notifications.length > 0 && (
                            <button
                                onClick={onMarkAllRead}
                                className="text-primary-600 dark:text-primary-400 text-xs hover:underline"
                            >
                                Tandai dibaca
                            </button>
                        )}

                        <button onClick={onClose}>
                            <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        </button>
                    </div>
                </div>

                {/* CONTENT */}
                <div className="flex-1 overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-500 text-sm">
                            Tidak ada Notifikasi.
                        </div>
                    ) : (
                        notifications.map((n, i) => (
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
                        className="block text-center py-3 text-primary-600 dark:text-primary-400 border-t dark:border-secondary-700 text-xs"
                    >
                        Lihat Semua
                    </Link>
                )}
            </div>
        </>
    );
}
