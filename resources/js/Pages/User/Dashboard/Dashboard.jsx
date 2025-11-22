import { useEffect } from "react";
import UserLayout from "@/Layouts/UserLayout";
import { Head } from "@inertiajs/react";
import BannerSection from "@/components/common/BannerSection";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
} from "@/components/common/Card";
import BannerAlert from "@/components/common/BannerAlert";
import Tabs from "@/components/Common/Tabs";

// Import konten tab
import Membership from "@/Pages/User/Dashboard/Partials/Membership";
import BookingHistory from "@/Pages/User/Dashboard/Partials/BookingHistory";
import MembershipHistory from "@/Pages/User/Dashboard/Partials/MembershipHistory";
import Notification from "@/Pages/User/Dashboard/Partials/Notification";
import Archieve from "@/Pages/User/Dashboard/Partials/Archieve";
import {
    CalendarCheck,
    IdCard,
    CreditCard,
    Bell,
    BellRing,
    Archive,
} from "lucide-react";
import ModernTabs from "@/components/Common/ModernTabs";
import Button from "@/components/Common/Button";

export default function Dashboard({
    auth,
    profileIncomplete,
    bookings,
    memberships,
    highlightOrder,
}) {
    useEffect(() => {
        if (highlightOrder) {
            const el = document.getElementById(`order-${highlightOrder}`);
            if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "start" });
                // Opsional: tambahkan highlight sementara
                el.classList.add("ring-4", "ring-yellow-400");
                setTimeout(
                    () => el.classList.remove("ring-4", "ring-yellow-400"),
                    3000
                );
            }
        }
    }, [highlightOrder]);

    const tabs = [
        {
            id: "membrshipUser",
            label: (
                <span className="flex items-center">
                    <IdCard className="w-4 h-4 mr-2" />
                    Daftar Membership
                </span>
            ),
            content: <Membership />,
        },
        {
            id: "order",
            label: (
                <span className="flex items-center">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Order (Pesanan)
                </span>
            ),
            content: (
                <div className="flex flex-row gap-4 items-center">
                    <div className="py-3 px-6 w-65 flex flex-row gap-3 items-center border rounded-lg shadow-sm">
                        <div>
                            <BellRing className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                            <div className="font-bold text-md">
                                Riwayat Booking
                            </div>
                            <span className="text-xs text-secondary-600">
                                Riwayat pesanan Booking
                            </span>
                        </div>
                    </div>
                    <div className="py-3 px-6 w-65 flex flex-row gap-3 items-center border rounded-lg shadow-sm">
                        <div>
                            <BellRing className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                            <div className="font-bold text-md">
                                Riwayat Membership
                            </div>
                            <span className="text-xs text-secondary-600">
                                Riwayat pesanan Membership
                            </span>
                        </div>
                    </div>
                    {/* <Button variant="primary">Notifikasi Aktif</Button>
                    <Button variant="primary">Arsip</Button> */}
                </div>
            ),
            // children: [
            //     {
            //         id: "bookings",
            //         label: (
            //             <span className="flex items-center">
            //                 <CalendarCheck className="w-4 h-4 mr-2" />
            //                 Booking Lapangan
            //             </span>
            //         ),
            //         content: (
            //             <BookingHistory
            //                 bookings={bookings.data}
            //                 pagination={bookings.links}
            //                 meta={bookings.meta}
            //             />
            //         ),
            //     },
            //     {
            //         id: "memberships",
            //         label: (
            //             <span className="flex items-center">
            //                 <CreditCard className="w-4 h-4 mr-2" />
            //                 Order Membership
            //             </span>
            //         ),
            //         content: (
            //             <MembershipHistory
            //                 memberships={memberships.data}
            //                 pagination={memberships.links}
            //                 meta={memberships.meta}
            //             />
            //         ),
            //     },
            // ],
        },
        {
            id: "order",
            label: (
                <span className="flex items-center">
                    <Bell className="w-4 h-4 mr-2" />
                    Pemberitahuan
                </span>
            ),
            content: (
                <div className="flex flex-row gap-4 items-center">
                    <div className="py-3 px-6 w-65 flex flex-row gap-3 items-center border rounded-lg shadow-sm">
                        <div>
                            <BellRing className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                            <div className="font-bold text-md">
                                Notifikasi Aktif
                            </div>
                            <span className="text-xs text-secondary-600">
                                Daftar Notifikasi Aktif
                            </span>
                        </div>
                    </div>
                    <div className="py-3 px-6 w-65 flex flex-row gap-3 items-center border rounded-lg shadow-sm">
                        <div>
                            <BellRing className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                            <div className="font-bold text-md">Arsip</div>
                            <span className="text-xs text-secondary-600">
                                Daftar Arsip Notifikasi
                            </span>
                        </div>
                    </div>
                    {/* <Button variant="primary">Notifikasi Aktif</Button>
                    <Button variant="primary">Arsip</Button> */}
                </div>
            ),

            // children: [
            //     {
            //         id: "notifications",
            //         label: (
            //             <span className="flex items-center">
            //                 <BellRing className="w-4 h-4 mr-2" />
            //                 Notifikasi Aktif
            //             </span>
            //         ),
            //         content: <Notification />,
            //     },
            //     {
            //         id: "archieves",
            //         label: (
            //             <span className="flex items-center">
            //                 <Archive className="w-4 h-4 mr-2" />
            //                 Arsip
            //             </span>
            //         ),
            //         content: <Archieve />,
            //     },
            // ],
        },
    ];

    return (
        <UserLayout user={auth.user} footerType="bottom">
            <Head title="Dashboard User" />
            <BannerSection height="h-16" />

            <div className="px-4 py-8 max-w-screen-lg mx-auto rounded-lg text-sm">
                <Card className="flex flex-col h-full min-h-screen rounded-lg shadow-none dark:border-none">
                    <CardHeader className="px-8 pt-8 pb-4 border-none">
                        <div className="text-xl font-bold dark:text-white">
                            Dashboard
                        </div>
                        {profileIncomplete && (
                            <BannerAlert type="warning">
                                Lengkapi data diri terlebih dahulu untuk
                                mengakses semua fitur dashboard.
                                <a
                                    href={route("user.profile.edit")}
                                    className="ml-2 underline font-bold text-red-500 hover:text-red-600"
                                >
                                    Lengkapi Sekarang!
                                </a>
                            </BannerAlert>
                        )}
                    </CardHeader>

                    <CardBody className="px-8 pb-8">
                        <Tabs
                            tabs={tabs}
                            defaultActive={0}
                            orientation="horizontal"
                            className="text-sm"
                        />
                    </CardBody>
                    <CardFooter>
                        {/* <ModernTabs
                            tabs={tabs}
                            defaultActive={0}
                            orientation="horizontal"
                            className="text-sm"
                        /> */}
                    </CardFooter>
                </Card>
            </div>
        </UserLayout>
    );
}
