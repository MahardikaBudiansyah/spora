import { useEffect, useCallback } from "react";
import { useForm, router } from "@inertiajs/react";
import { toast } from "react-toastify";
import debounce from "lodash/debounce";

export const useUserBooking = (selectedItems, user, pricing, venueId) => {
    const form = useForm({
        venue_id: venueId,
        customer: {
            name: user?.name || "",
            phone_number: user?.phone_number || "",
        },
        details: [],
        payment: {
            method: "gateway",
            type: pricing?.payment_summary?.selected_type || "full_payment",
            amount: 0,
            venue_payment_policy_id:
                pricing?.payment_summary?.policy?.id || null,
        },
    });

    const isDpAvailable = pricing?.payment_summary?.is_dp_available ?? false;
    const grossAmount = pricing?.payment_summary?.amount_to_pay_now ?? 0;

    const getEarliestDate = () => {
        if (selectedItems.length === 0) return null;
        const dates = selectedItems.map((i) =>
            new Date(i.booking_date || i.date).getTime(),
        );
        return new Date(Math.min(...dates)).toISOString().split("T")[0];
    };

    const refreshPricing = useCallback(
        debounce((items, payType) => {
            if (!venueId || items.length === 0) return;

            router.post(
                route("user.bookings.calculate"),
                {
                    venue_id: venueId,
                    payment_type: payType,
                    earliestDate: getEarliestDate(),
                    details: items.map((i) => ({
                        cart_id: i.cart_id,
                        court_id: i.court_id,
                        booking_date: i.booking_date || i.date,
                        original_price: i.original_price,
                    })),
                },
                { preserveState: true, preserveScroll: true },
            );
        }, 400),
        [venueId],
    );

    useEffect(() => {
        refreshPricing(selectedItems, form.data.payment.type);
    }, [JSON.stringify(selectedItems), form.data.payment.type]);

    useEffect(() => {
        if (!isDpAvailable && form.data.payment.type === "down_payment") {
            form.setData("payment", {
                ...form.data.payment,
                type: "full_payment",
            });
            toast.info(
                "Tipe pembayaran diubah ke Lunas karena DP tidak tersedia untuk jadwal ini.",
            );
        }
    }, [isDpAvailable]);

    const handlePaymentTypeChange = (type) => {
        form.setData("payment", { ...form.data.payment, type: type });
    };

    useEffect(() => {
        form.setData((prev) => {
            const newDetails = selectedItems.map((slot) => {
                const backendItem = pricing?.details?.find(
                    (i) => i.cart_id === (slot.id || slot.cart_id),
                );

                return {
                    cart_id: slot.cart_id || slot.id,
                    court_id: slot.court_id,
                    time_slot_id: slot.timeslot_id || slot.time_slot_id,
                    booking_date: slot.booking_date || slot.date,
                    original_price: slot.original_price,
                    price: backendItem
                        ? backendItem.final_price
                        : slot.original_price,
                    discount: backendItem ? backendItem.discount_amount : 0,
                };
            });

            return {
                ...prev,
                payment: {
                    ...prev.payment,
                    amount: grossAmount,
                    venue_payment_policy_id:
                        pricing?.payment_summary?.policy?.id || null,
                },
                details: newDetails,
            };
        });
    }, [grossAmount, pricing, selectedItems]);

    const submitPayment = (e) => {
        if (e) e.preventDefault();

        if (selectedItems.length === 0) {
            toast.warn("Silakan pilih setidaknya satu jadwal.");
            return;
        }

        console.log("📦 SUBMIT DATA:", form.data);

        form.post(route("user.bookings.store"), {
            preserveState: true,
            onFinish: (page) => {
                console.log("🏁 REQUEST FINISHED");
            },
            onSuccess: (page) => {
                const gatewayData = page.props.flash?.gateway_data;
                const orderType = page.props.flash?.order_type || "booking";

                if (!gatewayData) {
                    toast.error("Gagal mendapatkan data gateway.");
                    return;
                }

                if (gatewayData.snap_token) {
                    if (window.snap) {
                        window.snap.pay(gatewayData.snap_token, {
                            onSuccess: (result) => {
                                toast.success("Pembayaran berhasil!");
                                router.visit(
                                    route("user.payment.success", {
                                        type: orderType,
                                        orderId: result.order_id,
                                    }),
                                );
                            },
                            onPending: () => {
                                toast.info("Menunggu pembayaran.");
                                router.visit(route("user.dashboard.index"));
                            },
                            onError: () => toast.error("Pembayaran gagal."),
                            onClose: () =>
                                toast.info("Jendela pembayaran ditutup."),
                        });
                    } else {
                        toast.error("Midtrans belum siap.");
                    }
                    return;
                }

                if (gatewayData.redirect_url) {
                    window.location.href = gatewayData.redirect_url;
                    return;
                }
            },
            onError: (err) => {
                console.log("🔥 FULL BACKEND ERROR:", err);

                // tampilkan semua error ke console
                Object.keys(err).forEach((key) => {
                    console.log(`${key}:`, err[key]);
                });

                // tampilkan semua error ke toast juga (biar kelihatan di UI)
                const messages = Object.values(err).flat();

                if (messages.length > 0) {
                    messages.forEach((msg) => toast.error(msg));
                } else {
                    toast.error("Gagal membuat pesanan (unknown error)");
                }
            },
        });
    };

    return {
        data: form.data,
        setData: form.setData,
        errors: form.errors,
        processing: form.processing,
        isDpAvailable,
        grossAmount,
        handlePaymentTypeChange,
        submitPayment,
    };
};
