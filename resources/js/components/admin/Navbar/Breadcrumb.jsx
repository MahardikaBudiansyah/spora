import { usePage, Link } from "@inertiajs/react";
import { ChevronRight, Home } from "lucide-react";
import { route } from "ziggy-js";
import { toTitleCase } from "@/utils/stringFormatter";

export default function Breadcrumb({ className = "" }) {
    const { url } = usePage();
    const current = route().current();
    const params = route().params;

    const breadcrumbMap = {
        "admin.profile.index": [
            { label: "Dashboard", href: route("admin.dashboard") },
            { label: "Profil", href: route("admin.profile.index") },
        ],
    };

    const items = breadcrumbMap[current] || [];

    return (
        <nav className={`text-sm ${className}`} aria-label="Breadcrumb">
            <ol className="flex items-center whitespace-nowrap overflow-hidden">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;
                    const IconComponent = item.Icon;

                    return (
                        <li key={index} className="flex items-center">
                            {/* Pemisah (Separator) */}
                            {index > 0 && (
                                <ChevronRight className="mx-2 w-4 h-4 text-stone-400 shrink-0" />
                            )}

                            {isLast ? (
                                // Item terakhir (Aktif)
                                <div className="flex items-center gap-1.5 font-semibold text-stone-900 dark:text-white">
                                    {IconComponent && (
                                        <IconComponent
                                            size={16}
                                            className="shrink-0"
                                        />
                                    )}
                                    <span className="truncate max-w-[150px] sm:max-w-none">
                                        {item.label}
                                    </span>
                                </div>
                            ) : (
                                // Link Navigasi (Bukan item terakhir)
                                <Link
                                    href={item.href}
                                    className="flex items-center gap-1.5 text-stone-500 hover:text-stone-700 transition-colors"
                                >
                                    {IconComponent && (
                                        <IconComponent
                                            size={16}
                                            className="shrink-0"
                                        />
                                    )}
                                    <span
                                        className={
                                            index === 0
                                                ? "hidden sm:inline"
                                                : ""
                                        }
                                    >
                                        {item.label}
                                    </span>
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
