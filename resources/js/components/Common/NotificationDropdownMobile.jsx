import { useState } from "react";
import { Link } from "@inertiajs/react";
import { X } from "lucide-react";
import NotificationCard from "@/components/Common/NotificationCard";
import Button from "./Button";

export default function NotificationDropdownMobile({
    open,
    onClose,
    notifications = [],
    onMarkAllRead,
    onNotificationClick,
    viewAllNotification = "/notifications",
}) {
    const unreadItems = notifications.filter((n) => !n.is_read);
    const readItems = notifications.filter((n) => n.is_read).slice(0, 3);
    return (
        <>
            <div
                className={`fixed inset-0 bg-black/40 z-modal transition-opacity duration-200 md:hidden
                            ${
                                open
                                    ? "opacity-100"
                                    : "opacity-0 pointer-events-none"
                            }`}
                onClick={onClose}
            />

            <div
                className={`fixed top-0 inset-x-0 z-modal bg-white dark:bg-secondary-800 rounded-b-md shadow-xl transition-transform duration-300 
                            ${
                                open
                                    ? "translate-y-0"
                                    : "-translate-y-full opacity-0 invisible"
                            }
                            min-h-[20vh] max-h-[75vh] flex flex-col md:hidden`}
            >
                <div className="flex justify-between items-center px-4 py-3 border-b dark:border-secondary-700">
                    <h2 className="font-semibold text-sm">Notifikasi</h2>

                    <div className="flex items-center gap-3">
                        {unreadItems.length > 0 && (
                            <Button
                                variant="ghost"
                                onClick={onMarkAllRead}
                                className="py-1 px-2 text-primary-600 dark:text-primary-400 text-[11px] hover:underline rounded-md"
                            >
                                Semua dibaca
                            </Button>
                        )}
                        <button onClick={onClose} className="p-1">
                            <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <div className="py-2">
                        {unreadItems.length > 0 ? (
                            unreadItems.map((n) => (
                                <div
                                    key={n.id}
                                    onClick={() => {
                                        onNotificationClick(n.id);
                                        onClose();
                                    }}
                                    className="cursor-pointer active:bg-secondary-100 dark:active:bg-secondary-700 transition"
                                >
                                    <NotificationCard
                                        title={n.data.title}
                                        tpye={n.data.type}
                                        message={n.data.message}
                                        time={n.created_at_human}
                                        isRead={n.is_read}
                                        variant="dropdown"
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-gray-400 text-xs">
                                Tidak ada notifikasi terbaru.
                            </div>
                        )}
                    </div>

                    {readItems.length > 0 && (
                        <div className="border-t dark:border-secondary-700">
                            <div className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-secondary-50/50 dark:bg-secondary-900/50">
                                Notifikasi Terakhir
                            </div>
                            {readItems.map((n) => (
                                <div
                                    key={n.id}
                                    onClick={() => {
                                        onNotificationClick(n.id);
                                        onClose();
                                    }}
                                    className="opacity-70 active:opacity-100 cursor-pointer"
                                >
                                    <NotificationCard
                                        title={n.data.title}
                                        tpye={n.data.type}
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
                        className="block text-center py-3 text-primary-600 dark:text-primary-400 border-t dark:border-secondary-700 text-xs"
                    >
                        Lihat Semua
                    </Link>
                )}
            </div>
        </>
    );
}
