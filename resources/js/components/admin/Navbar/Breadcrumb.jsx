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
            { label: "Profil Admin", href: route("admin.profile.index") },
        ],
        "admin.dashboard": [
            {
                label: "Dashboard",
                href: route("admin.dashboard"),
                Icon: Home,
            },
        ],
        "admin.notifications.index": [
            {
                label: "Dashboard",
                href: route("admin.dashboard"),
                Icon: Home,
            },
            {
                label: "Notifikasi",
                href: route("admin.notifications.index"),
            },
        ],
        "admin.notifications.archive": [
            {
                label: "Dashboard",
                href: route("admin.dashboard"),
                Icon: Home,
            },
            {
                label: "Arsip Notifikasi",
                href: route("admin.notifications.archive"),
            },
        ],
        "admin.users.index": [
            {
                label: "Dashboard",
                href: route("admin.dashboard"),
                Icon: Home,
            },
            {
                label: "Data User Konsumen",
                href: route("admin.users.index"),
            },
        ],
        "admin.merchants.index": [
            {
                label: "Dashboard",
                href: route("admin.dashboard"),
                Icon: Home,
            },
            {
                label: "Data Mitra",
                href: route("admin.merchants.index"),
            },
        ],
        "admin.merchants.show": [
            {
                label: "Dashboard",
                href: route("admin.dashboard"),
                Icon: Home,
            },
            { label: "Data Mitra", href: route("admin.merchants.index") },
            {
                label: params.merchant
                    ? toTitleCase(params.merchant.replace(/-/g, " "))
                    : "Mitra",
                href: params.merchant
                    ? route("admin.merchants.show", {
                          merchant: params.merchant,
                      })
                    : "#",
            },
            {
                label: "Detail Informasi",
            },
        ],
        "admin.merchants.verification.index": [
            {
                label: "Dashboard",
                href: route("admin.dashboard"),
                Icon: Home,
            },
            { label: "Data Mitra", href: route("admin.merchants.index") },
            {
                label: params.merchant
                    ? toTitleCase(params.merchant.replace(/-/g, " "))
                    : "Mitra",
                href: params.merchant
                    ? route("admin.merchants.verification.index", {
                          merchant: params.merchant,
                      })
                    : "#",
            },
            {
                label: "Verifikasi",
            },
        ],
        "admin.venues.index": [
            {
                label: "Dashboard",
                href: route("admin.dashboard"),
                Icon: Home,
            },
            {
                label: "Data Venue",
                href: route("admin.venues.index"),
            },
        ],
        "admin.venues.show": [
            {
                label: "Dashboard",
                href: route("admin.dashboard"),
                Icon: Home,
            },
            { label: "Data Venue", href: route("merchant.venues.index") },
            {
                label: params.venue
                    ? toTitleCase(params.venue.replace(/-/g, " "))
                    : "Venue",
                href: params.venue
                    ? route("admin.venues.show", { venue: params.venue })
                    : "#",
            },
            {
                label: "Detail Informasi",
            },
        ],
        "admin.venues.verification.index": [
            {
                label: "Dashboard",
                href: route("admin.dashboard"),
                Icon: Home,
            },
            { label: "Data Venue", href: route("admin.venues.index") },
            {
                label: params.venue
                    ? toTitleCase(params.venue.replace(/-/g, " "))
                    : "Venue",
                href: params.venue
                    ? route("admin.venues.verification.index", {
                          venue: params.venue,
                      })
                    : "#",
            },
            {
                label: "Verifikasi",
            },
        ],
        "admin.venues.courts.show": [
            {
                label: "Dashboard",
                href: route("admin.dashboard"),
                Icon: Home,
            },
            { label: "Data Venue", href: route("merchant.venues.index") },
            {
                label: params.venue
                    ? toTitleCase(params.venue.replace(/-/g, " "))
                    : "Venue",
                href: params.venue
                    ? route("admin.venues.show", { venue: params.venue })
                    : "#",
            },
            {
                label: params.court
                    ? toTitleCase(params.court.replace(/-/g, " "))
                    : "Lapangan",
                href:
                    params.venue && params.court
                        ? route("admin.venues.courts.show", {
                              venue: params.venue,
                              court: params.court,
                          })
                        : "#",
            },
            {
                label: "Detail Informasi",
            },
        ],
        "admin.courts.index": [
            {
                label: "Dashboard",
                href: route("admin.dashboard"),
                Icon: Home,
            },
            {
                label: "Data Lapangan",
                href: route("admin.courts.index"),
            },
        ],
        "admin.membershipCards.index": [
            {
                label: "Dashboard",
                href: route("admin.dashboard"),
                Icon: Home,
            },
            {
                label: "Data Kartu Member",
                href: route("admin.membershipCards.index"),
            },
        ],
        "admin.membershipOrders.index": [
            {
                label: "Dashboard",
                href: route("admin.dashboard"),
                Icon: Home,
            },
            {
                label: "Data Pesanan Membership",
                href: route("admin.membershipOrders.index"),
            },
        ],
        "admin.bookings.index": [
            {
                label: "Dashboard",
                href: route("admin.dashboard"),
                Icon: Home,
            },
            {
                label: "Data Pesanan Booking Lapangan",
                href: route("admin.bookings.index"),
            },
        ],
        "admin.payments.index": [
            {
                label: "Dashboard",
                href: route("admin.dashboard"),
                Icon: Home,
            },
            {
                label: "Data Pembayaran",
                href: route("admin.payments.index"),
            },
        ],
        "admin.transactions.index": [
            {
                label: "Dashboard",
                href: route("admin.dashboard"),
                Icon: Home,
            },
            {
                label: "Data Transaksi",
                href: route("admin.transactions.index"),
            },
        ],

        "admin.admins.index": [
            {
                label: "Dashboard",
                href: route("admin.dashboard"),
                Icon: Home,
            },
            {
                label: "Data Admin",
                href: route("admin.admins.index"),
            },
        ],
        "admin.masterData.venueFacilities.index": [
            {
                label: "Dashboard",
                href: route("admin.dashboard"),
                Icon: Home,
            },
            {
                label: "Master Data Fasilitas Venue",
                href: route("admin.masterData.venueFacilities.index"),
            },
        ],
        "admin.masterData.venueCategories.index": [
            {
                label: "Dashboard",
                href: route("admin.dashboard"),
                Icon: Home,
            },
            {
                label: "Master Data Kategori Venue",
                href: route("admin.masterData.venueCategories.index"),
            },
        ],
        "admin.masterData.courtCategories.index": [
            {
                label: "Dashboard",
                href: route("admin.dashboard"),
                Icon: Home,
            },
            {
                label: "Master Data Kategori Lapangan",
                href: route("admin.masterData.courtCategories.index"),
            },
        ],
        "admin.masterData.courtSurfaces.index": [
            {
                label: "Dashboard",
                href: route("admin.dashboard"),
                Icon: Home,
            },
            {
                label: "Master Data Tipe Lapangan",
                href: route("admin.masterData.courtSurfaces.index"),
            },
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
