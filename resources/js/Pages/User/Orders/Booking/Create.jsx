import React, { useEffect, useMemo } from "react";
import { Head, usePage } from "@inertiajs/react";
import { useCart } from "@/contexts/CartContext";
import { useUserBooking } from "@/features/orders/hooks/useUserBooking";
import UserLayout from "@/Layouts/UserLayout";
import UserPreviewBooking from "@/features/orders/components/summaries/UserPreviewBooking";
import UserOrderCustomerSummary from "@/features/orders/components/summaries/UserOrderCustomerSummary";
import UserPaymentTypeSelection from "@/features/orders/components/forms/UserPaymentTypeSelection";
import UserOrderBillingSummary from "@/features/orders/components/summaries/UserOrderBillingSummary";
import BookingPolicy from "@/features/orders/components/summaries/BookingPolicy";
import BannerSection from "@/components/common/BannerSection";
import Button from "@/components/Common/Button";

export default function Create() {
    const {
        user,
        membership: { data: membership } = { data: null },
        venue: { data: venue },
        carts: { data: carts },
        items: { data: items, pricing: pricing },
    } = usePage().props;

    const { fetchCarts, selectedSlots, toggleSlot, isReady } = useCart();

    const selectedItems = useMemo(() => {
        if (!isReady || !items) return [];

        return items
            .filter((item) => selectedSlots.includes(item.id || item.cart_id))
            .sort((a, b) => {
                const dateA = new Date(a.date || a.booking_date);
                const dateB = new Date(b.date || b.booking_date);
                return dateA - dateB;
            });
    }, [items, selectedSlots, isReady]);

    const {
        data,
        processing,
        isDpAvailable,
        grossAmount,
        handlePaymentTypeChange,
        submitPayment,
    } = useUserBooking(selectedItems, user, pricing, venue.id);

    const billingSummary = useMemo(() => {
        const details = pricing?.details || [];

        const enrichedItems = details.map((detail) => {
            const originalItem = items?.find(
                (i) => (i.id || i.cart_id) === detail.cart_id,
            );
            return {
                ...detail,
                start_time: detail.start_time || originalItem?.start_time,
                end_time: detail.end_time || originalItem?.end_time,
                court_name: detail.court_name || originalItem?.court_name,
            };
        });

        return {
            original_total: pricing?.total_original_price ?? 0,
            discount_amount: pricing?.total_discount ?? 0,
            final_total: pricing?.total_price ?? 0,
            policy: pricing?.payment_summary?.policy,
            items: enrichedItems,
        };
    }, [pricing, items]);

    const earliestDate = useMemo(() => {
        if (selectedItems.length === 0) return null;
        return selectedItems[0]?.date || selectedItems[0]?.booking_date;
    }, [selectedItems]);

    useEffect(() => {
        fetchCarts();
    }, []);

    if (!isReady) {
        return (
            <UserLayout>
                <div className="flex justify-center items-center h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-secondary-500">
                            Menyiapkan pesanan Anda...
                        </p>
                    </div>
                </div>
            </UserLayout>
        );
    }

    return (
        <UserLayout footerType="bottom">
            <Head title={`Checkout - ${venue.name}`} />
            <BannerSection height="h-16" />

            <div className="px-4 py-8 max-w-screen-lg mx-auto rounded-xl">
                <div className="pb-6 text-2xl font-bold">Checkout Booking</div>
                <div className="flex flex-col gap-6">
                    <div>
                        <UserOrderCustomerSummary
                            user={user}
                            membership={membership}
                        />
                    </div>
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="w-full md:w-1/2 flex flex-col gap-6">
                            <UserPreviewBooking
                                carts={carts}
                                venue={venue}
                                selectedSlots={selectedSlots}
                                toggleSlot={toggleSlot}
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
                                mode="booking"
                                allSlots={items}
                                selectedSlots={selectedSlots}
                                summary={billingSummary}
                                grossAmount={grossAmount}
                                selectedPaymentType={data.payment.type}
                                earliestDate={earliestDate}
                                membershipBenefit={membership?.data}
                            />

                            <BookingPolicy />

                            <div className="flex flex-col gap-2">
                                <Button
                                    variant="primary"
                                    size="xs"
                                    disabled={processing}
                                    onClick={submitPayment}
                                    className="flex py-3 justify-center"
                                >
                                    {processing
                                        ? "Memproses..."
                                        : "Lanjutkan Pembayaran"}
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
