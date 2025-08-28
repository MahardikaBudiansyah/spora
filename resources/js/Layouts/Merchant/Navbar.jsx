import { useEffect, useState } from "react";
import { usePage, router } from "@inertiajs/react";
import { route } from "ziggy-js";
import Breadcrumb from "@/components/Common/Breadcrumb";
import SearchInput from "@/components/Common/SearchInput";
import NotificationDropdown from "@/components/Common/NotificationDropdown";
import UserAvatarDropdown from "@/components/Common/UserAvatarDropdown";
import ThemeToggle from "@/components/Common/ThemeToggle";
import { Card } from "@/components/Common/Card";
import { LayoutDashboard, User, Settings, LogOut } from "lucide-react";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    const { auth } = usePage().props;
    const user = auth?.staff || auth?.merchant;
    const role = auth?.staff ? "staff" : "merchant";

    // Menu universal berdasarkan role
    const menuItems =
        role === "merchant"
            ? [
                  {
                      label: "Dashboard",
                      href: route("merchant.dashboard"),
                      icon: LayoutDashboard,
                  },
                  {
                      label: "Profil Merchant",
                      href: route("merchant.profile.index"),
                      icon: User,
                  },
                  { label: "Pengaturan", icon: Settings },
                  {
                      label: "Keluar",
                      onClick: () => router.post(route("merchant.logout")),
                      as: "button",
                      icon: LogOut,
                  },
              ]
            : [
                  {
                      label: "Dashboard",
                      href: route("staff.dashboard"),
                      icon: LayoutDashboard,
                  },
                  {
                      label: "Profil Staff",
                      href: route("staff.profile.index"),
                      icon: User,
                  },
                  { label: "Pengaturan", icon: Settings },
                  {
                      label: "Keluar",
                      onClick: () => router.post(route("staff.logout")),
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
                        <NotificationDropdown />
                        <UserAvatarDropdown user={user} menuItems={menuItems} />
                        <ThemeToggle />
                    </div>
                </div>
            </Card>
        </nav>
    );
}
