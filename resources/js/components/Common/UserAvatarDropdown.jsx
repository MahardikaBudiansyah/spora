import Avatar from "@/components/Common/Avatar";
import Dropdown from "@/components/Common/Dropdown";

const getInitials = (name) => {
    if (!name) return "";
    const words = name.trim().split(" ");
    return words
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase();
};

export default function UserAvatarDropdown({ user, menuItems }) {
    if (!user) return null;

    return (
        <Dropdown>
            <Dropdown.Trigger>
                <div className="flex items-center gap-2 cursor-pointer">
                    <Avatar
                        src={user.photo || ""} // pastikan string kosong kalau null
                        fallback={getInitials(user.name)}
                        size="md"
                    />
                </div>
            </Dropdown.Trigger>

            <Dropdown.Content align="right" width="48">
                <div className="my-2 px-4 py-2 hidden md:flex items-center gap-2 border-b border-b-secondary-100 dark:border-b-secondary-600 cursor-pointer">
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
                                onClick={item.onClick}
                                className="w-full text-xs text-left px-4 py-2 hover:bg-primary-400 dark:hover:bg-secondary-700 dark:text-secondary-100 flex items-center"
                                type="button"
                            >
                                {item.icon && (
                                    <item.icon className="w-4 h-4 mr-2 inline-block" />
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
                        >
                            {item.icon && (
                                <item.icon className="w-4 h-4 mr-2 inline-block" />
                            )}
                            {item.label}
                        </Dropdown.Link>
                    );
                })}
            </Dropdown.Content>
        </Dropdown>
    );
}
