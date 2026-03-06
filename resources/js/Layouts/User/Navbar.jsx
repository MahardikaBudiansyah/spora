import { useState, useId } from "react";
import { useAuthModal } from "@/contexts/AuthModalContext";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import HamburgerButton from "@/components/common/HamburgerButton";
import ThemeToggle from "@/components/common/ThemeToggle";
import NavLogo from "@/components/user/Navbar/Navlogo";
import NavMenuItem from "@/components/user/Navbar/NavMenuItem";
import NavAction from "@/components/user/Navbar/NavAction";
import UserAvatarDropdown from "@/components/common/UserAvatarDropdown";
import NotificationDropdown from "@/components/Common/NotificationDropdown";
import { ShoppingCart, LayoutDashboard, User, LogOut } from "lucide-react";
import Cart from "@/components/user/Cart";
import { router } from "@inertiajs/react";
import IconButton from "@/components/Common/IconButton";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const { openModal } = useAuthModal();
    const { cartCount, fetchCarts } = useCart();
    const { user, authenticated, logout } = useAuth();
    const menuId = useId();

    const userMenu = [
        {
            label: "Dashboard",
            href: route("user.dashboard.index"),
            icon: LayoutDashboard,
        },
        {
            label: "Profil Saya",
            href: route("user.profile.edit"),
            icon: User,
        },
        {
            label: "Keluar",
            onClick: logout,
            as: "button",
            icon: LogOut,
        },
    ];

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
        <nav className="bg-white dark:bg-dark fixed w-full z-20 top-0 start-0 border-b border-secondary-200 dark:border-secondary-600">
            <div className="max-w-screen-lg flex flex-wrap items-center justify-between mx-auto p-4">
                <NavLogo />

                <div className="relative flex items-center md:order-2 space-x-3 md:space-x-4 rtl:space-x-reverse">
                    {/* Cart icon */}
                    <IconButton
                        variant="light"
                        onClick={async () => {
                            if (authenticated) {
                                await fetchCarts();
                                setIsCartOpen(true);
                            } else {
                                openModal("login", true);
                            }
                        }}
                        className="relative rounded-full border-none hover:bg-secondary-100 dark:hover:bg-secondary-700 outline-none"
                    >
                        <ShoppingCart className="w-4 h-4 text-secondary-600 dark:text-secondary-300 outline-none" />

                        {authenticated && cartCount > 0 && (
                            <span className="absolute -top-1 -right-0 inline-flex items-center justify-center px-1.5 py-1 text-[10px] font-bold leading-none text-white bg-red-500 rounded-full">
                                {cartCount > 99 ? "99+" : cartCount}
                            </span>
                        )}
                    </IconButton>
                    {authenticated && (
                        <NotificationDropdown
                            notifications={notifications.list}
                            unreadCount={notifications.unread_count}
                            // onMarkAllRead={handleMarkAllRead}
                            onNotificationClick={(id) =>
                                router.post(
                                    route("user.notifications.markAsRead", id),
                                )
                            }
                        />
                    )}

                    {authenticated ? (
                        <UserAvatarDropdown user={user} menuItems={userMenu} />
                    ) : (
                        <NavAction onOpenModal={openModal} />
                    )}

                    <ThemeToggle tooltipPlacement="right" />
                    <div className="hidden md:block w-px h-6 bg-secondary-300 dark:bg-secondary-600" />
                    <HamburgerButton
                        isOpen={isOpen}
                        onClick={() => setIsOpen(!isOpen)}
                        ariaControls={menuId}
                        aria-expanded={isOpen}
                    />
                </div>

                <div
                    className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${
                        isOpen ? "block" : "hidden"
                    }`}
                    id={menuId}
                >
                    <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-secondary-100 rounded-lg bg-secondary-100 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-secondary-800 md:dark:bg-transparent dark:border-secondary-700">
                        <NavMenuItem
                            label="Home"
                            href={route("home")}
                            isActive={route().current("home")}
                        />
                        <NavMenuItem
                            label="Sewa Lapangan"
                            href={route("venues.index")}
                            isActive={route().current("venues.index")}
                        />
                        <NavMenuItem
                            label="Tentang Kami"
                            href="/about"
                            isActive={route().current("about")}
                        />
                        <NavMenuItem
                            label="Hubungi Kami"
                            href="/contact"
                            isActive={route().current("contact")}
                        />

                        {!authenticated && (
                            <>
                                <hr className="my-4 border-secondary-300 dark:border-secondary-600 md:hidden" />
                                <li className="md:hidden">
                                    <button
                                        onClick={() => openModal("login")}
                                        className="block w-full text-left px-4 py-2 text-secondary-700 dark:text-white hover:bg-secondary-200 dark:hover:bg-secondary-700 rounded cursor-pointer"
                                    >
                                        Masuk
                                    </button>
                                </li>
                                <li className="md:hidden">
                                    <button
                                        onClick={() => openModal("register")}
                                        className="block w-full text-left px-4 py-2 text-secondary-700 dark:text-white hover:bg-secondary-200 dark:hover:bg-secondary-700 rounded cursor-pointer"
                                    >
                                        Daftar
                                    </button>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>

            {/* Cart drawer */}
            <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </nav>
    );
}
