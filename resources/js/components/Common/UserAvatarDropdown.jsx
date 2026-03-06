import Avatar from "@/components/Common/Avatar";
import Dropdown from "@/components/Common/Dropdown";
import { useState } from "react";
import UserAvatarDropdownMobile from "@/components/Common/UserAvatarDropdownMobile";

const getInitials = (name) => {
    if (!name) return "?";
    const words = name.trim().split(" ");
    return words
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase();
};

export default function UserAvatarDropdown({ src, user, menuItems = [] }) {
    const [mobileOpen, setMobileOpen] = useState(false);

    if (!user) return null;

    const photoSrc = src
        ? src.startsWith("/assets") ||
          src.startsWith("http") ||
          src.startsWith("blob:") ||
          src.startsWith("/storage") ||
          src.startsWith("storage")
            ? src
            : `/storage/${src}`
        : null;

    const handleTriggerClick = (e, toggleOpen) => {
        if (window.innerWidth < 768) {
            e.preventDefault();
            setMobileOpen(true);
        } else {
            toggleOpen();
        }
    };

    return (
        <div>
            {/* DESKTOP DROPDOWN */}
            <Dropdown>
                <Dropdown.Trigger>
                    <div
                        onClick={(e) => {
                            if (window.innerWidth < 768) {
                                e.stopPropagation();
                                e.preventDefault();
                                setMobileOpen(true);
                            }
                        }}
                        className="flex items-center gap-2 cursor-pointer hover:ring-4 hover:ring-primary-100 dark:hover:ring-secondary-700 focus:ring-4 focus:ring-gray-200 dark:foucs:ring-gray-700 rounded-full transition-all"
                        aria-label="User menu"
                    >
                        <Avatar
                            src={photoSrc}
                            fallback={getInitials(user.name)}
                            size="md"
                        />
                    </div>
                </Dropdown.Trigger>

                <Dropdown.Content
                    align="right"
                    width="60"
                    className="hidden md:block"
                >
                    <div className="my-2 px-4 py-2 hidden md:flex items-center gap-2 border-b border-b-secondary-100 dark:border-b-secondary-600 cursor-default">
                        <Avatar
                            src={photoSrc}
                            fallback={getInitials(user.name)}
                            size="md"
                        />
                        <div className="flex flex-col text-left leading-tight">
                            <span className="text-xs font-medium text-secondary-800 dark:text-secondary-100">
                                {user.name}
                            </span>
                            <span className="text-[10px] pl-0.5 text-secondary-500 dark:text-secondary-400">
                                {user.email}
                            </span>
                        </div>
                    </div>

                    {menuItems.map((item, index) => {
                        if (item.as === "button") {
                            return (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={item.onClick}
                                    className="w-full text-xs text-left px-4 py-2 hover:bg-primary-400 dark:hover:bg-secondary-700 dark:text-secondary-100 flex items-center"
                                >
                                    {item.icon && (
                                        <item.icon className="w-4 h-4 mr-2" />
                                    )}
                                    {item.label}
                                </button>
                            );
                        }
                        return (
                            <Dropdown.Link
                                key={index}
                                href={item.href}
                                method={item.method}
                                as={item.as}
                                className="flex items-center text-xs px-4 py-2 hover:bg-primary-400 dark:hover:bg-secondary-700 dark:text-secondary-100"
                            >
                                {item.icon && (
                                    <item.icon className="w-4 h-4 mr-2" />
                                )}
                                {item.label}
                            </Dropdown.Link>
                        );
                    })}
                </Dropdown.Content>
            </Dropdown>

            {/* MOBILE VERSION */}
            <UserAvatarDropdownMobile
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
                src={photoSrc}
                user={user}
                menuItems={menuItems}
            />
        </div>
    );
}
