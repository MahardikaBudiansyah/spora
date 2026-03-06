import { useEffect, useState } from "react";
import { usePage, router } from "@inertiajs/react";
import { route } from "ziggy-js";
import Breadcrumb from "@/components/Admin/Navbar/Breadcrumb";
import SearchInput from "@/components/Common/SearchInput";
import NotificationDropdown from "@/components/Common/NotificationDropdown";
import UserAvatarDropdown from "@/components/Common/UserAvatarDropdown";
import ThemeToggle from "@/components/Common/ThemeToggle";
import { Card } from "@/components/Common/Card";
import { LayoutDashboard, User, Settings, LogOut, Search } from "lucide-react";
import HamburgerButton from "@/components/Common/HamburgerButton";
import IconButton from "@/components/Common/IconButton";
import DevelopmentPlaceholder from "@/components/Common/DevelopmentPlaceholder";

export default function Navbar({ onMenuClick, isSidebarOpen }) {
    const { auth, notifications } = usePage().props;

    const admin = auth?.admin;

    const [scrolled, setScrolled] = useState(false);
    const [showDevModal, setShowDevModal] = useState(false);

    const handleNotificationClick = (id) => {
        router.post(
            route("admin.notifications.markAsRead", id),
            {},
            {
                preserveScroll: true,
            },
        );
    };

    const handleMarkAllRead = () => {
        router.post(
            route("admin.notifications.markAllRead"),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    console.log("Semua notifikasi ditandai dibaca");
                },
            },
        );
    };

    const menuItems = [
        {
            label: "Dashboard",
            href: route("admin.dashboard"),
            icon: LayoutDashboard,
        },
        {
            label: "Profil Admin",
            href: route("admin.profile.index"),
            icon: User,
        },
        { label: "Pengaturan", icon: Settings },
        {
            label: "Keluar",
            onClick: () => router.post(route("admin.logout")),
            as: "button",
            icon: LogOut,
        },
    ];

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 right-0 h-24 z-navbar ${
                isSidebarOpen ? "left-0 lg:left-64" : "left-0"
            }`}
        >
            <Card
                className={`flex flex-row items-center justify-between px-4 py-3 md:py-4 md:m-2 h-full border-none md:border rounded-none md:rounded-lg overflow-visible ${
                    scrolled
                        ? "bg-white/90 dark:bg-secondary-900/80 backdrop-blur-md shadow-sm border-secondary-200 dark:border-secondary-700"
                        : "bg-transparent dark:bg-transparent border-transparent shadow-none"
                }`}
            >
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-3">
                        <HamburgerButton
                            isOpen={isSidebarOpen}
                            onClick={onMenuClick}
                            className="block"
                        />
                        <Breadcrumb className="hidden sm:block" />
                    </div>
                </div>

                <div className="flex flex-row justify-between items-center space-x-4">
                    <div className="hidden sm:block">
                        <SearchInput
                            readOnly={true}
                            onClick={() => setShowDevModal(true)}
                        />
                    </div>

                    <div className="flex space-x-4">
                        <IconButton
                            variant="light"
                            tooltip="Cari"
                            onClick={() => setShowDevModal(true)}
                            className="sm:hidden rounded-full border-none bg-secondary-100 dark:bg-secondary-700 "
                        >
                            <Search className="w-5 h-4" />
                        </IconButton>
                        <NotificationDropdown
                            notifications={notifications.list.data || []}
                            unreadCount={notifications.unread_count}
                            onNotificationClick={handleNotificationClick}
                            onMarkAllRead={handleMarkAllRead}
                            viewAllNotification={route(
                                "admin.notifications.index",
                            )}
                        />
                        <UserAvatarDropdown
                            src={admin?.avatar_path}
                            user={admin}
                            menuItems={menuItems}
                        />
                        <ThemeToggle />
                    </div>
                </div>
                <DevelopmentPlaceholder
                    title="Pencarian Global"
                    show={showDevModal}
                    onClose={() => setShowDevModal(false)}
                />
            </Card>
        </nav>
    );
}
