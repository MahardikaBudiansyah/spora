import { useEffect, useCallback } from "react";
import { useForm, router } from "@inertiajs/react";
import { toast } from "react-toastify";
import debounce from "lodash/debounce";

export const useUserMembershipOrder = (packageData, user, pricing) => {
    console.log("LOG 1 [Props Hook]:", { packageData, user, pricing });

    const form = useForm({
        name: user?.name || "",
        phone_number: user?.phone_number || "",
        email: user?.email || "",
        venue_id: packageData?.venue_id || "",
        package_id: packageData?.id || "",
        qty: 1,
        payment: {
            method: "gateway",
            type: pricing?.payment_summary?.selected_type || "full_payment",
            amount: pricing?.total || packageData?.price || 0,
            venue_payment_policy_id:
                pricing?.payment_summary?.policy?.id || null,
        },
    });

    useEffect(() => {
        console.log("LOG 2 [Form Data State]:", form.data);
    }, [form.data]);

    useEffect(() => {
        if (packageData?.venue_id) {
            console.log(
                "LOG 3 [Sync Effect]: Data masuk, mengupdate form...",
                packageData.venue_id,
            );
            form.setData((prev) => ({
                ...prev,
                venue_id: packageData.venue_id,
                package_id: packageData.id,
            }));
        }
    }, [packageData]);

    const grossAmount = pricing?.total ?? packageData?.price ?? 0;

    const refreshPricing = useCallback(
        debounce((pkgId, payType) => {
            if (!pkgId) return;

            router.post(
                route("user.memberships.calculate"),
                {
                    package_id: pkgId,
                    payment_type: payType,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                },
            );
        }, 400),
        [],
    );

    useEffect(() => {
        refreshPricing(packageData?.id, form.data.payment.type);
    }, [packageData?.id, form.data.payment.type]);

    const handlePaymentTypeChange = (type) => {
        form.setData("payment", { ...form.data.payment, type: type });
    };

    useEffect(() => {
        if (form.data.payment.amount !== grossAmount) {
            form.setData((prev) => ({
                ...prev,
                payment: {
                    ...prev.payment,
                    amount: grossAmount,
                    venue_payment_policy_id:
                        pricing?.payment_summary?.policy?.id || null,
                },
            }));
        }
    }, [grossAmount, pricing]);

    const submitPayment = (e) => {
        if (e) e.preventDefault();

        if (!form.data.name || !form.data.phone_number) {
            toast.warn("Silakan lengkapi data profil Anda.");
            return;
        }

        form.post(route("user.memberships.store"), {
            onSuccess: (page) => {
                const gatewayData = page.props.flash?.gateway_data;
                const orderType = page.props.flash?.order_type || "membership";

                if (!gatewayData) {
                    toast.error("Data pembayaran tidak ditemukan.");
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

                toast.error("Metode pembayaran tidak dikenali.");
            },
            onError: (err) => {
                const firstError = Object.values(err)[0];
                toast.error(firstError || "Gagal membuat pesanan.");
            },
        });
    };

    return {
        data: form.data,
        setData: form.setData,
        errors: form.errors,
        processing: form.processing,
        grossAmount,
        handlePaymentTypeChange,
        submitPayment,
    };
};
