import {
    useState,
    createContext,
    useContext,
    Fragment,
    useEffect,
    useRef,
} from "react";
import { Link } from "@inertiajs/react";
import { Transition } from "@headlessui/react";

const DropDownContext = createContext();

const Dropdown = ({ children }) => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleOpen = () => setOpen((prev) => !prev);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <DropDownContext.Provider value={{ open, setOpen, toggleOpen }}>
            <div className="relative" ref={dropdownRef}>
                {children}
            </div>
        </DropDownContext.Provider>
    );
};

const Trigger = ({ children }) => {
    const { toggleOpen } = useContext(DropDownContext);
    return (
        <div className="cursor-pointer" onClick={toggleOpen}>
            {children}
        </div>
    );
};

const Content = ({
    align = "right",
    width = "w-48",
    contentClasses = "py-1 bg-white dark:bg-secondary-900 border dark:border-secondary-700",
    children,
    onClick, // Menerima onClick custom
}) => {
    const { open } = useContext(DropDownContext);

    let alignmentClasses = "origin-top";
    if (align === "left") alignmentClasses = "origin-top-left start-0";
    else if (align === "right") alignmentClasses = "origin-top-right end-0";

    return (
        <Transition
            as={Fragment}
            show={open}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
        >
            <div
                className={`absolute z-50 mt-2 rounded-md shadow-lg ${alignmentClasses} ${width}`}
                onClick={onClick}
            >
                <div
                    className={`rounded-md ring-1 ring-black ring-opacity-5 ${contentClasses}`}
                >
                    {children}
                </div>
            </div>
        </Transition>
    );
};

const DropdownLink = ({ className = "", children, onClick, ...props }) => {
    const { setOpen } = useContext(DropDownContext);

    return (
        <Link
            {...props}
            onClick={(e) => {
                setOpen(false);
                if (onClick) onClick(e);
            }}
            className={
                "block w-full px-4 py-2 text-start text-xs leading-5 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-secondary-800 focus:outline-none transition duration-150 ease-in-out " +
                className
            }
        >
            {children}
        </Link>
    );
};

Dropdown.Trigger = Trigger;
Dropdown.Content = Content;
Dropdown.Link = DropdownLink;

export default Dropdown;
