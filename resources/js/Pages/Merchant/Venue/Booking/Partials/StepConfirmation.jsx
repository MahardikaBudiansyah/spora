import CustomTable from "@/components/Common/CustomTable";
import BookingSummaryTable from "@/Pages/Merchant/Venue/Booking/Partials/BookingSummaryTable";
import { formatWithPattern } from "@/utils/date";

export default function StepConfirmation({ data, operators, venue, fields }) {
    const operatorRows = [
        {
            label: "Nama Operator",
            value: operators?.map((op) => op.name).join(", ") || "-",
        },
    ];

    const venueRows = [
        { label: "Nama Venue", value: venue?.name },
        {
            label: "Alamat Venue",
            value: venue?.addresses?.[0]
                ? `${venue.addresses[0].address}, ${
                      venue.addresses[0].district_name
                  }, ${venue.addresses[0].city_name}, ${
                      venue.addresses[0].province_name
                  }, ${venue.addresses[0].postal_code || ""}`
                : "-",
        },
        { label: "Kontak", value: venue?.phone_number },
    ];

    const customerRows = [
        { label: "Nomor Handphone", value: data.customer_phone },
        { label: "Nama", value: data.customer_name },
        {
            label: "Email",
            value: data.customer_email || "-",
            valueTdClassName: "break-all",
        },
        { label: "Memberships", value: data.customer_id ? "Ya" : "Tidak" },
    ];

    const totalSewa = data.bookingSelections.reduce((sum, b) => {
        return (
            sum +
            b.fields.reduce(
                (s, f) =>
                    s +
                    f.slots.reduce((x, slot) => x + Number(slot.price || 0), 0),
                0
            )
        );
    }, 0);

    const paymentDetailRows = [
        {
            label: "Biaya Sewa",
            value: `Rp ${totalSewa.toLocaleString("id-ID")}`,
        },
        { label: "Biaya Tambahan", value: "Rp 0" }, // bisa dikembangkan
        { label: "Potongan Memberships", value: "Rp 0" },
        {
            label: "Total Pembayaran",
            value: `Rp ${totalSewa.toLocaleString("id-ID")}`,
        },
        {
            label: "Telah Dibayar",
            value: data.payment_amount
                ? `Rp ${Number(data.payment_amount).toLocaleString("id-ID")}`
                : "Rp 0",
        },
        {
            label: "Sisa Pembayaran",
            value: `Rp ${(
                totalSewa - (Number(data.payment_amount) || 0)
            ).toLocaleString("id-ID")}`,
        },
    ];

    // ✅ Informasi Pembayaran
    const paymentInfoRows = [
        { label: "Tipe Pembayaran", value: data.payment_type },
        { label: "Metode Pembayaran", value: data.payment_method },
        // Bank transfer
        ...(data.payment_method === "bank_transfer"
            ? [
                  { label: "Nama Bank", value: data.bank },
                  { label: "Nomor Referensi", value: data.reference_number },
                  { label: "Nama Pengirim", value: data.sender_name },
              ]
            : []),
        // E-wallet
        ...(data.payment_method === "e_wallet"
            ? [
                  { label: "Dompet Digital", value: data.digital_wallet },
                  { label: "Nomor Referensi", value: data.reference_number },
                  { label: "Nama Pengirim", value: data.sender_name },
              ]
            : []),
        // Cash (misal, hanya pakai label Jumlah Pembayaran)
        ...(data.payment_method === "cash" ? [] : []),
        // Semua metode tetap menampilkan jumlah pembayaran
        {
            label: "Jumlah Pembayaran",
            value: data.payment_amount
                ? `Rp ${Number(data.payment_amount).toLocaleString("id-ID")}`
                : "Rp 0",
        },
        // Tanggal pembayaran kalau ada
        data.payment_date && data.payment_time
            ? {
                  label: "Tanggal Pembayaran",
                  value: `${formatWithPattern(
                      data.payment_date,
                      "cccc, dd MMMM yyyy"
                  )}, ${data.payment_time}`,
              }
            : { label: "Tanggal Pembayaran", value: "-" },
    ];

    const bookingSummaryData = data.bookingSelections.map((b) => ({
        date: b.date,
        fields: b.fields.map((f) => ({
            field_id: f.field_id,
            slots: f.slots.map((s) => ({
                timeslot_id: s.timeslot_id,
                name: s.name,
                price: Number(s.price || 0),
            })),
        })),
    }));

    return (
        <div className="flex flex-col gap-2 text-left">
            <div className="pb-4 text-xl text-secondary-500 dark:text-white font-bold uppercase">
                Ringkasan Pemesanan
            </div>
            <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/2 flex flex-col gap-8">
                    <CustomTable
                        title="Informasi Operator"
                        rows={operatorRows}
                    />
                    <CustomTable title="Informasi Venue" rows={venueRows} />

                    <BookingSummaryTable
                        bookingSelections={bookingSummaryData}
                        fields={fields}
                        readOnly
                    />
                </div>
                <div className="w-full md:w-1/2 flex flex-col gap-8">
                    <CustomTable
                        title="Informasi Konsumen"
                        rows={customerRows}
                    />
                    <CustomTable
                        title="Rincian Pembayaran"
                        rows={paymentDetailRows}
                    />
                    <CustomTable
                        title="Informasi Pembayaran"
                        rows={paymentInfoRows}
                    />
                </div>
            </div>
        </div>
    );
}
