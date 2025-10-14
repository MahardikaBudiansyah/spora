import { useState, useRef, useEffect } from "react";
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
    onlyNumber = false, // ✅ props tambahan
}) {
    const [open, setOpen] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target)
            ) {
                setOpen(false);
                setExpanded(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (item) => {
        onSelect(item);
        setOpen(false);
        setExpanded(false);
    };

    const visibleItems = expanded
        ? suggestions
        : suggestions.slice(0, maxResults);

    const showMore = !expanded && suggestions.length > maxResults;

    const baseClass =
        "block w-full rounded-md shadow-md border-secondary-300 shadow-sm " +
        "focus:border-primary-500 focus:ring-2 focus:ring-primary-500 hover:border-primary-500 " +
        "dark:border-secondary-600 dark:bg-secondary-800 dark:text-white " +
        "placeholder:text-xs placeholder:italic placeholder-secondary-400 dark:placeholder-secondary-500";

    // ✅ handler untuk filter angka kalau onlyNumber = true
    const handleChange = (e) => {
        let val = e.target.value;
        if (onlyNumber) {
            val = val.replace(/[^0-9]/g, ""); // hapus semua selain angka
        }
        onChange({ target: { value: val } });
    };

    return (
        <div className="relative w-full" ref={containerRef}>
            <input
                className={twMerge(
                    "w-full border rounded-lg px-3 py-2",
                    baseClass
                )}
                value={value}
                onChange={handleChange}
                onFocus={() => setOpen(true)}
                placeholder={placeholder}
                inputMode={onlyNumber ? "numeric" : "text"} // untuk mobile keyboard
            />

            {/* Dropdown */}
            <AnimatePresence>
                {open && value.length >= minLength && (
                    <motion.ul
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-20 mt-1 w-full bg-white dark:bg-secondary-800 border dark:border-secondary-600 rounded-lg shadow-lg max-h-60 overflow-auto custom-scrollbar"
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
                            visibleItems.map((item, idx) => (
                                <li
                                    key={idx}
                                    className="px-3 py-2 hover:bg-primary-400 hover:text-secondary-800 dark:hover:text-secondary-800 cursor-pointer"
                                    onClick={() => handleSelect(item)}
                                >
                                    {renderItem
                                        ? renderItem(item, value)
                                        : item}
                                </li>
                            ))}
                        {showMore && (
                            <li
                                className="px-3 py-2 text-secondary-600  dark:text-secondary-300 text-sm cursor-pointer hover:bg-primary-400 hover:text-secondary-800 dark:hover:text-secondary-800"
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
