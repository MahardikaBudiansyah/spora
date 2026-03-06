import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import axios from "axios";
import { debounce } from "lodash";
import { normalizePhone, formatTo08 } from "@/utils/numberPhone";

export function useCustomerLookup(venueId, isEditMode = false, setData) {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [banner, setBanner] = useState(null);

    const [isNameReadOnly, setIsNameReadOnly] = useState(false);
    const [isEmailReadOnly, setIsEmailReadOnly] = useState(false);

    const lastCheckedPhone = useRef("");

    const handleEmailChange = useCallback(
        (email) => {
            setData((prev) => ({
                ...prev,
                customer_email: email,
            }));
        },
        [setData],
    );

    const resetLookup = useCallback(() => {
        setSuggestions([]);
        setBanner(null);
        setIsNameReadOnly(false);
        setIsEmailReadOnly(false);
        setLoading(false);
        lastCheckedPhone.current = "";
    }, []);

    useEffect(() => {
        if (!venueId) resetLookup();
    }, [venueId, resetLookup]);

    const checkCustomer = useCallback(
        async ({ phone, email }) => {
            const normalized = normalizePhone(phone);

            if (!venueId || (!normalized && !email)) return;
            if (normalized === lastCheckedPhone.current && !email) return;

            lastCheckedPhone.current = normalized;
            setLoading(true);
            setBanner(null);

            try {
                const { data: res } = await axios.get(
                    route("merchant.customers.checkCustomer"),
                    { params: { phone: normalized, venue_id: venueId, email } },
                );

                console.group("🔍 Customer Lookup Debug");
                console.log("Nomor yang dicek:", normalized);
                console.log("Raw Response dari API:", res);
                console.log("User ID:", res.user_id);
                console.log("Last Booking:", res.last_booking);

                // Memastikan tipe datanya (null vs undefined)
                console.log("Tipe user_id:", typeof res.user_id);
                console.groupEnd();
                // -----------------

                if (normalized !== lastCheckedPhone.current) return;

                if (res.is_identity_conflict) {
                    setBanner({
                        type: "error",
                        message: `Email ini sudah terdaftar dengan nomor HP lain. Satu email hanya boleh untuk satu nomor HP.`,
                    });

                    setData((prev) => ({
                        ...prev,
                        customer_email: "",
                        customer_id: null,
                        member_no: null,
                    }));

                    setIsEmailReadOnly(false);
                    return;
                }

                if (res.is_already_member) {
                    setBanner({
                        type: "info",
                        message: `Pelanggan terdaftar sebagai member (${res.member_no}).`,
                    });
                    setIsNameReadOnly(!!res.name);
                    setIsEmailReadOnly(!!res.email);
                } else if (res.user_id) {
                    setBanner({
                        type: "success",
                        message:
                            "Nomor Handphone terdaftar pada Akun Platform.",
                    });
                    setIsNameReadOnly(!!res.name);
                    setIsEmailReadOnly(!!res.email);
                } else {
                    setBanner({
                        type: "info",
                        message: "Pendaftaran pelanggan baru.",
                    });
                    setIsNameReadOnly(false);
                    setIsEmailReadOnly(false);
                }

                setData((prev) => ({
                    ...prev,
                    customer_id: res.user_id ?? null,
                    customer_name: res.name || "",
                    customer_email: res.email || "",
                    member_no: res.member_no ?? null,
                    active_until: res.active_until ?? null,
                    active_until_label: res.active_until_label ?? null,
                    last_package: res.last_package ?? null,
                    membership_benefit: res.membership_benefit ?? null,
                    last_booking: res.last_booking ?? null,
                }));
            } catch (err) {
                console.error("Error pada checkCustomer:", {
                    message: err.message,
                    response: err.response?.data,
                    status: err.response?.status,
                    config: err.config,
                });

                const errorMessage =
                    err.response?.data?.debug ||
                    err.response?.data?.error ||
                    "Gagal mengecek data pelanggan.";

                setBanner({
                    type: "error",
                    message: errorMessage,
                });
            } finally {
                setLoading(false);
            }
        },
        [venueId, setData],
    );

    const debouncedFetch = useMemo(
        () =>
            debounce(async (normalized, vId) => {
                setLoading(true);
                try {
                    const { data } = await axios.get(
                        route("merchant.customers.searchCustomer"),
                        { params: { phone: normalized, venue_id: vId } },
                    );
                    setSuggestions(data);
                } catch (e) {
                    setSuggestions([]);
                } finally {
                    setLoading(false);
                }
            }, 500),
        [],
    );

    const handleSearch = useCallback(
        (phone) => {
            setBanner(null);

            if (!venueId) {
                setBanner({
                    type: "warning",
                    message:
                        "Silakan pilih venue terlebih dahulu di langkah pertama.",
                });
                return;
            }

            setData((prev) => {
                if (prev.customer_phone === phone) return prev;

                return {
                    ...prev,
                    customer_phone: phone,
                    customer_id: null,
                    customer_name: "",
                    customer_email: "",
                    member_no: null,
                    active_until: null,
                    active_until_label: null,
                    last_package: null,
                    membership_benefit: null,
                    last_booking: null,
                };
            });

            const normalized = normalizePhone(phone);

            if (!normalized || normalized.length < 4) {
                setSuggestions([]);
                lastCheckedPhone.current = "";
                setBanner(null);
                debouncedFetch.cancel();
                setIsNameReadOnly(false);
                setIsEmailReadOnly(false);
                return;
            }

            debouncedFetch(normalized, venueId);

            if (normalized.length >= 10 && normalized.length <= 13) {
                checkCustomer({ phone: normalized });
            }
        },
        [venueId, setData, debouncedFetch, checkCustomer],
    );

    useEffect(() => {
        resetLookup();

        if (!venueId) {
            setBanner({
                type: "warning",
                message:
                    "Silakan pilih venue terlebih dahulu di langkah pertama.",
            });
        }
    }, [venueId, resetLookup]);

    return {
        suggestions,
        setSuggestions,
        loading,
        banner,
        setBanner,
        handleEmailChange,
        isNameReadOnly,
        isEmailReadOnly,
        handleSearch,
        resetLookup,
        checkCustomer,
    };
}
