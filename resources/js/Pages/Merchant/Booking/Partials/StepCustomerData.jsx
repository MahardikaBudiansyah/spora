import { useState } from "react";
import LabelInput from "@/components/Common/LabelInput";
import TextInput from "@/components/Common/TextInput";
import BannerAlert from "@/components/Common/BannerAlert";
import axios from "axios";
import { formatTo08, normalizePhone } from "@/utils/numberPhone";
import SuggestionDropdown from "@/components/Common/SuggestionDropdown";

export default function StepCustomerData({ venue, onChange }) {
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [customer, setCustomer] = useState({
        customer_id: null,
        customer_name: "",
        customer_email: "",
        customer_phone: "",
    });
    const [banner, setBanner] = useState(null);

    const syncCustomer = (data) => {
        setCustomer(data);
        onChange(data); // push ke parent (Create.jsx)
    };

    const handleSelectSuggestion = (cust) => {
        const newCustomer = {
            customer_id: cust.user_id ?? null,
            customer_name: cust.name ?? "",
            customer_email: cust.email ?? "",
            customer_phone: cust.phone_number ?? "",
        };
        syncCustomer(newCustomer);
        setBanner({ type: "success", message: "Customer berhasil dipilih" });
    };

    const handlePhoneChange = async (valOrEvent) => {
        const inputPhone =
            valOrEvent.target?.value !== undefined
                ? valOrEvent.target.value
                : valOrEvent;

        const newCustomer = {
            ...customer,
            customer_phone: inputPhone,
        };
        syncCustomer(newCustomer);

        if (inputPhone.length >= 3) {
            setLoading(true);
            setBanner({
                type: "info",
                message: "Sedang mencari data customer...",
            });

            try {
                const normalized = normalizePhone(inputPhone);
                const { data } = await axios.get(
                    route("merchant.venues.bookings.searchCustomer", {
                        venue: venue.slug,
                    }),
                    { params: { phone: normalized } }
                );

                if (Array.isArray(data) && data.length > 0) {
                    setSuggestions(data);
                    setBanner({
                        type: "success",
                        message: `Ditemukan ${data.length} customer sesuai nomor.`,
                    });

                    const match = data.find(
                        (cust) =>
                            normalizePhone(cust.phone_number) === normalized
                    );
                    if (match) handleSelectSuggestion(match);
                } else {
                    setSuggestions([]);
                    setBanner({
                        type: "warning",
                        message:
                            "Data customer tidak ditemukan. Silakan isi manual",
                    });

                    // reset name & email kalau nomor tidak ditemukan
                    syncCustomer({
                        customer_id: null,
                        customer_name: "",
                        customer_email: "",
                        customer_phone: inputPhone,
                    });
                }
            } finally {
                setLoading(false);
            }
        } else {
            setSuggestions([]);
            setBanner(null);
        }
    };

    // custom render suggestion
    const renderItemCustomer = (cust, input) => {
        const phone08 = formatTo08(cust.phone_number);
        const input08 = formatTo08(input);
        const index = phone08.indexOf(input08);
        const before = index >= 0 ? phone08.slice(0, index) : phone08;
        const match =
            index >= 0 ? phone08.slice(index, index + input08.length) : "";
        const after = index >= 0 ? phone08.slice(index + input08.length) : "";

        return (
            <div className="flex flex-col">
                <div className="font-semibold">
                    {before}
                    {match && (
                        <span className="font-bold text-primary-700 dark:text-primary-700">
                            {match}
                        </span>
                    )}
                    {after}
                </div>
                <div className="text-xs text-secondary-500">
                    {cust.name} · {cust.email}
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col gap-2 text-left">
            <div className="pb-4 text-xl text-secondary-500 dark:text-white font-bold uppercase">
                Informasi Konsumen
            </div>

            {banner && (
                <BannerAlert
                    type={banner.type}
                    closable
                    onClose={() => setBanner(null)}
                >
                    {banner.message}
                </BannerAlert>
            )}

            <div className="flex flex-col gap-8">
                {/* PHONE */}
                <div className="flex flex-col md:flex-row gap-2 md:items-center">
                    <div className="md:w-1/5 flex justify-between items-center">
                        <LabelInput
                            htmlFor="customer_phone"
                            value="Nomor Handphone"
                            className="font-bold text-sm"
                        />
                        <span>:</span>
                    </div>
                    <div className="relative flex-1">
                        <SuggestionDropdown
                            value={customer.customer_phone}
                            onChange={handlePhoneChange}
                            suggestions={suggestions}
                            onSelect={handleSelectSuggestion}
                            renderItem={renderItemCustomer}
                            placeholder="Masukan Nomor Handphone"
                            minLength={3}
                            loading={loading}
                            maxResults={3}
                        />
                    </div>
                </div>

                {/* EMAIL */}
                <div className="flex flex-col md:flex-row gap-2 md:items-center">
                    <div className="md:w-1/5 flex justify-between items-center">
                        <LabelInput
                            htmlFor="customer_email"
                            value="Email"
                            className="font-bold text-sm"
                        />
                        <span>:</span>
                    </div>
                    <div className="flex-1">
                        <TextInput
                            id="customer_email"
                            name="customer_email"
                            type="email"
                            placeholder="Masukan Email Konsumen (opsional)"
                            className="flex-1"
                            value={customer.customer_email}
                            onChange={(e) =>
                                syncCustomer({
                                    ...customer,
                                    customer_email: e.target.value,
                                })
                            }
                        />
                    </div>
                </div>

                {/* NAME */}
                <div className="flex flex-col md:flex-row gap-2 md:items-center">
                    <div className="md:w-1/5 flex justify-between items-center">
                        <LabelInput
                            htmlFor="customer_name"
                            value="Nama"
                            className="font-bold text-sm"
                        />
                        <span>:</span>
                    </div>
                    <div className="flex-1">
                        <TextInput
                            id="customer_name"
                            name="customer_name"
                            placeholder="Masukan Nama Konsumen"
                            className="flex-1"
                            value={customer.customer_name}
                            onChange={(e) =>
                                syncCustomer({
                                    ...customer,
                                    customer_name: e.target.value,
                                })
                            }
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
