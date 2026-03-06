import { useState } from "react";
import { Link } from "@inertiajs/react";

export default function NavMenuItem({
    label,
    href = "#",
    isActive = false,
    hasDropdown = false,
    dropdownItems = [],
}) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <li className="relative ">
            <Link
                href={href}
                className={`block py-2 px-3 rounded-sm md:p-0 sm:hover:bg-secondary-300 sm:dark:hover:bg-secondary-700 outline-none  focus-visible:text-primary-500 dark:focus-visible:text-primary-400 "
                    ${
                        isActive
                            ? "text-white bg-primary-700 md:bg-transparent sm:hover:bg-primary-700 dark:sm:hover:bg-primary-700 md:hover:bg-transparent dark:md:hover:bg-transparent md:text-primary-500 md:font-bold md:dark:text-primary-400"
                            : "text-gray-800 hover:bg-transparent md:hover:bg-transparent md:hover:text-primary-500 md:hover:font-bold dark:text-white dark:hover:bg-secondary-700 dark:hover:text-white md:dark:hover:text-primary-400 md:dark:hover:bg-transparent "
                    }`}
                aria-current={isActive ? "page" : undefined}
                onClick={hasDropdown ? toggleDropdown : null}
                hasDropdown
            >
                {label}
            </Link>

            {/* Dropdown menu */}
            {hasDropdown && isOpen && (
                <ul className="absolute left-0 mt-2 w-48 bg-white border border-secondary-200 rounded-lg shadow-md dark:bg-secondary-800 dark:border-secondary-600">
                    {dropdownItems.map((item, index) => (
                        <li key={index}>
                            <Link
                                href={item.href}
                                className="block py-2 px-3 text-gray-800 dark:text-white hover:bg-secondary-300 dark:hover:bg-secondary-700 "
                            >
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </li>
    );
}
