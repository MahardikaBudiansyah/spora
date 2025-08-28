import { usePage } from "@inertiajs/react";
import SidenavLink from "@/components/Common/SidenavLink";
import {
    ChevronRight,
    LayoutDashboard,
    FileChartLine,
    Book,
    BookA,
} from "lucide-react";

export default function DashboardSection({ role, isOpen, toggle }) {
    const { url } = usePage();

    const basePath =
        role === "merchant" ? "/merchant/dashboard" : "/staff/dashboard";
    const isAnyChildActive = url.startsWith(basePath);

    // Menu bisa disesuaikan berdasarkan role
    const menuItems =
        role === "merchant"
            ? [
                  {
                      label: "Analisis",
                      href: "/dashboard/analisis",
                      icon: FileChartLine,
                  },
                  { label: "Venues", href: "/dashboard/venues", icon: Book },
                  {
                      label: "Memberships",
                      href: "/dashboard/memberships",
                      icon: BookA,
                  },
              ]
            : [
                  {
                      label: "Aktivitas Staff",
                      href: "/staff/activity",
                      icon: FileChartLine,
                  },
                  {
                      label: "Jadwal Staff",
                      href: "/staff/schedule",
                      icon: Book,
                  },
              ];

    return (
        <ul className="flex flex-col space-y-2 text-sm font-medium">
            <li
                onClick={() => toggle("dashboard")}
                className={`flex items-center justify-between gap-2 px-4 py-2 rounded-md cursor-pointer hover:text-secondary-800 hover:bg-primary-400 transition ${
                    isAnyChildActive ? "bg-primary-400 text-dark" : ""
                }`}
            >
                <div className="flex items-center gap-2">
                    <LayoutDashboard className="w-5" />
                    <span>Dashboard</span>
                </div>
                <ChevronRight
                    className={`w-4 transition-transform ${
                        isOpen ? "rotate-90" : ""
                    }`}
                />
            </li>

            {(isOpen || isAnyChildActive) && (
                <ul className="ml-2 flex flex-col gap-2">
                    {menuItems.map((item) => (
                        <li key={item.label}>
                            <SidenavLink
                                href={item.href}
                                routeName={item.href}
                                label={item.label}
                                icon={item.icon}
                            />
                        </li>
                    ))}
                </ul>
            )}
        </ul>
    );
}
