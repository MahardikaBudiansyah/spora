import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Spinner from "@/components/Common/Spinner";
import { twMerge } from "tailwind-merge";

export default function SuggestionDropdown({
    value,
    onChange,
    suggestions = [],
    onSelect,
    renderItem,
    placeholder = "",
    minLength = 2,
    loading = false,
    maxResults = 5,
    onlyNumber = false,
    readOnly = false,
    disabled = false,
    autoFocus = false,
    isError = false,
}) {
    const [open, setOpen] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const containerRef = useRef(null);
    const inputRef = useRef(null);

    const visibleItems = expanded
        ? suggestions
        : suggestions.slice(0, maxResults);

    const showMore = !expanded && suggestions.length > maxResults;

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target)
            ) {
                setOpen(false);
                setExpanded(false);
                setActiveIndex(-1);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = useCallback(
        (item) => {
            onSelect(item);
            setOpen(false);
            setExpanded(false);
            setActiveIndex(-1);

            if (inputRef.current) {
                inputRef.current.focus();
            }
        },
        [onSelect],
    );

    const handleChange = (e) => {
        let val = e.target.value;
        if (onlyNumber) {
            val = val.replace(/[^0-9]/g, "");
        }
        onChange(val);
        if (val.length >= minLength) {
            setOpen(true);
            setActiveIndex(-1);
        } else {
            setOpen(false);
        }
    };

    const handleKeyDown = useCallback(
        (e) => {
            if (!open || visibleItems.length === 0) return;

            const lastIndex = visibleItems.length - 1;

            switch (e.key) {
                case "ArrowDown":
                    e.preventDefault();
                    setActiveIndex(
                        (prevIndex) => (prevIndex + 1) % visibleItems.length,
                    );
                    break;

                case "ArrowUp":
                    e.preventDefault();
                    setActiveIndex((prevIndex) =>
                        prevIndex <= 0 ? lastIndex : prevIndex - 1,
                    );
                    break;

                case "Enter":
                    if (activeIndex >= 0) {
                        e.preventDefault();
                        handleSelect(visibleItems[activeIndex]);
                    }
                    break;

                case "Escape":
                case "Tab":
                    setOpen(false);
                    setExpanded(false);
                    setActiveIndex(-1);
                    break;

                default:
                    break;
            }
        },
        [open, visibleItems, activeIndex, handleSelect],
    );

    const handleBlur = (e) => {
        setTimeout(() => {
            if (!containerRef.current?.contains(document.activeElement)) {
                setOpen(false);
                setExpanded(false);
                setActiveIndex(-1);
            }
        }, 200);
    };

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleKeyDown]);

    const inputClasses = twMerge(
        "block w-full px-3 py-2 rounded-md border shadow-sm transition-all " +
            "dark:bg-secondary-800 " +
            "border-secondary-300 dark:border-secondary-600 " +
            "hover:border-primary-500 hover:ring-1 hover:ring-primary-500 " +
            "focus:border focus:border-primary-500 focus:ring-1 focus:ring-primary-500 " +
            "placeholder:text-xs placeholder:text-secondary-400 dark:placeholder:text-secondary-500 ",
        isError &&
            "border-red-500 dark:border-red-500 hover:border-red-500 hover:ring-red-500 focus:border-red-500 focus:ring-red-500",
        (disabled || readOnly) &&
            "text-secondary-400 dark:text-secondary-500 " +
                "bg-secondary-100 dark:bg-secondary-900 " +
                "hover:border-secondary-300 hover:ring-0 " +
                "focus:border-secondary-300 dark:border-secondary-600 focus:ring-0 " +
                "cursor-default ",
    );

    return (
        <div className="relative w-full" ref={containerRef}>
            <input
                className={inputClasses}
                value={value}
                onChange={!readOnly && !disabled ? handleChange : () => {}}
                onFocus={() => {
                    if (disabled || readOnly) return;
                    if ((value?.length || 0) >= minLength) setOpen(true);
                }}
                autoFocus={autoFocus}
                onBlur={handleBlur}
                placeholder={placeholder}
                inputMode={onlyNumber ? "numeric" : "text"}
                ref={inputRef}
                readOnly={readOnly}
                disabled={disabled}
            />

            {/* Dropdown */}
            <AnimatePresence>
                {open &&
                    value.length >= minLength &&
                    (loading || suggestions.length > 0) && (
                        <motion.ul
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.15 }}
                            className="absolute z-dropdown mt-1 w-full bg-white dark:bg-secondary-800 border dark:border-secondary-600 rounded-lg shadow-lg max-h-60 overflow-auto custom-scrollbar"
                            tabIndex={-1}
                        >
                            {loading && (
                                <li className="p-2 flex justify-center">
                                    <Spinner size="sm" />
                                </li>
                            )}

                            {!loading && visibleItems.length === 0 && (
                                <li className="p-2 text-secondary-500 dark:text-secondary-400 text-sm">
                                    Tidak ada data
                                </li>
                            )}

                            {!loading &&
                                visibleItems.map((item, idx) => {
                                    const isActive = idx === activeIndex;
                                    return (
                                        <li
                                            key={idx}
                                            className={twMerge(
                                                "px-3 py-2 cursor-pointer transition-colors",
                                                "hover:bg-primary-400 hover:text-secondary-800 dark:hover:text-secondary-800",
                                                isActive
                                                    ? "bg-primary-500 dark:bg-primary-400 text-white dark:text-secondary-800"
                                                    : "text-secondary-700 dark:text-white",
                                            )}
                                            onClick={() => handleSelect(item)}
                                            // Sinkronisasi index saat mouse hover
                                            onMouseEnter={() =>
                                                setActiveIndex(idx)
                                            }
                                            onMouseLeave={() =>
                                                setActiveIndex(-1)
                                            }
                                        >
                                            {renderItem
                                                ? renderItem(
                                                      item,
                                                      value,
                                                      isActive,
                                                  )
                                                : item}
                                        </li>
                                    );
                                })}
                            {showMore && (
                                <li
                                    className="px-3 py-2 text-secondary-600 dark:text-secondary-300 text-sm cursor-pointer hover:bg-primary-400 hover:text-secondary-800 dark:hover:text-secondary-800"
                                    onClick={() => setExpanded(true)}
                                >
                                    Lihat semua ({suggestions.length})
                                </li>
                            )}
                        </motion.ul>
                    )}
            </AnimatePresence>
        </div>
    );
}
