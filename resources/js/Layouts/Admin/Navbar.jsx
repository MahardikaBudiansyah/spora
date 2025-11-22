import { useEffect, useState } from "react";
import { usePage, router } from "@inertiajs/react";
import { route } from "ziggy-js";
import Breadcrumb from "@/components/admin/Navbar/Breadcrumb";
import SearchInput from "@/components/Common/SearchInput";
import NotificationDropdown from "@/components/Common/NotificationDropdown";
import UserAvatarDropdown from "@/components/Common/UserAvatarDropdown";
import ThemeToggle from "@/components/Common/ThemeToggle";
import { Card } from "@/components/Common/Card";
import { LayoutDashboard, User, Settings, LogOut } from "lucide-react";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    const { auth } = usePage().props;
    const admin = auth?.admin;

    // Menu universal berdasarkan role
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

    // Dummy notifications
    const [notifications, setNotifications] = useState([
        {
            title: "Booking Baru",
            message: "Ada booking baru di lapangan A",
            time: "21-11-2025 19:00",
            isRead: false,
            onDelete: () => console.log("Hapus notif 1"),
        },
        {
            title: "Update Profil",
            message: "Profil merchant Anda sudah diverifikasi",
            time: "20-11-2025 15:30",
            isRead: true,
            onDelete: () => console.log("Hapus notif 2"),
        },
        {
            title: "Maintenance",
            message: "Lapangan B sedang dalam pemeliharaan",
            time: "19-11-2025 09:00",
            isRead: false,
            onDelete: () => console.log("Hapus notif 3"),
        },
        {
            title: "Update Profil",
            message: "Profil merchant Anda sudah diverifikasi",
            time: "20-11-2025 15:30",
            isRead: true,
            onDelete: () => console.log("Hapus notif 2"),
        },
        {
            title: "Update Profil",
            message: "Profil merchant Anda sudah diverifikasi",
            time: "20-11-2025 15:30",
            isRead: true,
            onDelete: () => console.log("Hapus notif 2"),
        },
        {
            title: "Update Profil",
            message: "Profil merchant Anda sudah diverifikasi",
            time: "20-11-2025 15:30",
            isRead: true,
            onDelete: () => console.log("Hapus notif 2"),
        },
        {
            title: "Update Profil",
            message: "Profil merchant Anda sudah diverifikasi",
            time: "20-11-2025 15:30",
            isRead: true,
            onDelete: () => console.log("Hapus notif 2"),
        },
    ]);

    return (
        <nav className="fixed m-4 md:m-2 top-0 left-0 md:left-64 right-0 h-24 z-50">
            <Card
                className={`flex flex-col md:flex-row gap-2 justify-between px-4 py-4 border rounded-lg shadow-sm overflow-visible transition ${
                    scrolled
                        ? "bg-white dark:bg-stone-900 shadow-sm border-stone-200 dark:border-stone-700"
                        : "bg-transparent dark:bg-transparent border-0 shadow-none"
                }`}
            >
                {/* Kiri: Breadcrumb */}
                <div className="flex items-center space-x-4">
                    <Breadcrumb />
                </div>

                {/* Kanan: Theme, Notification, Account */}
                <div className="flex flex-row justify-between items-center space-x-4">
                    <SearchInput />
                    <div className="flex space-x-4">
                        <NotificationDropdown notifications={notifications} />
                        <UserAvatarDropdown
                            user={admin}
                            menuItems={menuItems}
                        />
                        <ThemeToggle />
                    </div>
                </div>
            </Card>
        </nav>
    );
}
