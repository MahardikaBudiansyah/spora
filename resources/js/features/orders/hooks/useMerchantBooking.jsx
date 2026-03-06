import { useState, useEffect, useMemo } from "react";
import { useForm } from "@inertiajs/react";
import { toast } from "react-toastify";

export const useMerchantBooking = (
    initialVenues = [],
    scope = "merchant",
    initialData = {},
) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [stepErrors, setStepErrors] = useState({});

    const isMerchantScope = Array.isArray(initialVenues);

    const form = useForm({
        venue_id: isMerchantScope ? null : initialVenues?.id,
        venue_name: isMerchantScope ? "" : initialVenues?.name,
        venue_slug: isMerchantScope ? "" : initialVenues?.slug,

        bookingSelections: [],

        customer_id: null,
        customer_name: "",
        customer_email: "",
        customer_phone: "",

        member_no: null,
        active_until: null,
        active_until_label: null,
        last_package: null,
        membership_benefit: null,
        last_booking: null,

        payment_type: "",
        payment_method: "",
        payment_date: null,
        bank: "",
        digital_wallet: "",
        reference_no: "",
        payer_name: "",
        amount: 0,
        total_price: 0,
        proof_of_payment: null,

        operator_assignment_id: null,
        ...initialData,
    });

    const selectedVenue = useMemo(() => {
        if (Array.isArray(initialVenues)) {
            return (
                initialVenues.find((v) => v.id === form.data.venue_id) || null
            );
        }
        return initialVenues;
    }, [form.data.venue_id, initialVenues]);

    useEffect(() => {
        if (
            isMerchantScope &&
            initialVenues.length === 1 &&
            !form.data.venue_id
        ) {
            const v = initialVenues[0];
            form.setData((prev) => ({
                ...prev,
                venue_id: v.id,
                venue_name: v.name,
                venue_slug: v.slug,
            }));
        }
    }, [initialVenues, isMerchantScope]);

    const handleVenueChange = (venueId, venueOptions = []) => {
        const selected = venueOptions.find((v) => v.value === venueId);

        form.setData((prev) => ({
            ...prev,
            venue_id: venueId,
            venue_name: selected?.label || "",
            venue_slug: selected?.slug || "",

            bookingSelections: [],
            payment_type: "",
            payment_method: "",
            payment_date: null,
            bank: "",
            digital_wallet: "",
            reference_no: "",
            payer_name: "",
            amount: 0,
            total_price: 0,
            proof_of_payment: null,

            customer_id: null,
            customer_name: "",
            customer_email: "",
            customer_phone: "",

            member_no: null,
            active_until: null,
            active_until_label: null,
            last_package: null,
            membership_benefit: null,
            last_booking: null,
        }));
    };

    const num = (v) => Number(v ?? 0);

    const calculation = useMemo(() => {
        let gross = 0;
        let discount = 0;
        let details = [];

        const benefit = form.data.membership_benefit;

        const today = new Date().toISOString().split("T")[0];
        const isStarted = benefit?.start_date
            ? today >= benefit.start_date
            : true;
        const isNotExpired = benefit?.end_date
            ? today <= benefit.end_date
            : true;
        const isMembershipValid = isStarted && isNotExpired;

        let quotaLeft = num(benefit?.remaining_quota);
        const discValue = num(benefit?.discount_value);
        const discType = benefit?.discount_type;

        (form.data.bookingSelections || []).forEach((dateGroup) => {
            const bookingDate = dateGroup.date;
            (dateGroup.courts || []).forEach((court) => {
                const courtName = court.court_name;
                const courtId = court.court_id;

                (court.slots || []).forEach((slot) => {
                    const originalPrice = num(slot.price);
                    let discountAmount = 0;

                    if (isMembershipValid && quotaLeft > 0 && discValue > 0) {
                        if (discType === "percentage") {
                            discountAmount = (originalPrice * discValue) / 100;
                        } else if (discType === "fixed") {
                            discountAmount = discValue;
                        }
                        discountAmount = Math.min(
                            discountAmount,
                            originalPrice,
                        );
                        quotaLeft -= 1;
                    } else {
                        discountAmount = 0;
                    }

                    const finalPrice = originalPrice - discountAmount;

                    details.push({
                        court_name: courtName,
                        court_id: courtId,
                        time_range: `${slot.start_time.substring(0, 5)} - ${slot.end_time.substring(0, 5)}`,
                        booking_date: bookingDate,
                        original_price: originalPrice,
                        discount_amount: discountAmount,
                        final_price: finalPrice,
                        time_slot_id: slot.timeslot_id,
                    });

                    gross += originalPrice;
                    discount += discountAmount;
                });
            });
        });

        return {
            total_original_price: gross,
            total_discount: discount,
            total_price: Math.max(0, gross - discount),
            calculated_remaining_quota: quotaLeft,
            booking_details: details,
        };
    }, [form.data.bookingSelections, form.data.membership_benefit]);

    const totalPrice = calculation.total_price;

    useEffect(() => {
        form.setData((prev) => ({
            ...prev,
            total_original_price: calculation.total_original_price,
            total_discount: calculation.total_discount,
            total_price: calculation.total_price,
        }));
    }, [totalPrice]);

    const activePolicy = useMemo(() => {
        if (
            !selectedVenue?.payment_policies ||
            !Array.isArray(selectedVenue.payment_policies)
        ) {
            return null;
        }

        const policy = selectedVenue.payment_policies.find(
            (p) => p.order_type === "booking",
        );

        return policy;
    }, [selectedVenue]);

    const calculateInitialAmount = (total, policy, type) => {
        if (type === "down_payment" && policy?.enable_dp) {
            return policy.dp_type === "percentage"
                ? (total * policy.dp_value) / 100
                : policy.dp_value;
        }
        return total;
    };

    const minAmountRequired = useMemo(() => {
        if (
            form.data.payment_type === "down_payment" &&
            activePolicy?.enable_dp
        ) {
            return activePolicy.dp_type === "percentage"
                ? (totalPrice * activePolicy.dp_value) / 100
                : Number(activePolicy.dp_value);
        }
        return totalPrice;
    }, [totalPrice, activePolicy, form.data.payment_type]);

    useEffect(() => {
        if (totalPrice > 0 && activePolicy) {
            if (!form.data.payment_type) {
                const defaultType = activePolicy.enable_dp
                    ? "down_payment"
                    : "full_payment";
                const initialAmount = calculateInitialAmount(
                    totalPrice,
                    activePolicy,
                    defaultType,
                );

                form.setData((prev) => ({
                    ...prev,
                    payment_type: defaultType,
                    amount: initialAmount,
                }));
            } else {
                const newAmount = calculateInitialAmount(
                    totalPrice,
                    activePolicy,
                    form.data.payment_type,
                );
                if (Number(form.data.amount) !== newAmount) {
                    form.setData("amount", newAmount);
                }
            }
        }
    }, [totalPrice, form.data.payment_type, activePolicy]);

    const displayData = useMemo(() => {
        return {
            original: calculation.total_original_price,
            discount: calculation.total_discount,
            final: calculation.total_price,
            details: calculation.booking_details || [],
        };
    }, [calculation]);

    const handleStepChange = (update) => {
        if (typeof update === "function") {
            form.setData(update);
        } else {
            form.setData((prev) => ({ ...prev, ...update }));
        }
    };

    const handleNext = () => {
        const data = form.data;
        let errorsFound = {};

        if (currentStep === 0) {
            if (data.bookingSelections.length === 0) {
                return toast.warning("Pilih minimal 1 jadwal lapangan!");
            }
        }

        if (currentStep === 1) {
            if (!data.customer_name || !data.customer_phone) {
                return toast.warning("Nama dan Nomor Handphone wajib diisi!");
            }
        }

        if (currentStep === 2) {
            const numericAmount = Number(
                String(data.amount || "0").replace(/[^0-9.-]+/g, ""),
            );
            const numericTotal = totalPrice;

            if (!data.payment_method) {
                toast.warning("Pilih metode pembayaran!");
                errorsFound[2] = true;
            } else if (numericAmount <= 0) {
                toast.warning("Masukkan jumlah pembayaran!");
                errorsFound[2] = true;
            } else if (numericAmount < minAmountRequired) {
                const label =
                    data.payment_type === "down_payment"
                        ? "DP minimal"
                        : "pembayaran minimal";
                toast.error(
                    `Jumlah ${label} adalah ${formatRupiah(minAmountRequired)}`,
                );
                errorsFound[2] = true;
            } else if (numericAmount > numericTotal) {
                toast.warning("Jumlah pembayaran melebihi total harga!");
                errorsFound[2] = true;
            } else if (
                data.payment_method !== "cash" &&
                !data.proof_of_payment
            ) {
                toast.warning("Harap unggah bukti pembayaran!");
                errorsFound[2] = true;
            }
        }

        if (Object.keys(errorsFound).length > 0) {
            setStepErrors(errorsFound);
        } else {
            setStepErrors({});
            setCurrentStep((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) setCurrentStep((prev) => prev - 1);
    };

    const submit = (e) => {
        if (e && e.preventDefault) e.preventDefault();
        if (form.processing) return;

        const routeName =
            scope === "merchant"
                ? "merchant.bookings.store"
                : "merchant.venues.bookings.store";

        const routeParams =
            scope === "merchant"
                ? {}
                : { venue: form.data.venue_slug || initialVenues?.slug };

        form.transform((oldData) => ({
            ...oldData,
            details: calculation.booking_details.map((item) => ({
                court_id: item.court_id,
                time_slot_id: item.time_slot_id,
                booking_date: item.booking_date,
                original_price: item.original_price,
                discount_amount: item.discount_amount,
                final_price: item.final_price,
                court_name: item.court_name,
                time_range: item.time_range,
            })),
            amount: String(oldData.amount || "0").replace(/[^0-9.-]+/g, ""),
            proof_of_payment: Array.isArray(oldData.proof_of_payment)
                ? oldData.proof_of_payment[0]?.file ||
                  oldData.proof_of_payment[0]
                : oldData.proof_of_payment,
        }));

        form.post(route(routeName, routeParams), {
            forceFormData: true,
            onSuccess: () => {
                toast.success("Booking Berhasil Dibuat!");
            },
            onError: (errors) => {
                console.error("Validation Errors:", errors);
                toast.error("Gagal membuat booking. Cek kembali inputan anda.");
            },
        });
    };

    return {
        form,
        currentStep,
        setCurrentStep,
        stepErrors,
        handleNext,
        handleBack,
        selectedVenue,
        handleVenueChange,
        totalPrice,
        calculation,
        activePolicy,
        minAmountRequired,
        remainingAmount: Math.max(
            0,
            totalPrice - Number(form.data.amount || 0),
        ),
        displayData,
        handleStepChange,
        submit,
    };
};
