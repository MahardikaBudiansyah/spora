import { useEffect } from "react";
import UserLayout from "@/Layouts/UserLayout";
import { Head } from "@inertiajs/react";
import BannerSection from "@/components/common/BannerSection";
import { Card, CardHeader, CardBody } from "@/components/common/Card";
import BannerAlert from "@/components/common/BannerAlert";
import Tabs from "@/components/Common/Tabs";

// Import konten tab
import BookingHistory from "@/Pages/User/Dashboard/Partials/BookingHistory";
import MembershipHistory from "@/Pages/User/Dashboard/Partials/MembershipHistory";
import { CalendarCheck, IdCard, CreditCard } from "lucide-react";
import { Children } from "react";

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
            content: (
                <div className="text-gray-500">
                    Fitur daftar membership akan hadir di sini.
                </div>
            ),
        },
        {
            id: "order",
            label: (
                <span className="flex items-center">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Order (Pesanan)
                </span>
            ),
            children: [
                {
                    id: "bookings",
                    label: (
                        <span className="flex items-center">
                            <CalendarCheck className="w-4 h-4 mr-2" />
                            Booking Lapangan
                        </span>
                    ),
                    content: (
                        <BookingHistory
                            bookings={bookings.data}
                            pagination={bookings.links}
                            meta={bookings.meta}
                        />
                    ),
                },
                {
                    id: "memberships",
                    label: (
                        <span className="flex items-center">
                            <CreditCard className="w-4 h-4 mr-2" />
                            Order Membership
                        </span>
                    ),
                    content: (
                        <MembershipHistory
                            memberships={memberships.data}
                            pagination={memberships.links}
                            meta={memberships.meta}
                        />
                    ),
                },
            ],
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
                            orientation="vertical"
                            className="text-sm"
                        />
                    </CardBody>
                </Card>
            </div>
        </UserLayout>
    );
}
