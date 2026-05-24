import { usePage } from "@inertiajs/react";
import { useEffect, useRef } from "react";
import useToggleMap from "@/hooks/useToggleMap";
import { Card, CardHeader, CardBody } from "@/components/Common/Card";
import AppLogo from "@/components/Common/AppLogo";
import AccountSection from "@/Layouts/Merchant/Sidenav/AccountSection";
import DashboardSection from "@/Layouts/Merchant/Sidenav/DashboardSection";
import VenueSection from "@/Layouts/Merchant/Sidenav/VenueSection";
import SidenavLink from "@/components/Common/SidenavLink";
import { Archive, Bell, Book, LayoutDashboard, Settings2 } from "lucide-react";

export default function Sidenav({ className = "", isOpen, onClose }) {
    const { auth } = usePage().props;
    const user = auth?.staff || auth?.merchant;
    const role = auth?.staff ? "staff" : "merchant";

    const venues = auth?.merchant?.venues || [];
    const menuToggles = useToggleMap({
        dashboard: false,
        account: false,
        ...venues.reduce(
            (acc, v) => ({ ...acc, [`venue-${v.slug}`]: false }),
            {},
        ),
    });

    const sidebarRef = useRef(null);

    const STORAGE_KEY = `sidebar-scroll-${role}`;

    useEffect(() => {
        const sidebar = sidebarRef.current;
        if (!sidebar) return;

        const savedScroll = localStorage.getItem(STORAGE_KEY);
        if (savedScroll) {
            sidebar.scrollTo({
                top: parseInt(savedScroll, 10),
                behavior: "instant",
            });
        }

        let timeout;
        const handleScroll = () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                localStorage.setItem(STORAGE_KEY, sidebar.scrollTop);
            }, 150);
        };
        sidebar.addEventListener("scroll", handleScroll);

        return () => {
            sidebar.removeEventListener("scroll", handleScroll);
        };
    }, [STORAGE_KEY]);

    return (
        <aside
            className={`fixed top-0 left-0 bottom-0 h-full w-64 z-sidenav transition-transform duration-300 ease-in-out
            ${isOpen ? "translate-x-0" : "-translate-x-full"} 
            ${className}`}
        >
            <Card
                ref={sidebarRef}
                className="md:m-2 h-full rounded-none md:rounded-lg shadow-none overflow-y-auto custom-scrollbar "
            >
                <CardHeader className="pt-4 flex flex-row gap-2 justify-center items-center border-none relative">
                    <a
                        href={route("home")}
                        className="flex items-center outline-none"
                    >
                        <AppLogo
                            variant="newlogo"
                            className="w-40 dark:hidden"
                            alt="Spora"
                        />
                        <AppLogo
                            variant="newlogo3"
                            className="w-40 hidden dark:block"
                            alt="Spora"
                        />
                    </a>
                </CardHeader>
                <CardBody>
                    <nav className="my-2">
                        <AccountSection
                            src={user?.logo_path}
                            user={user}
                            role={role}
                            isOpen={menuToggles.isOpen("account")}
                            toggle={menuToggles.toggle}
                        />
                    </nav>

                    <nav className="my-4">
                        {/* <DashboardSection
                            role={role}
                            isOpen={menuToggles.isOpen("dashboard")}
                            toggle={() => menuToggles.toggle("dashboard")}
                        /> */}
                        <ul className="py-1 flex flex-col gap-2 text-xs font-medium">
                            <li>
                                <SidenavLink
                                    href={route("merchant.dashboard")}
                                    routeName="merchant.dashboard"
                                    label="Dashboard"
                                    icon={LayoutDashboard}
                                />
                            </li>
                        </ul>
                    </nav>

                    <nav className="my-4">
                        <div className="my-2 font-bold text-xs text-dark dark:text-light uppercase">
                            Venue
                        </div>
                        <ul className="py-1 flex flex-col gap-2 text-xs font-medium">
                            <li>
                                <SidenavLink
                                    href={route("merchant.venues.index")}
                                    routeName="merchant.venues.index"
                                    label="Kelola Venue"
                                    icon={Book}
                                />
                            </li>
                        </ul>

                        {venues.map((venue) => (
                            <VenueSection
                                key={venue.id}
                                venue={venue}
                                toggle={menuToggles.toggle}
                                isOpen={menuToggles.isOpen(
                                    `venue-${venue.slug}`,
                                )}
                                toggleCourt={menuToggles.toggle}
                                courtOpenMap={menuToggles.isOpen}
                            />
                        ))}
                    </nav>

                    {role === "merchant" && (
                        <nav className="my-4">
                            <div className="my-2 font-bold text-xs text-dark dark:text-light uppercase">
                                Membership
                            </div>
                            <ul className="py-1 flex flex-col gap-2 text-xs font-medium">
                                <li>
                                    <SidenavLink
                                        href={route(
                                            "merchant.memberships.packages.index",
                                        )}
                                        routeName="merchant.memberships.packages.index"
                                        label="Paket Membership"
                                        icon={Book}
                                    />
                                </li>
                                <li>
                                    <SidenavLink
                                        href={route(
                                            "merchant.memberships.cards.index",
                                        )}
                                        routeName="merchant.memberships.cards.index"
                                        label="Kartu Member"
                                        icon={Book}
                                    />
                                </li>
                                <li>
                                    <SidenavLink
                                        href={route(
                                            "merchant.memberships.orders.index",
                                        )}
                                        routeName="merchant.memberships.orders.index"
                                        label="Order Membership"
                                        icon={Book}
                                    />
                                </li>
                            </ul>
                        </nav>
                    )}

                    {role === "merchant" && (
                        <nav className="my-4">
                            <div className="my-2 font-bold text-xs text-dark dark:text-light uppercase">
                                Booking
                            </div>
                            <ul className="py-1 flex flex-col gap-2 text-xs font-medium">
                                <li>
                                    <SidenavLink
                                        href={route("merchant.bookings.index")}
                                        routeName="merchant.bookings.index"
                                        label="Booking"
                                        icon={Book}
                                    />
                                </li>
                            </ul>
                        </nav>
                    )}

                    {role === "merchant" && (
                        <nav className="my-4">
                            <div className="my-2 font-bold text-xs text-dark dark:text-light uppercase">
                                Staff
                            </div>
                            <ul className="py-1 flex flex-col gap-2 text-xs font-medium">
                                <li>
                                    <SidenavLink
                                        href={route("merchant.staff.index")}
                                        routeName="merchant.staff.index"
                                        label="Semua Staff"
                                        icon={Book}
                                    />
                                </li>
                            </ul>
                        </nav>
                    )}

                    {role === "merchant" && (
                        <nav className="my-4">
                            <div className="my-2 font-bold text-xs text-dark dark:text-light uppercase">
                                Pemberitahuan
                            </div>
                            <ul className="py-1 flex flex-col gap-2 text-xs font-medium">
                                <li>
                                    <SidenavLink
                                        href={route(
                                            "merchant.notifications.index",
                                        )}
                                        routeName="merchant.notifications.index"
                                        label="Notifikasi"
                                        icon={Bell}
                                    />
                                </li>
                                <li>
                                    <SidenavLink
                                        href={route(
                                            "merchant.notifications.archive",
                                        )}
                                        routeName="merchant.notifications.archive"
                                        label="Arsip"
                                        icon={Archive}
                                    />
                                </li>
                            </ul>
                        </nav>
                    )}

                    {role === "merchant" && (
                        <nav className="my-4">
                            <div className="my-2 font-bold text-xs text-dark dark:text-light uppercase">
                                Pengaturan
                            </div>
                            <ul className="py-1 flex flex-col gap-2 text-xs font-medium">
                                <li>
                                    <SidenavLink
                                        href={route(
                                            "merchant.settings.payment-policy.index",
                                        )}
                                        routeName="merchant.settings.payment-policy.index"
                                        label="Pembayaran"
                                        icon={Settings2}
                                    />
                                </li>
                            </ul>
                        </nav>
                    )}
                </CardBody>
            </Card>
        </aside>
    );
}
