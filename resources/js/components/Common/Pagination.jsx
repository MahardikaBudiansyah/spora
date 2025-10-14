import { Link } from "@inertiajs/react";
import { twMerge } from "tailwind-merge";

export default function Pagination({
    links = [],
    meta = null,
    className = "",
}) {
    if (!links || links.length <= 3) return null;

    return (
        <div
            className={twMerge(
                "flex flex-col md:flex-row justify-between items-center gap-4 w-full",
                className
            )}
        >
            {meta && (
                <div className="text-sm text-gray-600 dark:text-gray-300">
                    Menampilkan <span className="font-medium">{meta.from}</span>{" "}
                    – <span className="font-medium">{meta.to}</span> dari{" "}
                    <span className="font-medium">{meta.total}</span> data
                </div>
            )}

            <div className="flex flex-wrap gap-2">
                {links.map((link, index) => (
                    <Link
                        key={index}
                        href={link.url || "#"}
                        preserveScroll
                        preserveState
                        className={twMerge(
                            "px-3 py-1 text-sm rounded transition-all duration-150",
                            link.active
                                ? "bg-primary-700 text-white"
                                : "bg-primary-500 dark:bg-primary-600 hover:bg-primary-700 text-white",
                            !link.url && "opacity-50 cursor-not-allowed"
                        )}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ))}
            </div>
        </div>
    );
}
