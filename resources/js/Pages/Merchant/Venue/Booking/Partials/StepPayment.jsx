import FileInput from "@/components/Common/FileInput";
import LabelInput from "@/components/Common/LabelInput";
import TextInput from "@/components/Common/TextInput";
import SelectInput from "@/components/Common/SelectInput";
import DatePickerInput from "@/components/Common/DatePickerInput";
import NumericInput from "@/components/Common/NumericInput";
import { Card, CardBody, CardHeader } from "@/components/Common/Card";
import { NumericFormat } from "react-number-format";
import PreviewBooking from "@/Pages/Merchant/Venue/Booking/Partials/PreviewBooking";
import TimePickerInput from "@/components/Common/TimePickerInput";
import { formatWithPattern } from "@/utils/date";

export default function StepPayment({ formData = {}, onChange, fields = [] }) {
    const paymentTypeOptions = [
        { value: "down_payment", label: "DP" },
        { value: "full_payment", label: "Full Pembayaran" },
    ];

    const paymentMethodOptions = [
        { value: "bank_transfer", label: "Transfer Bank" },
        { value: "e_wallet", label: "Transfer Dompet Digital" },
        { value: "cash", label: "Tunai (Cash)" },
    ];

    // --- controlled update: kirim incremental patch ke parent
    const update = (field) => (value) => {
        if (field === "payment_date" && value) {
            return onChange?.({
                [field]: formatWithPattern(value, "yyyy-MM-dd"),
            });
        }
        if (field === "payment_time" && value) {
            return onChange?.({ [field]: value }); // "HH:mm"
        }
        onChange?.({ [field]: value });
    };

    // --- selalu array
    const bookingSelections = Array.isArray(formData.bookingSelections)
        ? formData.bookingSelections
        : [];

    // --- helper angka aman
    const num = (v) => Number(v ?? 0);

    // --- hitung total harga dengan guard
    const totalPrice = bookingSelections.reduce((sumDate, d) => {
        const fieldsArr = Array.isArray(d.fields) ? d.fields : [];
        const subtotalDate = fieldsArr.reduce((sumF, f) => {
            const slotsArr = Array.isArray(f.slots) ? f.slots : [];
            return sumF + slotsArr.reduce((sumS, s) => sumS + num(s.price), 0);
        }, 0);
        return sumDate + subtotalDate;
    }, 0);

    const paidAmount = num(formData.payment_amount);
    const remainingAmount = totalPrice - paidAmount;

    return (
        <div className="flex flex-col gap-2 text-left overflow-visible">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Kiri: Ringkasan Booking & Rincian Pembayaran */}
                <div className="w-full">
                    <PreviewBooking
                        bookingSelections={bookingSelections}
                        fields={fields}
                        onBookingChange={onChange}
                        readOnly // kalau mau nonaktifkan tombol hapus di step payment
                    />
                </div>

                {/* Kanan: Form Pembayaran */}
                <div className="w-full">
                    <Card className="flex flex-col w-full rounded-xl border-none shadow-none p-0 text-sm mt-4">
                        <CardHeader className="px-0 pb-4 border-b text-xl font-bold text-secondary-500 dark:text-white">
                            Rincian Pembayaran
                        </CardHeader>
                        <CardBody className="px-0 py-2 flex flex-col gap-2">
                            <RowPrice label="Biaya Sewa:" value={totalPrice} />
                            <RowPrice
                                label="Telah Dibayar"
                                value={paidAmount}
                            />
                            <RowPrice
                                label="Sisa Pembayaran"
                                value={remainingAmount}
                                bold
                            />
                        </CardBody>
                    </Card>
                    <Card className="flex flex-col w-full rounded-xl border-none shadow-none p-0 text-sm overflow-visible">
                        <CardHeader className="px-0 pb-4 border-b text-xl font-bold text-secondary-500 dark:text-white">
                            Pembayaran
                        </CardHeader>
                        <CardBody className="px-0 flex flex-col gap-4">
                            <FormSelect
                                label="Tipe Pembayaran"
                                value={formData.payment_type}
                                onChange={update("payment_type")}
                                options={paymentTypeOptions}
                            />

                            <FormSelect
                                label="Metode Pembayaran"
                                value={formData.payment_method}
                                onChange={update("payment_method")}
                                options={paymentMethodOptions}
                            />

                            {formData.payment_method === "bank_transfer" && (
                                <FormText
                                    label="Nama Bank"
                                    value={formData.bank}
                                    onChange={update("bank")}
                                    placeholder="BCA, Mandiri..."
                                />
                            )}

                            {formData.payment_method === "e_wallet" && (
                                <FormText
                                    label="Dompet Digital"
                                    value={formData.digital_wallet}
                                    onChange={update("digital_wallet")}
                                    placeholder="GoPay, Dana..."
                                />
                            )}

                            {(formData.payment_method === "bank_transfer" ||
                                formData.payment_method === "e_wallet") && (
                                <>
                                    <FormText
                                        label="Nomor Referensi"
                                        value={formData.reference_number}
                                        onChange={update("reference_number")}
                                        placeholder="Nomor referensi"
                                    />
                                    <FormText
                                        label="Nama Pengirim"
                                        value={formData.sender_name}
                                        onChange={update("sender_name")}
                                        placeholder="Nama pengirim"
                                    />
                                    <FormFile
                                        label="Upload Bukti Pembayaran"
                                        onChange={update("payment_proof")}
                                    />
                                </>
                            )}

                            <FormNumber
                                label="Jumlah Pembayaran"
                                value={formData.payment_amount}
                                onChange={update("payment_amount")}
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
                                    // Untuk backend simpan ke format ISO/DB
                                    const normalized = dateObj
                                        ? formatWithPattern(
                                              dateObj,
                                              "yyyy-MM-dd"
                                          ) // contoh "2025-09-08"
                                        : null;
                                    update("payment_date")(normalized);
                                }}
                            />

                            <FormTime
                                label="Waktu Pembayaran"
                                value={formData.payment_time}
                                onChange={update("payment_time")}
                            />
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
}

/* ------- Helper Components ------- */
function RowPrice({ label, value, bold = false }) {
    return (
        <div
            className={`flex flex-row justify-between ${
                bold ? "font-bold" : ""
            }`}
        >
            <span>{label}</span>
            <NumericFormat
                value={Number(value || 0)}
                displayType="text"
                thousandSeparator="."
                decimalSeparator=","
                prefix="Rp "
            />
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
                prefix="Rp " // default untuk mata uang, bisa diganti nanti
                thousandSeparator="."
                decimalSeparator=","
                decimalScale={0} // default tanpa desimal
                fixedDecimalScale={false}
                allowNegative={false}
                className="input-text" // sesuai style TextInput
            />
        </RowForm>
    );
}

function FormDate({ label, value, onChange }) {
    return (
        <RowForm label={label}>
            <DatePickerInput
                label=""
                value={value}
                onChange={onChange}
                popoverDirection="up"
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

/* Wrapper biar form rapih */
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
