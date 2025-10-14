import React, { useState, useEffect, useMemo } from "react";
import { Head, usePage } from "@inertiajs/react";
import axios from "axios";
import UserLayout from "@/Layouts/UserLayout";
import { useCart } from "@/contexts/CartContext";
import BannerSection from "@/components/common/BannerSection";
import Button from "@/components/Common/Button";

import PreviewBooking from "@/Pages/User/Booking/Partials/PreviewBooking";
import CustomerData from "@/Pages/User/Booking/Partials/CustomerData";
import PaymentType from "@/Pages/User/Booking/Partials/PaymentType";
import SummaryPayment from "@/Pages/User/Booking/Partials/SummaryPayment";
import BookingPolicy from "@/Pages/User/Booking/Partials/BookingPolicy";
import { toast } from "react-toastify";

export default function Create() {
    const { user, carts, items, activeMembership } = usePage().props;

    const { fetchCarts, selectedSlots, toggleSlot } = useCart();
    const [showSewa, setShowSewa] = useState(false);
    const allSlots = useMemo(() => items, [items]);
    const [selectedPaymentType, setSelectedPaymentType] = useState(null);

    // --- Slot yang dipilih user (sinkron dengan CartContext) ---
    const selectedItems = allSlots.filter((slot) =>
        selectedSlots.includes(slot.cart_id)
    );

    const [isDpAvailable, setIsDpAvailable] = useState(true);

    useEffect(() => {
        if (selectedItems.length === 0) return;

        const earliestSlot = selectedItems.reduce((min, slot) =>
            new Date(slot.booking_date) < new Date(min.booking_date)
                ? slot
                : min
        );
        const activeDPSetting = getActiveDPSetting(earliestSlot);

        if (!activeDPSetting) {
            setIsDpAvailable(false);
            return;
        }

        const earliestDate = new Date(earliestSlot.booking_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        earliestDate.setHours(0, 0, 0, 0);

        const daysBeforePlay = Math.floor(
            (earliestDate - today) / (1000 * 60 * 60 * 24)
        );

        const minDaysRequired = activeDPSetting.full_payment_days_before ?? 1;

        if (daysBeforePlay <= minDaysRequired) {
            // DP tidak bisa digunakan
            setIsDpAvailable(false);

            if (selectedPaymentType === "down_payment") {
                setSelectedPaymentType("full_payment");
                toast.info(
                    `DP tidak tersedia karena booking terlalu dekat (${daysBeforePlay} hari lagi). Otomatis diubah ke Full Payment.`
                );
            }
            return;
        }

        setIsDpAvailable(true);
    }, [selectedItems, selectedPaymentType]);

    // Ambil tanggal main paling awal dari slot yang dipilih
    const earliestDate = useMemo(() => {
        if (selectedItems.length === 0) return null;
        return selectedItems
            .map((slot) => new Date(slot.booking_date))
            .sort((a, b) => a - b)[0];
    }, [selectedItems]);

    useEffect(() => {
        fetchCarts();
    }, []);

    // --- Hitung summary berdasarkan slot yang dipilih ---
    const selectedSummary = {
        original_total: selectedItems.reduce(
            (sum, i) => sum + i.original_price,
            0
        ),
        discount_amount: selectedItems.reduce(
            (sum, i) => sum + i.discount_amount,
            0
        ),
        final_total: selectedItems.reduce((sum, i) => sum + i.final_price, 0),
    };

    const filteredSlotsByDate = useMemo(() => {
        return allSlots
            .filter((slot) => selectedSlots.includes(slot.cart_id))
            .reduce((acc, slot) => {
                if (!acc[slot.booking_date]) acc[slot.booking_date] = [];
                acc[slot.booking_date].push(slot);
                return acc;
            }, {});
    }, [allSlots, selectedSlots]);

    useEffect(() => {
        if (!selectedPaymentType && carts.length > 0) {
            const paymentSettings = carts[0]?.paymentType
                ? Array.isArray(carts[0].paymentType)
                    ? carts[0].paymentType
                    : [carts[0].paymentType]
                : [];

            const activeSetting = paymentSettings.find((pt) => pt.is_active);
            if (activeSetting) {
                setSelectedPaymentType("full_payment"); // set default ke full_payment
            }
        }
    }, [carts, selectedPaymentType]);

    const getActiveDPSetting = (slot) => {
        if (!slot?.paymentType) return null;
        return slot.paymentType.is_active && slot.paymentType.enable_dp
            ? slot.paymentType
            : null;
    };

    const grossAmount = useMemo(() => {
        if (!selectedPaymentType || selectedItems.length === 0) return 0;

        const totalAfterDiscount = selectedItems.reduce(
            (total, slot) => total + slot.final_price,
            0
        );

        if (selectedPaymentType === "down_payment") {
            const dpSetting = getActiveDPSetting(selectedItems[0]);
            if (!dpSetting) return 0;

            const dpValue = dpSetting.dp_value ?? 0;
            const dpType = dpSetting.dp_type ?? "fixed";

            const dpAmount =
                dpType === "percentage"
                    ? (totalAfterDiscount * dpValue) / 100
                    : Number(dpValue);

            return dpAmount;
        }

        return totalAfterDiscount; // full payment
    }, [selectedPaymentType, selectedItems]);

    const handlePayment = async (paymentType) => {
        const payload = {
            customer: {
                name: user.name,
                phone_number: user.phone_number,
            },
            details: selectedItems.map((slot) => ({
                field_id: slot.field_id,
                time_slot_id: slot.timeslot_id,
                original_price: slot.original_price,
                price: Number(slot.final_price), // pastikan number
                booking_date: slot.booking_date,
                venue_id: slot.venue_id,
                cart_id: slot.cart_id,
            })),
            payment: {
                method: "gateway",
                type: paymentType, // "dp" atau "full"
                amount: grossAmount,
                venue_payment_type_id: carts[0]?.paymentType?.find(
                    (pt) => pt.is_active
                )?.id,
            },
        };

        try {
            const response = await axios.post(
                route("user.booking.store"),
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
                                    type: "booking",
                                    orderId: result.order_id,
                                }
                            );
                        },
                        onError: (result) => {
                            window.location.href = route("user.payment.failed");
                        },
                        onClose: () => {
                            window.location.href = route("user.dashboard");
                        },
                    });
                }
            }
        } catch (error) {
            console.error("Payment error:", error);
            if (error.response?.status === 422) {
                console.log("Validation errors:", error.response.data.errors);
            }
            toast.error("Terjadi kesalahan saat membuat booking.");
        }
    };

    return (
        <UserLayout footerType="bottom">
            <Head title="Booking" />
            <BannerSection height="h-16" />

            <div className="px-4 py-8 max-w-screen-lg mx-auto rounded-xl">
                <div className="pb-4 text-2xl font-bold">Booking Lapangan</div>
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Kiri */}
                    <div className="w-full md:w-1/2 flex flex-col gap-4">
                        <PreviewBooking
                            carts={carts}
                            allSlots={allSlots}
                            filteredSlotsByDate={filteredSlotsByDate}
                            toggleSlot={toggleSlot}
                        />
                    </div>

                    {/* Kanan */}
                    <div className="w-full md:w-1/2 flex flex-col gap-4">
                        <CustomerData user={user} />
                        <PaymentType
                            selectedPaymentType={selectedPaymentType}
                            setSelectedPaymentType={setSelectedPaymentType}
                            selectedItems={selectedItems}
                            isDpAvailable={isDpAvailable}
                        />
                        <SummaryPayment
                            allSlots={allSlots}
                            selectedSlots={selectedSlots}
                            summary={selectedSummary}
                            grossAmount={grossAmount}
                            selectedPaymentType={selectedPaymentType}
                            showSewa={showSewa}
                            setShowSewa={setShowSewa}
                            earliestDate={earliestDate}
                        />
                        <BookingPolicy />
                        <Button
                            variant="primary"
                            className="flex py-3"
                            disabled={selectedItems.length === 0}
                            onClick={() => handlePayment(selectedPaymentType)}
                        >
                            Lanjutkan Pembayaran
                        </Button>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
