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
        "merchant.dashboard": [
            { label: "Dashboard", href: route("merchant.dashboard") },
        ],
        "merchant.staff.index": [
            { label: "Dashboard", href: route("merchant.dashboard") },
            { label: "Staff", href: route("merchant.staff.index") },
        ],
        "merchant.staff.operator.index": [
            { label: "Dashboard", href: route("merchant.dashboard") },
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
            { label: "Dashboard", href: route("merchant.dashboard") },
            { label: "Membership", href: route("merchant.memberships.index") },
        ],
        "merchant.memberships.packages.index": [
            { label: "Dashboard", href: route("merchant.dashboard") },
            {
                label: "Paket Membership",
                href: route("merchant.memberships.packages.index"),
            },
        ],
        "merchant.venues.index": [
            { label: "Dashboard", href: route("merchant.dashboard") },
            { label: "Venue", href: route("merchant.venues.index") },
        ],
        "merchant.venues.create": [
            { label: "Dashboard", href: route("merchant.dashboard") },
            { label: "Venue", href: route("merchant.venues.index") },
            {
                label: "Tambah",
            },
        ],
        "merchant.venues.show": [
            { label: "Dashboard", href: route("merchant.dashboard") },
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
            { label: "Dashboard", href: route("merchant.dashboard") },
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
        "merchant.venues.fields.index": [
            { label: "Dashboard", href: route("merchant.dashboard") },
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
                    ? route("merchant.venues.fields.index", {
                          venue: params.venue,
                      })
                    : "#",
            },
        ],
        "merchant.venues.fields.create": [
            { label: "Dashboard", href: route("merchant.dashboard") },
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
                    ? route("merchant.venues.fields.index", {
                          venue: params.venue,
                      })
                    : "#",
            },
            {
                label: "Tambah",
            },
        ],
        "merchant.venues.fields.show": [
            { label: "Dashboard", href: route("merchant.dashboard") },
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
                    ? route("merchant.venues.fields.index", {
                          venue: params.venue,
                      })
                    : "#",
            },
            {
                label: params.field
                    ? toTitleCase(params.field.replace(/-/g, " "))
                    : "Lapangan",
                href:
                    params.venue && params.field
                        ? route("merchant.venues.fields.show", {
                              venue: params.venue,
                              field: params.field,
                          })
                        : "#",
            },
            {
                label: "Detail Informasi",
            },
        ],
        "merchant.venues.fields.edit": [
            { label: "Dashboard", href: route("merchant.dashboard") },
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
                    ? route("merchant.venues.fields.index", {
                          venue: params.venue,
                      })
                    : "#",
            },
            {
                label: params.field
                    ? toTitleCase(params.field.replace(/-/g, " "))
                    : "Lapangan",
                href:
                    params.venue && params.field
                        ? route("merchant.venues.fields.show", {
                              venue: params.venue,
                              field: params.field,
                          })
                        : "#",
            },
            {
                label: "Edit",
            },
        ],

        "merchant.venues.fields.calendar": [
            { label: "Dashboard", href: route("merchant.dashboard") },
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
                    ? route("merchant.venues.fields.index", {
                          venue: params.venue,
                      })
                    : "#",
            },
            {
                label: params.field
                    ? toTitleCase(params.field.replace(/-/g, " "))
                    : "Lapangan",
                href:
                    params.venue && params.field
                        ? route("merchant.venues.fields.show", {
                              venue: params.venue,
                              field: params.field,
                          })
                        : "#",
            },
            {
                label: "Jadwal",
                href:
                    params.venue && params.field
                        ? route("merchant.venues.fields.calendar", {
                              venue: params.venue,
                              field: params.field,
                          })
                        : "#",
            },
        ],
        // "merchant.venues.memberships.index": [
        //     { label: "Dashboard", href: route("merchant.dashboard") },
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
            { label: "Dashboard", href: route("merchant.dashboard") },
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
            { label: "Dashboard", href: route("merchant.dashboard") },
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
            { label: "Dashboard", href: route("merchant.dashboard") },
            { label: "Profil", href: route("merchant.profile.index") },
        ],
        // "merchant.settings": [
        //     { label: "Dashboard", href: route("merchant.dashboard") },
        //     { label: "Pengaturan", href: route("merchant.settings") },
        // ],
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
