import { useEffect, useMemo } from "react";
import FileInput from "@/components/Common/FileInput";
import LabelInput from "@/components/Common/LabelInput";
import TextInput from "@/components/Common/TextInput";
import SelectInput from "@/components/Common/SelectInput";
import DatePickerInput from "@/components/Common/DatePickerInput";
import NumericInput from "@/components/Common/NumericInput";
import TimePickerInput from "@/components/Common/TimePickerInput";
import { formatWithPattern } from "@/utils/date";
import { formatRupiah } from "@/utils/currency";

const paymentMethodOptions = [
    { value: "bank_transfer", label: "Transfer Bank" },
    { value: "ewallet", label: "Transfer Dompet Digital" },
    { value: "cash", label: "Tunai (Cash)" },
    { value: "qris", label: "QRIS" },
];

export default function PaymentForm({
    formData = {},
    onChange,
    errors = {},
    paymentPolicy,
    minAmountRequired,
    showProof = true,
}) {
    const paymentTypeOptions = useMemo(() => {
        const options = [{ value: "full_payment", label: "Full Pembayaran" }];

        if (paymentPolicy?.enable_dp) {
            options.push({ value: "down_payment", label: "DP (Down Payment)" });
        }
        return options;
    }, [paymentPolicy]);

    useEffect(() => {
        const optionValues = paymentTypeOptions.map((o) => o.value);
        if (
            formData.payment_type &&
            !optionValues.includes(formData.payment_type)
        ) {
            onChange?.({ payment_type: "full_payment" });
        }
    }, [paymentTypeOptions]);

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

    return (
        <div className="flex flex-col gap-4 text-sm">
            <FormSelect
                label="Tipe Pembayaran"
                value={formData.payment_type}
                onChange={update("payment_type")}
                error={errors.payment_type}
                options={paymentTypeOptions}
                isDisabled={paymentTypeOptions.length <= 1}
            />
            <FormSelect
                label="Metode Pembayaran"
                value={formData.payment_method}
                onChange={update("payment_method")}
                error={errors.payment_method}
                options={paymentMethodOptions}
            />
            {method === "bank_transfer" && (
                <FormText
                    label="Nama Bank"
                    value={formData.bank}
                    onChange={update("bank")}
                    error={errors.bank}
                    placeholder="BCA, Mandiri..."
                />
            )}
            {method === "ewallet" && (
                <FormText
                    label="Dompet Digital"
                    value={formData.digital_wallet}
                    onChange={update("digital_wallet")}
                    error={errors.digital_wallet}
                    placeholder="GoPay, Dana..."
                />
            )}
            {["bank_transfer", "ewallet", "qris"].includes(method) && (
                <>
                    <FormText
                        label="Nomor Referensi"
                        value={formData.reference_no}
                        onChange={update("reference_no")}
                        error={errors.reference_no}
                        placeholder="Nomor referensi"
                    />

                    <FormText
                        label="Nama Pengirim"
                        value={formData.payer_name}
                        onChange={update("payer_name")}
                        error={errors.payer_name}
                        placeholder="Nama pengirim"
                    />

                    {showProof && (
                        <FormFile
                            label="Upload Bukti Pembayaran"
                            onChange={(files) => {
                                console.log("[DEBUG FILES]:", files);
                                update("proof_of_payment")(files);
                            }}
                            error={errors.files}
                        />
                    )}
                </>
            )}

            <FormNumber
                label="Jumlah Pembayaran"
                value={formData.amount}
                onChange={update("amount")}
                error={errors.amount}
                helperText={
                    formData.payment_type === "down_payment" &&
                    paymentPolicy ? (
                        <span className="text-[11px] text-secondary-500 dark:text-secondary-400 italic">
                            Min. DP yang disarankan:{" "}
                            <b className="text-primary-500">
                                {formatRupiah(minAmountRequired)}
                            </b>
                        </span>
                    ) : null
                }
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
                error={errors.payment_date}
            />
            <FormTime
                label="Waktu Pembayaran"
                value={formData.payment_time}
                onChange={update("payment_time")}
                error={errors.payment_time}
            />
        </div>
    );
}

function RowForm({ label, children, error }) {
    return (
        <div className="flex flex-col md:flex-row gap-2 md:items-start">
            <div className="md:w-1/3 flex flex-row md:justify-between items-center md:pt-2">
                <LabelInput value={label} className="font-bold" />
                <span>:</span>
            </div>
            <div className="flex-1 flex flex-col gap-1">
                {children}
                {error && <ErrorInput message={error} />}
            </div>
        </div>
    );
}

function FormText({ label, value, onChange, placeholder, error }) {
    return (
        <RowForm label={label} error={error}>
            <TextInput
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                isError={!!error}
            />
        </RowForm>
    );
}

function FormSelect({ label, value, onChange, options, error }) {
    return (
        <RowForm label={label} error={error}>
            <SelectInput
                value={value}
                onChange={onChange}
                options={options}
                isClearable={false}
                isSearchable={false}
                placeholder={`Pilih ${label}`}
                isError={!!error}
            />
        </RowForm>
    );
}

function FormFile({ label, onChange, error }) {
    return (
        <RowForm label={label} error={error}>
            <FileInput onChange={onChange} isError={!!error} />
        </RowForm>
    );
}

function FormNumber({
    label,
    value,
    onChange,
    error,
    placeholder,
    helperText,
}) {
    return (
        <RowForm label={label} error={error}>
            <NumericInput
                value={value ?? ""}
                onChange={onChange}
                isError={!!error}
                placeholder={placeholder}
                prefix="Rp "
                thousandSeparator="."
                decimalSeparator=","
                decimalScale={0}
                allowNegative={false}
            />
            {/* Tampilkan helperText jika ada */}
            {helperText && !error && <div className="mt-1">{helperText}</div>}
        </RowForm>
    );
}

function FormDate({ label, value, onChange, error }) {
    return (
        <RowForm label={label} error={error}>
            <DatePickerInput
                value={value}
                onChange={onChange}
                isError={!!error}
                popoverDirection="up"
                className="w-full"
            />
        </RowForm>
    );
}

function FormTime({ label, value, onChange, error }) {
    return (
        <RowForm label={label} error={error}>
            <TimePickerInput
                step="60"
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                isError={!!error}
            />
        </RowForm>
    );
}
