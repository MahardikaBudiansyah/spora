import { Head, usePage, Link } from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import BannerSection from "@/components/common/BannerSection";
import { Card, CardHeader, CardBody } from "@/components/common/Card";
import BannerAlert from "@/components/common/BannerAlert";
import { CalendarCheck, IdCard, BellRing, Home } from "lucide-react";

export default function Dashboard({ auth, profileIncomplete, children }) {
    const { url } = usePage();

    const navItems = [
        {
            name: "Dashboard",
            href: route("user.dashboard.index"),
            icon: <Home className="w-4 h-4 mr-2" />,
            active: url === "/user/dashboard",
        },
        {
            name: "Daftar Membership",
            href: route("user.dashboard.memberships"),
            icon: <IdCard className="w-4 h-4 mr-2" />,
            active: url.startsWith("/user/dashboard/memberships"),
        },
        {
            name: "Daftar Booking",
            href: route("user.dashboard.bookings"),
            icon: <CalendarCheck className="w-4 h-4 mr-2" />,
            active: url.startsWith("/user/dashboard/bookings"),
        },
        {
            name: "Pemberitahuan",
            href: route("user.dashboard.notifications"),
            icon: <BellRing className="w-4 h-4 mr-2" />,
            active: url.startsWith("/user/dashboard/notifications"),
        },
    ];

    return (
        <UserLayout user={auth.user} footerType="bottom">
            <Head title="Dashboard User" />
            <BannerSection height="h-16" />

            <div className="px-4 py-8 max-w-screen-lg mx-auto rounded-lg text-sm">
                <Card className="flex flex-col h-full min-h-screen rounded-lg shadow-none dark:border-none">
                    <CardHeader className="px-8 pt-8 pb-0 border-none">
                        <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto no-scrollbar">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center py-3 px-6 border-b-2 transition-colors whitespace-nowrap ${
                                        item.active
                                            ? "border-primary-500 text-primary-600 font-bold"
                                            : "border-transparent text-gray-500 hover:text-gray-700"
                                    }`}
                                >
                                    {item.icon}
                                    {item.name}
                                </Link>
                            ))}
                        </div>

                        {profileIncomplete && (
                            <div className="mt-4">
                                <BannerAlert type="warning">
                                    Lengkapi data diri...
                                    <Link
                                        href={route("user.profile.edit")}
                                        className="ml-2 underline font-bold text-red-500"
                                    >
                                        Lengkapi Sekarang!
                                    </Link>
                                </BannerAlert>
                            </div>
                        )}
                    </CardHeader>

                    <CardBody className="px-8 pb-8 pt-6">{children}</CardBody>
                </Card>
            </div>
        </UserLayout>
    );
}
