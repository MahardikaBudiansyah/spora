import { useState, useEffect, useMemo } from "react";
import { useForm } from "@inertiajs/react";
import { useVenueMembershipPackageAvailability } from "./useVenueMembershipPackageAvailability";
import { toast } from "react-toastify";
import { parseDate } from "@/utils/date";

export const useMerchantMembershipOrder = (
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

        membership_package_id: null,
        package: null,
        start_date: null,
        duration: null,
        price: null,
        end_date: null,

        customer_id: null,
        customer_name: "",
        customer_email: "",
        customer_phone: "",

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

    const { packages: availablePackages, loading: loadingPackages } =
        useVenueMembershipPackageAvailability(form.data.venue_id);

    const selectedVenue = useMemo(() => {
        if (isMerchantScope) {
            return (
                initialVenues.find((v) => v.id === form.data.venue_id) || null
            );
        }
        return initialVenues;
    }, [form.data.venue_id, initialVenues, isMerchantScope]);

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
        const option = venueOptions.find((v) => v.value === venueId);

        form.setData((prev) => ({
            ...prev,
            venue_id: venueId,
            venue_name: option?.label || "",

            membership_package_id: null,
            package: null,
            end_date: null,
            price: null,
            total_price: 0,

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
            amount: 0,
        }));
    };

    const handlePackageSelect = (pkg) => {
        const duration = pkg?.duration_months ?? 0;
        const startDate =
            form.data.start_date || new Date().toISOString().split("T")[0];
        const endDate = calculateEndDate(startDate, duration);

        form.setData((prev) => ({
            ...prev,
            membership_package_id: pkg.id,
            price: pkg.price,
            duration: duration,
            package: pkg,
            start_date: startDate,
            end_date: endDate,
        }));
    };

    const handleDateChange = (date) => {
        const dt = parseDate(date);
        if (!dt || !dt.isValid) return;
        const startDateISO = dt.toISODate();
        form.setData("start_date", startDateISO);
        if (form.data.duration) {
            form.setData(
                "end_date",
                calculateEndDate(startDateISO, form.data.duration),
            );
        }
    };

    const calculateEndDate = (startDate, durationMonths) => {
        const dt = parseDate(startDate);
        if (!dt || !dt.isValid || !durationMonths) return null;
        return dt
            .plus({ months: Number(durationMonths) })
            .minus({ days: 1 })
            .toISODate();
    };

    const activeUntilDate = form.data.active_until
        ? new Date(form.data.active_until)
        : null;
    const newStartDate = form.data.start_date
        ? new Date(form.data.start_date)
        : null;

    const isDateConflict = !!(
        activeUntilDate &&
        newStartDate &&
        newStartDate <= activeUntilDate
    );

    const isIdentityConflict =
        form.data.customer_phone &&
        !form.data.customer_email &&
        form.data.customer_id === null;

    const activePolicy = useMemo(() => {
        const policies =
            selectedVenue?.payment_policies || selectedVenue?.paymentPolicies;
        if (!Array.isArray(policies)) return null;

        return policies.find((p) => p.order_type === "membership") || null;
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
        const price = Number(form.data.price || 0);
        if (
            form.data.payment_type === "down_payment" &&
            activePolicy?.enable_dp
        ) {
            return activePolicy.dp_type === "percentage"
                ? (price * activePolicy.dp_value) / 100
                : Number(activePolicy.dp_value);
        }
        return price;
    }, [form.data.price, activePolicy, form.data.payment_type]);

    useEffect(() => {
        const price = Number(form.data.price || 0);
        if (price > 0 && activePolicy) {
            if (!form.data.payment_type) {
                const defaultType = activePolicy.enable_dp
                    ? "down_payment"
                    : "full_payment";
                const initialAmount = calculateInitialAmount(
                    price,
                    activePolicy,
                    defaultType,
                );

                form.setData((prev) => ({
                    ...prev,
                    payment_type: defaultType,
                    amount: initialAmount,
                    total_price: price,
                }));
            } else {
                const newAmount = calculateInitialAmount(
                    price,
                    activePolicy,
                    form.data.payment_type,
                );
                if (Number(form.data.amount) !== newAmount) {
                    form.setData("amount", newAmount);
                }
            }
        }
    }, [form.data.price, form.data.payment_type, activePolicy]);

    const displayData = useMemo(() => {
        const price = Number(form.data.price || 0);
        return {
            original: price,
            discount: 0,
            final: price,
            details: form.data.package
                ? [
                      {
                          court_name: form.data.package.name,
                          time_range: `${form.data.duration} Bulan`,
                          original_price: price,
                          final_price: price,
                          booking_date: form.data.start_date,
                      },
                  ]
                : [],
        };
    }, [
        form.data.price,
        form.data.package,
        form.data.duration,
        form.data.start_date,
    ]);

    const handleStepChange = (update) => {
        if (typeof update === "function") {
            form.setData(update);
        } else {
            form.setData((prev) => ({ ...prev, ...update }));
        }
    };

    useEffect(() => {
        form.transform((oldData) => ({
            ...oldData,
            start_date:
                oldData.start_date instanceof Date
                    ? oldData.start_date.toISOString().split("T")[0]
                    : oldData.start_date,
            amount: String(oldData.amount || "0").replace(/[^0-9.-]+/g, ""),
            proof_of_payment: Array.isArray(oldData.proof_of_payment)
                ? oldData.proof_of_payment[0]?.file ||
                  oldData.proof_of_payment[0]
                : oldData.proof_of_payment,
        }));
    }, [form.data]);

    const handleNext = () => {
        const data = form.data;
        let errorsFound = {};

        if (currentStep === 0) {
            if (!data.venue_id) {
                toast.warning("Pilih venue terlebih dahulu!");
                return;
            }
            if (!data.membership_package_id || !data.start_date) {
                errors[0] = "Pilih paket membership dan tanggal mulai!";
                toast.warning(errors[0]);
            }
            if (isDateConflict) {
                errors[0] = "Tanggal mulai bentrok dengan paket aktif!";
                toast.error(errors[0]);
            }
        }

        if (currentStep === 1) {
            if (isDateConflict) {
                toast.error("Tidak bisa lanjut: Jadwal masih bentrok!");
                return;
            }

            // if (isIdentityConflict) {
            //     toast.error("Tidak bisa lanjut: Masalah identitas email!");
            //     return;
            // }

            if (!data.customer_name || !data.customer_phone) {
                toast.warning("Nama dan Nomor Handphone wajib diisi!");
                return;
            }
        }

        if (currentStep === 2) {
            const numericAmount = Number(
                String(data.amount || "0").replace(/[^0-9.-]+/g, ""),
            );
            const numericTotal = Number(data.price || 0);

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
                toast.warning("Jumlah pembayaran melebihi harga paket!");
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
                ? "merchant.memberships.orders.store"
                : "merchant.venues.memberships.orders.store";

        const routeParams =
            scope === "merchant"
                ? {}
                : { venue: form.data.venue_slug || initialVenues?.slug };

        form.post(route(routeName, routeParams), {
            forceFormData: true,
            onSuccess: () => {
                toast.success("Order Membership Berhasil Dibuat!");
            },
        });
    };

    return {
        form,
        currentStep,
        setCurrentStep,
        stepErrors,
        isDateConflict,
        isIdentityConflict,
        handleNext,
        handleBack,
        selectedVenue,
        availablePackages,
        loadingPackages,
        handleVenueChange,
        handlePackageSelect,
        handleDateChange,
        activePolicy,
        minAmountRequired,
        remainingAmount: Math.max(
            0,
            Number(form.data.price || 0) - Number(form.data.amount || 0),
        ),
        displayData,
        handleStepChange,
        submit,
    };
};
