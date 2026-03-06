import React, { useEffect, useMemo } from "react";
import { Head, usePage } from "@inertiajs/react";
import { useUserMembershipOrder } from "@/features/orders/hooks/useUserMembershipOrder";
import UserLayout from "@/Layouts/UserLayout";
import UserPreviewMembershipPackage from "@/features/orders/components/summaries/UserPreviewMembershipPackage";
import UserOrderCustomerSummary from "@/features/orders/components/summaries/UserOrderCustomerSummary";
import UserPaymentTypeSelection from "@/features/orders/components/forms/UserPaymentTypeSelection";
import UserOrderBillingSummary from "@/features/orders/components/summaries/UserOrderBillingSummary";
import MembershipPolicy from "@/features/orders/components/summaries/MembershipPolicy";
import BannerSection from "@/components/common/BannerSection";
import Button from "@/components/Common/Button";

export default function Create() {
    const {
        user,
        membership: { data: membership } = { data: null },
        package: { data: membershipPackage } = { data: null },
        venue: { data: venue } = { data: {} },
        pricing,
    } = usePage().props;

    const {
        data,
        processing,
        isDpAvailable,
        grossAmount,
        handlePaymentTypeChange,
        submitPayment,
    } = useUserMembershipOrder(membershipPackage, user, pricing);

    const billingSummary = useMemo(() => {
        return {
            original_total: pricing?.subtotal ?? membershipPackage?.price ?? 0,
            discount_amount: pricing?.discount ?? 0,
            final_total: pricing?.total_price ?? pricing?.total ?? 0,
            policy: pricing?.payment_summary?.policy,
            items: [],
        };
    }, [pricing, membershipPackage]);

    return (
        <UserLayout footerType="bottom">
            <Head title={`Checkout - ${venue.name}`} />
            <BannerSection height="h-16" />

            <div className="px-4 py-8 max-w-screen-lg mx-auto rounded-xl">
                <div className="pb-6 text-2xl font-bold">
                    Checkout Langganan Membership
                </div>
                <div className="flex flex-col gap-6">
                    <div>
                        <UserOrderCustomerSummary
                            user={user}
                            membership={membership}
                        />
                    </div>
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="w-full md:w-1/2 flex flex-col gap-6">
                            <UserPreviewMembershipPackage
                                membershipPackage={membershipPackage}
                                venue={venue}
                                pricing={pricing}
                            />
                        </div>

                        <div className="w-full md:w-1/2 flex flex-col gap-6">
                            <UserPaymentTypeSelection
                                selectedPaymentType={data.payment.type}
                                setSelectedPaymentType={handlePaymentTypeChange}
                                isDpAvailable={isDpAvailable}
                                policy={pricing?.payment_summary?.policy}
                            />
                            <UserOrderBillingSummary
                                mode="membership"
                                allSlots={[]}
                                selectedSlots={[]}
                                summary={billingSummary}
                                grossAmount={grossAmount}
                                selectedPaymentType={data.payment.type}
                                earliestDate={null}
                                membershipBenefit={null}
                            />
                            <MembershipPolicy />

                            <div className="flex flex-col gap-2">
                                <Button
                                    variant="primary"
                                    size="xs"
                                    disabled={processing}
                                    onClick={submitPayment}
                                    className="flex py-3 justify-center"
                                >
                                    Lanjutkan Pembayaran
                                </Button>
                                <p className="px-2 text-left text-xs text-secondary-500 dark:text-secondary-400">
                                    Dengan menekan "Lanjutkan Pembayaran", Anda
                                    menyetujui syarat & ketentuan yang berlaku.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
