// resources/js/components/Orders/Payment/PaymentForm.jsx

import { useEffect } from "react";
import FileInput from "@/components/Common/FileInput";
import LabelInput from "@/components/Common/LabelInput";
import TextInput from "@/components/Common/TextInput";
import SelectInput from "@/components/Common/SelectInput";
import DatePickerInput from "@/components/Common/DatePickerInput";
import NumericInput from "@/components/Common/NumericInput";
import TimePickerInput from "@/components/Common/TimePickerInput";
import { formatWithPattern } from "@/utils/date";

export default function PaymentForm({
    type = "booking",
    formData = {},
    onChange,
    paymentTypeOptions = [
        { value: "down_payment", label: "DP" },
        { value: "full_payment", label: "Full Pembayaran" },
    ],
    paymentMethodOptions = [
        { value: "bank_transfer", label: "Transfer Bank" },
        { value: "ewallet", label: "Transfer Dompet Digital" },
        { value: "cash", label: "Tunai (Cash)" },
        { value: "qris", label: "QRIS" },
    ],
    showProof = true,
}) {
    const isMembership = type === "membership";

    useEffect(() => {
        if (isMembership && formData.payment_type !== "full_payment") {
            onChange?.({ payment_type: "full_payment" });
        }
    }, [isMembership]);

    const update = (court) => (value) => {
        if (court === "payment_date" && value) {
            onChange?.({
                [court]: formatWithPattern(value, "yyyy-MM-dd"),
            });
            return;
        }
        onChange?.({ [court]: value });
    };

    const method = formData.payment_method;

    const computedPaymentTypeOptions = isMembership
        ? paymentTypeOptions.map((opt) =>
              opt.value === "down_payment" ? { ...opt, isDisabled: true } : opt
          )
        : paymentTypeOptions;

    return (
        <div className="flex flex-col gap-3 text-sm">
            <FormSelect
                label="Tipe Pembayaran"
                value={formData.payment_type}
                onChange={update("payment_type")}
                options={computedPaymentTypeOptions}
            />
            <FormSelect
                label="Metode Pembayaran"
                value={formData.payment_method}
                onChange={update("payment_method")}
                options={paymentMethodOptions}
            />
            {method === "bank_transfer" && (
                <FormText
                    label="Nama Bank"
                    value={formData.bank}
                    onChange={update("bank")}
                    placeholder="BCA, Mandiri..."
                />
            )}
            {method === "ewallet" && (
                <FormText
                    label="Dompet Digital"
                    value={formData.digital_wallet}
                    onChange={update("digital_wallet")}
                    placeholder="GoPay, Dana..."
                />
            )}
            {["bank_transfer", "ewallet", "qris"].includes(method) && (
                <>
                    <FormText
                        label="Nomor Referensi"
                        value={formData.reference_no}
                        onChange={update("reference_no")}
                        placeholder="Nomor referensi"
                    />

                    <FormText
                        label="Nama Pengirim"
                        value={formData.payer_name}
                        onChange={update("payer_name")}
                        placeholder="Nama pengirim"
                    />

                    {showProof && (
                        <FormFile
                            label="Upload Bukti Pembayaran"
                            onChange={(files) => {
                                console.log("[DEBUG FILES]:", files);
                                update("proof_of_payment")(files);
                            }}
                        />
                    )}
                </>
            )}

            <FormNumber
                label="Jumlah Pembayaran"
                value={formData.amount}
                onChange={update("amount")}
                placeholder="Rp. 0"
            />
            <FormDate
                label="Tanggal Pembayaran"
                value={
                    formData.payment_date
                        ? new Date(formData.payment_date)
                        : null
                }
                onChange={(dateObj) => {
                    const normalized = dateObj
                        ? formatWithPattern(dateObj, "yyyy-MM-dd")
                        : null;
                    update("payment_date")(normalized);
                }}
            />
            <FormTime
                label="Waktu Pembayaran"
                value={formData.payment_time}
                onChange={update("payment_time")}
            />
        </div>
    );
}

function RowForm({ label, children }) {
    return (
        <div className="flex flex-col md:flex-row gap-2 md:items-center">
            <div className="md:w-1/3 flex flex-row md:justify-between gap-2 items-center">
                <LabelInput value={label} className="font-bold text-sm" />
                <span>:</span>
            </div>
            <div className="flex-1">{children}</div>
        </div>
    );
}

function FormText({ label, value, onChange, placeholder }) {
    return (
        <RowForm label={label}>
            <TextInput
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
            />
        </RowForm>
    );
}

function FormFile({ label, onChange }) {
    return (
        <RowForm label={label}>
            <FileInput onChange={onChange} />
        </RowForm>
    );
}

function FormSelect({ label, value, onChange, options }) {
    return (
        <RowForm label={label}>
            <SelectInput
                value={value}
                onChange={onChange}
                options={options}
                isClearable={false}
                isSearchable={false}
                placeholder={`Pilih ${label}`}
            />
        </RowForm>
    );
}

function FormNumber({ label, value, onChange, placeholder }) {
    return (
        <RowForm label={label}>
            <NumericInput
                value={value ?? ""}
                onChange={onChange}
                placeholder={placeholder}
                prefix="Rp "
                thousandSeparator="."
                decimalSeparator=","
                decimalScale={0}
                allowNegative={false}
            />
        </RowForm>
    );
}

function FormDate({ label, value, onChange }) {
    return (
        <RowForm label={label}>
            <DatePickerInput
                value={value}
                onChange={onChange}
                popoverDirection="up"
                className="w-full"
            />
        </RowForm>
    );
}

function FormTime({ label, value, onChange }) {
    return (
        <RowForm label={label}>
            <TimePickerInput
                step="60"
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
            />
        </RowForm>
    );
}
