import { usePage, Link } from "@inertiajs/react";
import { ChevronRight, Home } from "lucide-react";
import { route } from "ziggy-js";
import { toTitleCase } from "@/utils/stringFormatter";

export default function Breadcrumb({ className = "" }) {
    const { url } = usePage();
    const current = route().current();
    const params = route().params;

    const breadcrumbMap = {
        "merchant.dashboard": [
            {
                label: "Dashboard",
                href: route("merchant.dashboard"),
                Icon: Home,
            },
        ],
        "merchant.notifications.index": [
            {
                label: "Dashboard",
                href: route("merchant.dashboard"),
                Icon: Home,
            },
            {
                label: "Notifikasi",
                href: route("merchant.notifications.index"),
            },
        ],
        "merchant.notifications.archive": [
            {
                label: "Dashboard",
                href: route("merchant.dashboard"),
                Icon: Home,
            },
            {
                label: "Arsip Notifikasi",
                href: route("merchant.notifications.archive"),
            },
        ],
        "merchant.staff.index": [
            {
                label: "Dashboard",
                href: route("merchant.dashboard"),
                Icon: Home,
            },
            { label: "Staff", href: route("merchant.staff.index") },
        ],
        "merchant.staff.operator.index": [
            {
                label: "Dashboard",
                href: route("merchant.dashboard"),
                Icon: Home,
            },
            { label: "Staff", href: route("merchant.staff.index") },
            {
                label: params.staff
                    ? toTitleCase(params.staff.replace(/-/g, " "))
                    : "Staff",
                href: params.staff
                    ? route("merchant.staff.show", { staff: params.staff })
                    : "#",
            },
            {
                label: "Operator",
                href: params.operator
                    ? route("merchant.staff.operator.index", {
                          operator: params.operator,
                      })
                    : "#",
            },
        ],
        "merchant.memberships.index": [
            {
                label: "Dashboard",
                href: route("merchant.dashboard"),
                Icon: Home,
            },
        ],
        "merchant.memberships.packages.index": [
            {
                label: "Dashboard",
                href: route("merchant.dashboard"),
                Icon: Home,
            },
            {
                label: "Paket Membership",
                href: route("merchant.memberships.packages.index"),
            },
        ],
        "merchant.memberships.cards.index": [
            {
                label: "Dashboard",
                href: route("merchant.dashboard"),
                Icon: Home,
            },
            {
                label: "Member Aktif",
                href: route("merchant.memberships.cards.index"),
            },
        ],
        "merchant.venues.index": [
            {
                label: "Dashboard",
                href: route("merchant.dashboard"),
                Icon: Home,
            },
            { label: "Venue", href: route("merchant.venues.index") },
        ],
        "merchant.venues.create": [
            {
                label: "Dashboard",
                href: route("merchant.dashboard"),
                Icon: Home,
            },
            { label: "Venue", href: route("merchant.venues.index") },
            {
                label: "Tambah",
            },
        ],
        "merchant.venues.show": [
            {
                label: "Dashboard",
                href: route("merchant.dashboard"),
                Icon: Home,
            },
            { label: "Venue", href: route("merchant.venues.index") },
            {
                label: params.venue
                    ? toTitleCase(params.venue.replace(/-/g, " "))
                    : "Venue",
                href: params.venue
                    ? route("merchant.venues.show", { venue: params.venue })
                    : "#",
            },
            {
                label: "Detail Informasi",
            },
        ],
        "merchant.venues.edit": [
            {
                label: "Dashboard",
                href: route("merchant.dashboard"),
                Icon: Home,
            },
            { label: "Venue", href: route("merchant.venues.index") },
            {
                label: params.venue
                    ? toTitleCase(params.venue.replace(/-/g, " "))
                    : "Venue",
                href: params.venue
                    ? route("merchant.venues.show", { venue: params.venue })
                    : "#",
            },
            {
                label: "Edit",
            },
        ],
        "merchant.venues.courts.index": [
            {
                label: "Dashboard",
                href: route("merchant.dashboard"),
                Icon: Home,
            },
            { label: "Venue", href: route("merchant.venues.index") },
            {
                label: params.venue
                    ? toTitleCase(params.venue.replace(/-/g, " "))
                    : "Venue",
                href: params.venue
                    ? route("merchant.venues.show", { venue: params.venue })
                    : "#",
            },
            {
                label: "Lapangan",
                href: params.venue
                    ? route("merchant.venues.courts.index", {
                          venue: params.venue,
                      })
                    : "#",
            },
        ],
        "merchant.venues.courts.create": [
            {
                label: "Dashboard",
                href: route("merchant.dashboard"),
                Icon: Home,
            },
            { label: "Venue", href: route("merchant.venues.index") },
            {
                label: params.venue
                    ? toTitleCase(params.venue.replace(/-/g, " "))
                    : "Venue",
                href: params.venue
                    ? route("merchant.venues.show", { venue: params.venue })
                    : "#",
            },
            {
                label: "Lapangan",
                href: params.venue
                    ? route("merchant.venues.courts.index", {
                          venue: params.venue,
                      })
                    : "#",
            },
            {
                label: "Tambah",
            },
        ],
        "merchant.venues.courts.show": [
            {
                label: "Dashboard",
                href: route("merchant.dashboard"),
                Icon: Home,
            },
            { label: "Venue", href: route("merchant.venues.index") },
            {
                label: params.venue
                    ? toTitleCase(params.venue.replace(/-/g, " "))
                    : "Venue",
                href: params.venue
                    ? route("merchant.venues.show", { venue: params.venue })
                    : "#",
            },
            {
                label: "Lapangan",
                href: params.venue
                    ? route("merchant.venues.courts.index", {
                          venue: params.venue,
                      })
                    : "#",
            },
            {
                label: params.court
                    ? toTitleCase(params.court.replace(/-/g, " "))
                    : "Lapangan",
                href:
                    params.venue && params.court
                        ? route("merchant.venues.courts.show", {
                              venue: params.venue,
                              court: params.court,
                          })
                        : "#",
            },
            {
                label: "Detail Informasi",
            },
        ],
        "merchant.venues.courts.edit": [
            {
                label: "Dashboard",
                href: route("merchant.dashboard"),
                Icon: Home,
            },
            { label: "Venue", href: route("merchant.venues.index") },
            {
                label: params.venue
                    ? toTitleCase(params.venue.replace(/-/g, " "))
                    : "Venue",
                href: params.venue
                    ? route("merchant.venues.show", { venue: params.venue })
                    : "#",
            },
            {
                label: "Lapangan",
                href: params.venue
                    ? route("merchant.venues.courts.index", {
                          venue: params.venue,
                      })
                    : "#",
            },
            {
                label: params.court
                    ? toTitleCase(params.court.replace(/-/g, " "))
                    : "Lapangan",
                href:
                    params.venue && params.court
                        ? route("merchant.venues.courts.show", {
                              venue: params.venue,
                              court: params.court,
                          })
                        : "#",
            },
            {
                label: "Edit",
            },
        ],

        "merchant.venues.courts.calendar": [
            {
                label: "Dashboard",
                href: route("merchant.dashboard"),
                Icon: Home,
            },
            { label: "Venue", href: route("merchant.venues.index") },
            {
                label: params.venue
                    ? toTitleCase(params.venue.replace(/-/g, " "))
                    : "Venue",
                href: params.venue
                    ? route("merchant.venues.show", { venue: params.venue })
                    : "#",
            },
            {
                label: "Lapangan",
                href: params.venue
                    ? route("merchant.venues.courts.index", {
                          venue: params.venue,
                      })
                    : "#",
            },
            {
                label: params.court
                    ? toTitleCase(params.court.replace(/-/g, " "))
                    : "Lapangan",
                href:
                    params.venue && params.court
                        ? route("merchant.venues.courts.show", {
                              venue: params.venue,
                              court: params.court,
                          })
                        : "#",
            },
            {
                label: "Jadwal",
                href:
                    params.venue && params.court
                        ? route("merchant.venues.courts.calendar", {
                              venue: params.venue,
                              court: params.court,
                          })
                        : "#",
            },
        ],
        // "merchant.venues.memberships.index": [
        //     { label: "Dashboard", href: route("merchant.dashboard"),    Icon: Home, },
        //     { label: "Venue", href: route("merchant.venues.index") },
        //     {
        //         label: params.venue
        //             ? toTitleCase(params.venue.replace(/-/g, " "))
        //             : "Venue",
        //         href: params.venue
        //             ? route("merchant.venues.show", { venue: params.venue })
        //             : "#",
        //     },
        //     {
        //         label: "Membership",
        //         href: params.venue
        //             ? route("merchant.venues.memberships.index", {
        //                   venue: params.venue,
        //               })
        //             : "#",
        //     },
        // ],
        "merchant.venues.bookings.index": [
            {
                label: "Dashboard",
                href: route("merchant.dashboard"),
                Icon: Home,
            },
            { label: "Venue", href: route("merchant.venues.index") },
            {
                label: params.venue
                    ? toTitleCase(params.venue.replace(/-/g, " "))
                    : "Venue",
                href: params.venue
                    ? route("merchant.venues.show", { venue: params.venue })
                    : "#",
            },
            {
                label: "Booking",
                href: params.venue
                    ? route("merchant.venues.bookings.index", {
                          venue: params.venue,
                      })
                    : "#",
            },
        ],
        "merchant.venues.transactions.index": [
            {
                label: "Dashboard",
                href: route("merchant.dashboard"),
                Icon: Home,
            },
            { label: "Venue", href: route("merchant.venues.index") },
            {
                label: params.venue
                    ? toTitleCase(params.venue.replace(/-/g, " "))
                    : "Venue",
                href: params.venue
                    ? route("merchant.venues.show", { venue: params.venue })
                    : "#",
            },
            {
                label: "Transaksi",
                href: params.venue
                    ? route("merchant.venues.transactions.index", {
                          venue: params.venue,
                      })
                    : "#",
            },
        ],
        "merchant.profile.index": [
            {
                label: "Dashboard",
                href: route("merchant.dashboard"),
                Icon: Home,
            },
            { label: "Profil", href: route("merchant.profile.index") },
        ],
        // "merchant.settings": [
        //     { label: "Dashboard", href: route("merchant.dashboard"),    Icon: Home, },
        //     { label: "Pengaturan", href: route("merchant.settings") },
        // ],
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
