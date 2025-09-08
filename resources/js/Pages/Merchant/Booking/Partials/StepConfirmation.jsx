import CustomTable from "@/components/Common/CustomTable";
import BookingSummaryTable from "@/Pages/Merchant/Booking/Partials/BookingSummaryTable";
import { formatWithPattern } from "@/utils/date";

export default function StepConfirmation({ data, venue, fields }) {
    // ✅ Informasi Venue
    const venueRows = [
        { label: "Nama Venue", value: venue?.name },
        { label: "Lokasi Venue", value: venue?.address },
        { label: "Kontak", value: venue?.phone },
    ];

    // ✅ Data Konsumen
    const customerRows = [
        { label: "Nomor Handphone", value: data.customer_phone },
        { label: "Nama", value: data.customer_name },
        {
            label: "Email",
            value: data.customer_email,
            valueTdClassName: "break-all",
        },
        { label: "Memberships", value: data.customer_id ? "Ya" : "Tidak" },
    ];

    // ✅ Rincian Pembayaran (contoh: total diambil dari bookingSelections)
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
        { label: "Nama Bank", value: data.bank },
        { label: "Dompet Digital", value: data.digital_wallet },
        { label: "Nomor Referensi", value: data.reference_number },
        { label: "Nama Pengirim", value: data.sender_name },
        {
            label: "Jumlah Pembayaran",
            value: data.payment_amount
                ? `Rp ${Number(data.payment_amount).toLocaleString("id-ID")}`
                : "Rp 0",
        },
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

    // ✅ Konversi bookingSelections → data untuk BookingSummaryTable
    const bookingSummaryData = data.bookingSelections.flatMap((b) =>
        b.fields.flatMap((f) => {
            const field = fields.find((fld) => fld.id === f.field_id);
            return f.slots.map((s) => ({
                date: b.date,
                fieldName: field?.name ?? "Lapangan",
                timeslot: s.name,
                price: Number(s.price || 0),
            }));
        })
    );

    return (
        <div className="flex flex-col gap-2 text-left">
            <div className="pb-4 text-xl text-secondary-500 dark:text-white font-bold uppercase">
                Ringkasan Pemesanan
            </div>
            <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/2 flex flex-col gap-8">
                    <CustomTable title="Informasi Venue" rows={venueRows} />
                    {/* ✅ Ganti dengan BookingSummaryTable */}
                    <BookingSummaryTable
                        bookingSelections={bookingSummaryData}
                    />
                </div>
                <div className="w-full md:w-1/2 flex flex-col gap-8">
                    <CustomTable
                        title="Informasi Konsumen"
                        rows={customerRows}
                        showEdit={true}
                    />
                    <CustomTable
                        title="Rincian Pembayaran"
                        rows={paymentDetailRows}
                    />
                    <CustomTable
                        title="Informasi Pembayaran"
                        rows={paymentInfoRows}
                        showEdit={true}
                    />
                </div>
            </div>
        </div>
    );
}
