import Dropdown from "@/components/Common/Dropdown";
import KebabButton from "@/components/Common/KebabButton";
import { twMerge } from "tailwind-merge";

export default function KebabDropdown({ menuItems = [], className }) {
    return (
        <div className={twMerge("", className)}>
            <Dropdown>
                <Dropdown.Trigger>
                    <KebabButton
                        className="block md:hidden lg:hidden"
                        iconClassName="w-5 h-5 text-gray-600 dark:text-gray-300"
                    />
                </Dropdown.Trigger>

                <Dropdown.Content align="right" width="60">
                    {menuItems.map((item, index) =>
                        item.as === "button" ? (
                            <button
                                key={index}
                                type="button"
                                onClick={item.onClick}
                                className="w-full text-xs text-left px-4 py-2 hover:bg-primary-400 dark:hover:bg-secondary-700 dark:text-secondary-100 flex items-center whitespace-nowrap"
                            >
                                {item.icon && (
                                    <item.icon className="w-4 h-4 mr-2" />
                                )}
                                {item.label}
                            </button>
                        ) : (
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
                        ),
                    )}
                </Dropdown.Content>
            </Dropdown>
        </div>
    );
}
