// resources/js/components/Common/UserAvatarDropdownMobile.jsx
import { X } from "lucide-react";
import Avatar from "@/components/Common/Avatar";

export default function UserAvatarDropdownMobile({
    open,
    onClose,
    user,
    menuItems = [],
}) {
    if (!user) return null;

    const photoSrc = user?.photo ? `/storage/${user.photo}` : null;

    const getInitials = (name) => {
        if (!name) return "?";
        const words = name.trim().split(" ");
        return words
            .slice(0, 2)
            .map((w) => w[0])
            .join("")
            .toUpperCase();
    };

    return (
        <>
            {/* BACKDROP */}
            <div
                className={`fixed inset-0 bg-black/40 z-[90] transition-opacity duration-200 ${
                    open ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
                onClick={onClose}
            />

            {/* MOBILE SHEET */}
            <div
                className={`fixed top-0 inset-x-0 z-[100] bg-white dark:bg-secondary-800
        rounded-b-md shadow-xl transition-all duration-300  
        ${open ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}
        min-h-[35vh] max-h-[75vh] flex flex-col`}
            >
                {/* HEADER */}
                <div className="relative border-b dark:border-secondary-700">
                    {/* CLOSE BUTTON */}
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3"
                    >
                        <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    </button>

                    {/* HEADER CONTENT */}
                    <div className="flex items-center gap-3 px-4 py-3 pt-10 md:pt-3">
                        <Avatar
                            src={photoSrc}
                            fallback={getInitials(user.name)}
                            size="sm"
                        />
                        <div className="flex flex-col text-left">
                            <span className="text-sm font-semibold text-secondary-800 dark:text-secondary-100">
                                {user.name}
                            </span>
                            <span className="text-xs text-secondary-500 dark:text-secondary-400">
                                {user.email}
                            </span>
                        </div>
                    </div>
                </div>

                {/* MENU ITEMS */}
                <div className="flex-1 overflow-y-auto">
                    {menuItems.map((item, index) => {
                        if (item.as === "button") {
                            return (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={item.onClick}
                                    className="w-full text-sm text-left px-4 py-3 hover:bg-primary-400 dark:hover:bg-secondary-700 dark:text-secondary-100 flex items-center transition"
                                >
                                    {item.icon && (
                                        <item.icon className="w-5 h-5 mr-3" />
                                    )}
                                    {item.label}
                                </button>
                            );
                        }
                        return (
                            <a
                                key={index}
                                href={item.href}
                                className="flex items-center text-sm px-4 py-3 hover:bg-primary-400 dark:hover:bg-secondary-700 dark:text-secondary-100 transition"
                            >
                                {item.icon && (
                                    <item.icon className="w-5 h-5 mr-3" />
                                )}
                                {item.label}
                            </a>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
