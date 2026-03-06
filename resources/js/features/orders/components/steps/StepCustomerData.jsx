import React, { useEffect } from "react";
import ContentCard from "@/components/cards/ContentCard";
import TextInput from "@/components/Common/TextInput";
import LabelInput from "@/components/Common/LabelInput";
import BannerAlert from "@/components/Common/BannerAlert";
import { formatFullDateWithDay } from "@/utils/date";
import CustomerDataForm from "@/features/orders/components/forms/CustomerDataForm";
import { renderItemCustomer } from "@/features/orders/utils/CustomerRenderer";
import { useCustomerLookup } from "@/features/orders/hooks/useCustomerLookup";
import { User } from "lucide-react";
import { getInvoiceStatus } from "@/utils/attributes/invoiceAttribute";
import { getBookingStatus } from "@/utils/attributes/bookingAttribute";
import { formatRupiah } from "./../../../../utils/currency";
import Badge from "@/components/Common/Badge";

export default function StepCustomerData({
    venue,
    value,
    onChange,
    errors = {},
    isDateConflict,
    mode = "booking",
}) {
    const {
        suggestions,
        setSuggestions,
        loading,
        banner,
        setBanner,
        isNameReadOnly,
        isEmailReadOnly,
        handleSearch,
        checkCustomer,
    } = useCustomerLookup(value.venue_id, false, onChange);

    const handleSelectSuggestion = (cust) => {
        setSuggestions([]);

        const payload = {
            customer_id: cust.user_id || cust.id,
            customer_phone: cust.phone_number,
            customer_name: cust.name,
            customer_email: cust.email || "",
            member_no: cust.member_no,
            active_until: cust.active_until,
            active_until_label: cust.active_until_label,
            last_package: cust.last_package,
            membership_benefit: cust.membership_benefit || null,
            last_booking: cust.last_booking || null,
        };

        onChange(payload);

        checkCustomer({ phone: cust.phone_number, email: cust.email || "" });
    };

    useEffect(() => {
        if (value.venue_id) {
            onChange({
                ...value,
                customer_id: null,
                customer_name: "",
                customer_phone: "",
                customer_email: "",
                member_no: null,
                active_until: null,
                active_until_label: null,
                last_package: null,
                membership_benefit: null,
                last_booking: null,
            });
        }
    }, [value.venue_id]);

    return (
        <ContentCard
            title="Informasi Pelanggan"
            icon={User}
            className="shadow-none"
        >
            <div className="space-y-6">
                <CustomerDataForm
                    venue={venue}
                    value={value}
                    onChange={onChange}
                    suggestions={suggestions}
                    loading={loading}
                    errors={errors}
                    banner={banner}
                    onCloseBanner={() => setBanner(null)}
                    onPhoneChange={handleSearch}
                    onSelectSuggestion={handleSelectSuggestion}
                    renderItem={renderItemCustomer}
                    isNameDisabled={isNameReadOnly}
                    isEmailDisabled={isEmailReadOnly}
                    onEmailBlur={() => {
                        if (value.customer_email && value.customer_phone) {
                            checkCustomer({
                                phone: value.customer_phone,
                                email: value.customer_email,
                            });
                        }
                    }}
                />

                {value.member_no && (
                    <div className="flex flex-col md:flex-row gap-2 md:items-center">
                        <div className="md:w-1/5 flex justify-between items-center">
                            <LabelInput
                                htmlFor="member_no"
                                value="Nomor Member"
                                className="font-bold text-sm"
                            />
                            <span>:</span>
                        </div>
                        <div className="flex-1">
                            <TextInput
                                id="member_no"
                                value={value.member_no}
                                disabled
                            />
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    {mode === "booking" && value.membership_benefit && (
                        <BannerAlert
                            type="success"
                            showIcon={false}
                            title="Membership Aktif"
                            className="p-3 text-left"
                        >
                            <div className="text-xs space-y-1">
                                <div className="flex flex-col items-start">
                                    <span className="text-left">
                                        Paket:{" "}
                                        <strong>
                                            {
                                                value.membership_benefit
                                                    .package_name
                                            }
                                        </strong>
                                    </span>
                                    <span className="text-green-700 font-bold text-left">
                                        Potongan:{" "}
                                        {value.membership_benefit
                                            .discount_type === "percentage"
                                            ? `${value.membership_benefit.discount_value}%`
                                            : `Rp ${new Intl.NumberFormat("id-ID").format(value.membership_benefit.discount_value)}`}
                                    </span>
                                    <span className="text-left">
                                        Sisa Kuota:{" "}
                                        <strong>
                                            {
                                                value.membership_benefit
                                                    .remaining_quota
                                            }
                                            x Slot Jadwal
                                        </strong>
                                    </span>
                                </div>
                            </div>
                        </BannerAlert>
                    )}

                    {mode === "booking" && value.last_booking && (
                        <BannerAlert
                            type="info"
                            size="xs"
                            showIcon={false}
                            title="Booking Terakhir"
                            className="text-left"
                        >
                            <div className="text-xs flex flex-col gap-2">
                                <div className="flex flex-row gap-2 items-center ">
                                    <div>{value.last_booking.order_no}</div>
                                    <Badge
                                        color={
                                            getBookingStatus(
                                                value.last_booking.status,
                                            ).color
                                        }
                                    >
                                        {" "}
                                        {
                                            getBookingStatus(
                                                value.last_booking.status,
                                            ).label
                                        }
                                    </Badge>
                                    <Badge
                                        color={
                                            getInvoiceStatus(
                                                value.last_booking
                                                    .invoice_status,
                                            ).color
                                        }
                                    >
                                        {
                                            getInvoiceStatus(
                                                value.last_booking
                                                    .invoice_status,
                                            ).label
                                        }
                                    </Badge>
                                </div>

                                <div className="flex flex-row gap-2 items-center ">
                                    <div>
                                        {
                                            value.last_booking.details?.[0]
                                                ?.court_name
                                        }
                                    </div>
                                    <div>
                                        {
                                            value.last_booking.details?.[0]
                                                ?.booking_date
                                        }
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {value.last_booking.details.map(
                                            (slot, index) => (
                                                <Badge
                                                    key={index}
                                                    color="yellow"
                                                >
                                                    {slot.time_slot_name}
                                                </Badge>
                                            ),
                                        )}
                                    </div>
                                </div>
                            </div>
                        </BannerAlert>
                    )}

                    {mode === "booking" &&
                        value.last_booking?.pricing?.remaining_amount > 0 && (
                            <BannerAlert
                                type="warning"
                                showIcon={false}
                                size="xs"
                                className="text-left text-xs"
                            >
                                <div className="flex gap-2">
                                    <p>
                                        Pelanggan memiliki tagihan belum lunas
                                        pada pesanan
                                    </p>
                                    <span className="font-bold">
                                        {value.last_booking.order_no}
                                    </span>
                                    <span>:</span>
                                    <span className="font-bold">
                                        {formatRupiah(
                                            value.last_booking.pricing
                                                .remaining_amount,
                                        )}
                                    </span>
                                </div>
                            </BannerAlert>
                        )}

                    {mode === "membership" && (
                        <>
                            {isDateConflict && (
                                <BannerAlert
                                    type="error"
                                    showIcon={false}
                                    title="Konflik Masa Aktif"
                                    className="p-3 text-left"
                                >
                                    <span className="text-xs text-left block">
                                        Pelanggan masih memiliki paket{" "}
                                        <strong>{value.last_package}</strong>{" "}
                                        yang aktif sampai{" "}
                                        <strong>
                                            {value.active_until_label ||
                                                formatFullDateWithDay(
                                                    value.active_until,
                                                )}
                                        </strong>
                                        . Silakan kembali ke langkah pertama
                                        untuk memilih tanggal mulai setelah
                                        paket tersebut berakhir.
                                    </span>
                                </BannerAlert>
                            )}

                            {value.member_no && !isDateConflict && (
                                <BannerAlert
                                    type={
                                        value.active_until
                                            ? "warning"
                                            : "success"
                                    }
                                    showIcon={false}
                                    className="p-3 text-left"
                                    title={
                                        value.active_until
                                            ? "Membership Masih Aktif"
                                            : "Membership Sudah Kadaluarsa"
                                    }
                                >
                                    <div className="flex flex-col items-start gap-1 text-xs">
                                        <span>
                                            Paket Terakhir:{" "}
                                            <strong>
                                                {value.last_package || "-"}
                                            </strong>
                                        </span>
                                        <span>
                                            Status:{" "}
                                            {value.active_until
                                                ? `Aktif hingga ${
                                                      value.active_until_label ||
                                                      formatFullDateWithDay(
                                                          value.active_until,
                                                      )
                                                  }.`
                                                : "Sudah berakhir."}
                                        </span>

                                        <span className="mt-1 font-medium">
                                            {value.active_until
                                                ? "👉 Pelanggan dapat melanjutkan order untuk masa aktif berikutnya."
                                                : "👉 Silakan buat order baru untuk memperpanjang membership pelanggan ini."}
                                        </span>
                                    </div>
                                </BannerAlert>
                            )}
                        </>
                    )}
                </div>
            </div>
        </ContentCard>
    );
}
