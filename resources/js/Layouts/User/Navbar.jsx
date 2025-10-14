import { useState, useId } from "react";
import { useAuthModal } from "@/contexts/AuthModalContext";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import HamburgerButton from "@/components/common/HamburgerButton";
import ThemeToggle from "@/components/common/ThemeToggle";
import NavLogo from "@/components/user/navbar/Navlogo";
import NavMenuItem from "@/components/user/navbar/NavMenuItem";
import NavAction from "@/components/user/navbar/NavAction";
import UserAvatarDropdown from "@/components/common/UserAvatarDropdown";
import { ShoppingCart, LayoutDashboard, User, LogOut } from "lucide-react";
import Cart from "@/components/user/Cart";

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
            href: route("user.dashboard"),
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

    return (
        <nav className="bg-white dark:bg-dark fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
            <div className="max-w-screen-lg flex flex-wrap items-center justify-between mx-auto p-4">
                <NavLogo />

                <div className="relative flex items-center md:order-2 space-x-3 md:space-x-4 rtl:space-x-reverse">
                    {/* Cart icon */}
                    {/* Cart icon */}
                    <div className="relative">
                        <ShoppingCart
                            className="mr-4 text-primary-600 w-5 h-5 cursor-pointer"
                            onClick={async () => {
                                if (authenticated) {
                                    await fetchCarts(); // refresh dulu biar pasti update
                                    setIsCartOpen(true);
                                } else {
                                    openModal("login", true);
                                }
                            }}
                        />

                        {authenticated && cartCount > 0 && (
                            <span className="absolute -top-[9px] right-1.5 bg-red-500 text-white text-[10px] leading-4 font-bold px-1 h-[18px] min-w-[20px] flex items-center justify-center rounded-full">
                                {cartCount > 99 ? "99+" : cartCount}
                            </span>
                        )}
                    </div>

                    {/* User avatar / auth buttons */}
                    {authenticated ? (
                        <UserAvatarDropdown user={user} menuItems={userMenu} />
                    ) : (
                        <NavAction onOpenModal={openModal} />
                    )}

                    <ThemeToggle tooltipPlacement="right" />
                    <div className="hidden md:block w-px h-6 bg-gray-300 dark:bg-gray-600" />
                    <HamburgerButton
                        isOpen={isOpen}
                        onClick={() => setIsOpen(!isOpen)}
                        ariaControls={menuId}
                        aria-expanded={isOpen}
                    />
                </div>

                {/* Menu navigasi */}
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

                        {/* Auth buttons khusus mobile */}
                        {!authenticated && (
                            <>
                                <hr className="my-4 border-gray-300 dark:border-gray-600 md:hidden" />
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
