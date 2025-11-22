import { usePage } from "@inertiajs/react";
import { useEffect, useRef } from "react";
import useToggleMap from "@/hooks/useToggleMap";
import { Card, CardHeader, CardBody } from "@/components/Common/Card";
import AppLogo from "@/components/Common/AppLogo";
import AccountSection from "@/Layouts/Merchant/Sidenav/AccountSection";
import DashboardSection from "@/Layouts/Merchant/Sidenav/DashboardSection";
import VenueSection from "@/Layouts/Merchant/Sidenav/VenueSection";
import SidenavLink from "@/components/Common/SidenavLink";
import { Archive, Bell, Book, Settings2 } from "lucide-react";

export default function Sidenav({ className = "" }) {
    const { auth } = usePage().props;
    const user = auth?.staff || auth?.merchant;
    const role = auth?.staff ? "staff" : "merchant";

    const venues = auth?.merchant?.venues || [];
    const menuToggles = useToggleMap({
        dashboard: false,
        account: false,
        ...venues.reduce(
            (acc, v) => ({ ...acc, [`venue-${v.slug}`]: false }),
            {}
        ),
    });

    const sidebarRef = useRef(null);

    // 🧠 Key unik untuk localStorage agar tidak bentrok antar role/merchant
    const STORAGE_KEY = `sidebar-scroll-${role}`;

    // ✅ Restore posisi scroll saat komponen mount
    useEffect(() => {
        const sidebar = sidebarRef.current;
        if (!sidebar) return;

        const savedScroll = localStorage.getItem(STORAGE_KEY);
        if (savedScroll) {
            sidebar.scrollTo({
                top: parseInt(savedScroll, 10),
                behavior: "instant", // atau "auto" biar tidak terasa animasi
            });
        }

        // Saat user scroll → simpan ke localStorage (debounce agar efisien)
        let timeout;
        const handleScroll = () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                localStorage.setItem(STORAGE_KEY, sidebar.scrollTop);
            }, 150);
        };
        sidebar.addEventListener("scroll", handleScroll);

        // Bersihkan event listener saat unmount
        return () => {
            sidebar.removeEventListener("scroll", handleScroll);
        };
    }, [STORAGE_KEY]);

    return (
        <aside className={`fixed top-0 left-0 h-[98vh] w-64 ${className}`}>
            <Card
                ref={sidebarRef}
                className="m-2 h-full rounded-lg shadow-none overflow-y-auto custom-scrollbar"
            >
                <CardHeader className="pt-4 flex flex-row gap-2 justify-center items-center border-none">
                    <a href={route("home")} className="flex items-center ">
                        <AppLogo
                            variant="newlogo"
                            className="w-40"
                            alt="Spora"
                        />
                    </a>
                    {/* <div className="flex flex-col font-medium text-sm">
                        <span className="mt-1">Spora</span>
                        <span>Platform Web</span>
                    </div> */}
                </CardHeader>

                <CardBody>
                    {/* === Account Section === */}
                    <nav className="my-2">
                        <AccountSection
                            user={user}
                            role={role}
                            isOpen={menuToggles.isOpen("account")}
                            toggle={menuToggles.toggle}
                        />
                    </nav>

                    {/* === Dashboard Section === */}
                    <nav className="my-4">
                        <DashboardSection
                            role={role}
                            isOpen={menuToggles.isOpen("dashboard")}
                            toggle={() => menuToggles.toggle("dashboard")}
                        />
                    </nav>

                    {/* === Venue Section === */}
                    <nav className="my-4">
                        <div className="my-2 font-bold text-sm text-dark dark:text-light uppercase">
                            Venue
                        </div>
                        <ul className="py-1 flex flex-col gap-2 text-sm font-medium">
                            <li>
                                <SidenavLink
                                    href={route("merchant.venues.index")}
                                    routeName="merchant.venues.index"
                                    label="Semua Venue"
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
                                    `venue-${venue.slug}`
                                )}
                                toggleField={menuToggles.toggle}
                                fieldOpenMap={menuToggles.isOpen}
                            />
                        ))}
                    </nav>

                    {/* === Membership Section (merchant only) === */}
                    {role === "merchant" && (
                        <nav className="my-4">
                            <div className="my-2 font-bold text-sm text-dark dark:text-light uppercase">
                                Membership
                            </div>
                            <ul className="py-1 flex flex-col gap-2 text-sm font-medium">
                                <li>
                                    <SidenavLink
                                        href={route(
                                            "merchant.memberships.packages.index"
                                        )}
                                        routeName="merchant.memberships.packages.index"
                                        label="Paket Membership"
                                        icon={Book}
                                    />
                                </li>
                                <li>
                                    <SidenavLink
                                        href={route(
                                            "merchant.memberships.index"
                                        )}
                                        routeName="merchant.memberships.index"
                                        label="Semua Member Aktif"
                                        icon={Book}
                                    />
                                </li>
                            </ul>
                        </nav>
                    )}

                    {/* === Staff Section (merchant only) === */}
                    {role === "merchant" && (
                        <nav className="my-4">
                            <div className="my-2 font-bold text-sm text-dark dark:text-light uppercase">
                                Staff
                            </div>
                            <ul className="py-1 flex flex-col gap-2 text-sm font-medium">
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

                    {/* === Notification (merchant only) === */}
                    {role === "merchant" && (
                        <nav className="my-4">
                            <div className="my-2 font-bold text-sm text-dark dark:text-light uppercase">
                                Pemberitahuan
                            </div>
                            <ul className="py-1 flex flex-col gap-2 text-sm font-medium">
                                <li>
                                    <SidenavLink
                                        href={route(
                                            "merchant.notifications.index"
                                        )}
                                        routeName="merchant.notifications.index"
                                        label="Notifikasi Aktif"
                                        icon={Bell}
                                    />
                                </li>
                                <li>
                                    <SidenavLink
                                        href={route(
                                            "merchant.notifications.archive"
                                        )}
                                        routeName="merchant.notifications.archive"
                                        label="Arsip"
                                        icon={Archive}
                                    />
                                </li>
                            </ul>
                        </nav>
                    )}

                    {/* === Aplikasi Section (merchant only) === */}
                    {role === "merchant" && (
                        <nav className="my-4">
                            <div className="my-2 font-bold text-sm text-dark dark:text-light uppercase">
                                Aplikasi
                            </div>
                            <ul className="py-1 flex flex-col gap-2 text-sm font-medium">
                                <li>
                                    <SidenavLink
                                        href={route("merchant.settings.index")}
                                        routeName="merchant.settings.index"
                                        label="Pengaturan"
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
