import React from "react";
import { Head, usePage } from "@inertiajs/react";
import axios from "axios";
import UserLayout from "@/Layouts/UserLayout";
import BannerSection from "@/components/common/BannerSection";
import Button from "@/components/Common/Button";
import PreviewMembership from "@/Pages/User/Membership/Partials/PreviewMembership";
import CustomerData from "@/Pages/User/Membership/Partials/CustomerData";
import SummaryPayment from "@/Pages/User/Membership/Partials/SummaryPayment";
import MembershipPolicy from "@/Pages/User/Membership/Partials/MembershipPolicy";
import { toast } from "react-toastify";

export default function Create() {
    const { user, package: membershipPackage } = usePage().props;

    const handlePayment = async () => {
        const payload = {
            membership_package_id: membershipPackage.id,
            venue_id: membershipPackage.venue_id,
            start_date: new Date().toISOString().split("T")[0], // hari ini
        };

        console.log("=== MEMBERSHIP PAYLOAD ===");
        console.log(JSON.stringify(payload, null, 2));

        try {
            const response = await axios.post(
                route("user.memberships.store"),
                payload
            );

            if (response.data.success) {
                const { snap_token } = response.data;
                if (window.snap && snap_token) {
                    window.snap.pay(snap_token, {
                        onSuccess: (result) => {
                            window.location.href = route(
                                "user.payment.success",
                                {
                                    type: "membership",
                                    orderId: result.order_id,
                                }
                            );
                        },
                        onError: (result) => {
                            window.location.href = route("user.payment.failed");
                        },
                        onClose: (result) => {
                            window.location.href = route("user.dashboard", {
                                highlightOrder: result.order_id,
                            });
                        },
                    });
                }
            }
        } catch (error) {
            console.error("Payment error:", error);
            if (error.response?.status === 422) {
                console.log("Validation errors:", error.response.data.errors);
            }
            toast.error("Terjadi kesalahan saat membuat langganan membership.");
        }
    };

    return (
        <UserLayout footerType="bottom">
            <Head title="Langganan Membership" />
            <BannerSection height="h-16" />

            <div className="px-4 py-8 max-w-screen-lg mx-auto rounded-xl">
                <div className="pb-4 text-2xl font-bold">
                    Langganan Membership Venue
                </div>
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Kiri */}
                    <div className="w-full md:w-1/2 flex flex-col gap-4">
                        <PreviewMembership
                            membershipPackage={membershipPackage}
                        />
                    </div>

                    {/* Kanan */}
                    <div className="w-full md:w-1/2 flex flex-col gap-4">
                        <CustomerData user={user} />
                        <SummaryPayment membershipPackage={membershipPackage} />
                        <MembershipPolicy />
                        <Button
                            variant="primary"
                            className="flex py-3"
                            onClick={handlePayment}
                        >
                            Lanjutkan Pembayaran
                        </Button>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
