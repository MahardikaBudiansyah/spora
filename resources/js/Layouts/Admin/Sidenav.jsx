import { usePage } from "@inertiajs/react";
import { useEffect, useRef } from "react";
import useToggleMap from "@/hooks/useToggleMap";
import { Card, CardHeader, CardBody } from "@/components/Common/Card";
import AppLogo from "@/components/Common/AppLogo";
import AccountSection from "@/Layouts/Admin/Sidenav/AccountSection";
import DashboardSection from "@/Layouts/Admin/Sidenav/DashboardSection";
import SidenavLink from "@/components/Common/SidenavLink";
import {
    Archive,
    Bell,
    BadgePercent,
    BarChart3,
    Book,
    Settings2,
    TrendingUp,
} from "lucide-react";

export default function Sidenav({ className = "", isOpen, onClose }) {
    const { auth } = usePage().props;
    const user = auth?.admin;
    const role = user?.role;

    const menuToggles = useToggleMap({
        dashboard: false,
        account: false,
        pesanan: false,
        transaksi: false,
        pengelolaan: false,
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

        return () => sidebar.removeEventListener("scroll", handleScroll);
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
                    <a href={route("home")} className="flex items-center">
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
                            src={user?.avatar_path}
                            user={user}
                            isOpen={menuToggles.isOpen("account")}
                            toggle={() => menuToggles.toggle("account")}
                        />
                    </nav>

                    <nav className="my-4">
                        <DashboardSection
                            isOpen={menuToggles.isOpen("dashboard")}
                            toggle={() => menuToggles.toggle("dashboard")}
                        />
                    </nav>

                    <nav className="my-4">
                        <div className="my-2 font-bold text-sm text-dark dark:text-light uppercase">
                            Pemberitahuan
                        </div>
                        <ul className="py-1 flex flex-col gap-2 text-sm font-medium">
                            <li>
                                <SidenavLink
                                    href={route("admin.notifications.index")}
                                    routeName="admin.notifications.index"
                                    label="Notifikasi"
                                    icon={Bell}
                                />
                            </li>
                            <li>
                                <SidenavLink
                                    href={route("admin.notifications.archive")}
                                    routeName="admin.notifications.archive"
                                    label="Arsip"
                                    icon={Archive}
                                />
                            </li>
                        </ul>
                    </nav>

                    {/* PENGELOLAAN */}
                    <nav className="my-4">
                        <div className="my-2 font-bold text-sm text-dark dark:text-light uppercase">
                            PENGELOLAAN
                        </div>
                        <ul className="py-1 flex flex-col gap-2 text-sm font-medium">
                            <li>
                                <SidenavLink
                                    href={route("admin.users.index")}
                                    routeName="admin.users.index"
                                    label="Konsumen"
                                    icon={Book}
                                />
                            </li>
                            <li>
                                <SidenavLink
                                    href={route("admin.merchants.index")}
                                    routeName="admin.merchants.index"
                                    label="Mitra"
                                    icon={Book}
                                />
                            </li>
                            <li>
                                <SidenavLink
                                    href={route("admin.venues.index")}
                                    routeName="admin.venues.index"
                                    label="Venue"
                                    icon={Book}
                                />
                            </li>
                            <li>
                                <SidenavLink
                                    href={route("admin.courts.index")}
                                    routeName="admin.courts.index"
                                    label="Lapangan"
                                    icon={Book}
                                />
                            </li>
                            <li>
                                <SidenavLink
                                    href={route("admin.membershipCards.index")}
                                    routeName="admin.membershipCards.index"
                                    label="Kartu Membership"
                                    icon={Book}
                                />
                            </li>
                        </ul>
                    </nav>

                    {/* PESANAN */}
                    <nav className="my-4">
                        <div className="my-2 font-bold text-sm text-dark dark:text-light uppercase">
                            PESANAN
                        </div>
                        <ul className="py-1 flex flex-col gap-2 text-sm font-medium">
                            <li>
                                <SidenavLink
                                    href={route("admin.membershipOrders.index")}
                                    routeName="admin.membershipOrders.index"
                                    label="Membership"
                                    icon={Book}
                                />
                            </li>
                            <li>
                                <SidenavLink
                                    href={route("admin.bookings.index")}
                                    routeName="admin.bookings.index"
                                    label="Booking"
                                    icon={Book}
                                />
                            </li>
                        </ul>
                    </nav>

                    {/* TRANSAKSI */}
                    <nav className="my-4">
                        <div className="my-2 font-bold text-sm text-dark dark:text-light uppercase">
                            TRANSAKSI
                        </div>
                        <ul className="py-1 flex flex-col gap-2 text-sm font-medium">
                            <li>
                                <SidenavLink
                                    href={route("admin.payments.index")}
                                    routeName="admin.payments.index"
                                    label="Pembayaran"
                                    icon={Book}
                                />
                            </li>
                            <li>
                                <SidenavLink
                                    href={route("admin.transactions.index")}
                                    routeName="admin.transactions.index"
                                    label="Invoice"
                                    icon={Book}
                                />
                            </li>
                            <li>
                                <SidenavLink
                                    href={""}
                                    routeName="admin.reports.index"
                                    label="Laporan Keuangan"
                                    icon={Book}
                                />
                            </li>
                        </ul>
                    </nav>

                    {role === "superadmin" && (
                        <nav className="my-4">
                            <div className="my-2 font-bold text-sm text-dark dark:text-light uppercase">
                                KELOLA ADMIN
                            </div>
                            <ul className="py-1 flex flex-col gap-2 text-sm font-medium">
                                <li>
                                    <SidenavLink
                                        href={route("admin.admins.index")}
                                        routeName="admin.admins.index"
                                        label="Data Admin"
                                        icon={Settings2}
                                    />
                                </li>
                            </ul>
                        </nav>
                    )}

                    {/* KEUANGAN PLATFORM */}
                    {/* <nav className="my-4">
                        <div className="my-2 font-bold text-sm text-dark dark:text-light uppercase">
                            KEUANGAN PLATFORM
                        </div>
                        <ul className="py-1 flex flex-col gap-2 text-sm font-medium">
                            <li>
                                <SidenavLink
                                    href=""
                                    routeName="admin"
                                    label="Konfigurasi Fee"
                                    icon={BadgePercent}
                                />
                            </li>

                            <li>
                                <SidenavLink
                                    href=""
                                    routeName="admin"
                                    label="Pendapatan Platform"
                                    icon={TrendingUp}
                                />
                            </li>

                            <li>
                                <SidenavLink
                                    href=""
                                    routeName="admin"
                                    label="Laporan Platform"
                                    icon={BarChart3}
                                />
                            </li>
                        </ul>
                    </nav> */}

                    {/* KELOLA DATA MASTER ATAU DATA REFERENSI */}
                    <nav className="my-4">
                        <div className="my-2 font-bold text-sm text-dark dark:text-light uppercase">
                            DATA MASTER
                        </div>
                        <ul className="py-1 flex flex-col gap-2 text-sm font-medium">
                            <li>
                                <SidenavLink
                                    href={route(
                                        "admin.masterData.venueFacilities.index",
                                    )}
                                    routeName="admin.masterData.venueFacilities.index"
                                    label="Fasilitas Venue"
                                    icon={Settings2}
                                />
                            </li>
                            <li>
                                <SidenavLink
                                    href={route(
                                        "admin.masterData.venueCategories.index",
                                    )}
                                    routeName="admin.masterData.venueCategories.index"
                                    label="Kategori Venue"
                                    icon={Settings2}
                                />
                            </li>
                            <li>
                                <SidenavLink
                                    href={route(
                                        "admin.masterData.courtCategories.index",
                                    )}
                                    routeName="admin.masterData.courtCategories.index"
                                    label="Kategori Lapangan"
                                    icon={Settings2}
                                />
                            </li>
                            <li>
                                <SidenavLink
                                    href={route(
                                        "admin.masterData.courtSurfaces.index",
                                    )}
                                    routeName="admin.masterData.courtSurfaces.index"
                                    label="Tipe Lapangan"
                                    icon={Settings2}
                                />
                            </li>
                        </ul>
                    </nav>
                </CardBody>
            </Card>
        </aside>
    );
}
