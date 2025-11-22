import { usePage } from "@inertiajs/react";
import { Link } from "@inertiajs/react";
import { ChevronRight } from "lucide-react";
import { route } from "ziggy-js";
import { toTitleCase } from "@/utils/stringFormatter";

export default function Breadcrumb() {
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
        <nav className="text-sm text-muted-foreground">
            <ol className="flex items-center flex-wrap">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;
                    return (
                        <li key={index} className="flex items-center">
                            {index > 0 && (
                                <ChevronRight className="mx-1 w-4 h-4" />
                            )}
                            {isLast ? (
                                <span className="font-semibold text-foreground">
                                    {item.label}
                                </span>
                            ) : (
                                <Link
                                    href={item.href}
                                    className="hover:underline"
                                >
                                    {item.label}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
