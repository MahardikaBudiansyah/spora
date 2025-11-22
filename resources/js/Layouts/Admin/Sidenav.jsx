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

export default function Sidenav({ className = "" }) {
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
                    {/* ACCOUNT */}
                    <nav className="my-2">
                        <AccountSection
                            user={user}
                            isOpen={menuToggles.isOpen("account")}
                            toggle={() => menuToggles.toggle("account")}
                        />
                    </nav>

                    {/* DASHBOARD */}
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
                                    label="Notifikasi Aktif"
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
                                    label="User Konsumen"
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
                                    href={route("admin.fields.index")}
                                    routeName="admin.fields.index"
                                    label="Lapangan"
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
                                    href={route("admin.bookings.index")}
                                    routeName="admin.bookings.index"
                                    label="Booking"
                                    icon={Book}
                                />
                            </li>
                            <li>
                                <SidenavLink
                                    href={route("admin.memberships.index")}
                                    routeName="admin.memberships.index"
                                    label="Membership"
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

                    {/* KELOLA ANGGOTA ADMIN (ROLE SUPERADMIN) */}
                    <nav className="my-4">
                        <div className="my-2 font-bold text-sm text-dark dark:text-light uppercase">
                            KELOLA ANGGOTA
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

                    {/* KEUANGAN PLATFORM */}
                    <nav className="my-4">
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
                    </nav>
                </CardBody>
            </Card>
        </aside>
    );
}
