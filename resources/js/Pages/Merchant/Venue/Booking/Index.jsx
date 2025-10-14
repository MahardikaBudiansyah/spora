import { useState } from "react";
import { Head, usePage, router, Link } from "@inertiajs/react";
import { toast } from "react-toastify";
import MerchantLayout from "@/Layouts/MerchantLayout";
import Pagination from "@/components/common/Pagination";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
} from "@/components/Common/Card";
import Table from "@/components/Common/Table";
import Button from "@/components/Common/Button";
import { formatTo08 } from "@/utils/numberPhone";
import { formatShortDate, formatDateTime } from "@/utils/date";
import { formatRupiah } from "@/utils/currency";
import { getBookingStatus } from "@/utils/bookingAttribute";
import { getInvoiceStatus } from "@/utils/invoiceAttribute";
import {
    getPaymentStatus,
    getPaymentMethod,
    getPaymentType,
} from "@/utils/paymentAttribute";
import SearchInput from "@/components/Common/SearchInput";
import { ChevronDown, ChevronRight, FileText, Image } from "lucide-react";
import Badge from "@/components/Common/Badge";

export default function Index() {
    const { bookings, venue } = usePage().props;

    const [expanded, setExpanded] = useState(null);

    const toggleExpand = (id) => {
        setExpanded((prev) => (prev === id ? null : id));
    };

    const columns = [
        {
            key: "expand",
            header: "",
            render: (val, row) => (
                <button onClick={() => toggleExpand(row.id)}>
                    {expanded === row.id ? (
                        <ChevronDown className="w-4 h-4" />
                    ) : (
                        <ChevronRight className="w-4 h-4" />
                    )}
                </button>
            ),
            className: "text-center content-center",
        },
        {
            key: "created_at",
            header: "Tanggal Pesanan",
            render: (val) => formatDateTime(val),
            className: "text-center content-center",
        },
        {
            key: "order_no",
            header: "Nomor Pesanan",
            className: "content-center",
        },
        {
            key: "name",
            header: "Nama Penyewa",
            render: (val, row) =>
                row.customers?.map((c) => c.name).join(", ") || "-",
            className: "text-center content-center truncate",
        },
        {
            key: "phone_number",
            header: "Nomor Penyewa",
            render: (val, row) =>
                row.customers
                    ?.map((c) => formatTo08(c.phone_number))
                    .join(", ") || "-",
            className: "text-center content-center",
        },
        {
            key: "total_price",
            header: "Total Tagihan",
            render: (val, row) => formatRupiah(val),
            className: "text-right content-center",
        },
        {
            key: "status",
            header: "Status Pesanan",
            render: (val) => {
                const { label, color } = getBookingStatus(val);
                return <Badge color={color}>{label}</Badge>;
            },
            className: "text-center content-center",
        },
        {
            key: "paid_amount",
            header: "Sudah Dibayar",
            render: (val, row) => formatRupiah(val),
            className: "text-right content-center",
        },
        {
            key: "remaining_amount",
            header: "Sisa Tagihan",
            render: (val, row) => formatRupiah(val),
            className: "text-right content-center",
        },
        {
            key: "invoice_status",
            header: "Status Transaksi",
            render: (val) => {
                const { label, color } = getInvoiceStatus(val);
                return <Badge color={color}>{label}</Badge>;
            },
            className: "text-center content-center",
        },
    ];

    const columnDetails = [
        {
            key: "field_name",
            header: "Nama Lapangan",
            className: "content-center",
        },
        {
            key: "booking_date",
            header: "Tanggal Main",
            render: (val) => formatShortDate(val),
            className: "text-center content-center",
        },
        {
            key: "time_slot",
            header: "Jam Main",
            className: "text-center content-center",
        },
        {
            key: "original_price",
            header: "Harga Asli",
            render: (val) => formatRupiah(val),
            className: "text-right content-center",
        },
        {
            key: "discount_amount",
            header: "Total Diskon",
            render: (val) => formatRupiah(val),
            className: "text-right content-center",
        },
        {
            key: "final_price",
            header: "Harga Akhir",
            render: (val) => formatRupiah(val),
            className: "text-right content-center",
        },
    ];

    const columnPayments = [
        {
            key: "method",
            header: "Metode",
            render: (val) => getPaymentMethod(val),
            className: "text-center content-center",
        },
        {
            key: "gateway_order_id",
            header: "Nomor Pembayran",
            render: (val) => val || "-",
            className: "text-left content-center",
        },
        {
            key: "type",
            header: "Tipe",
            render: (val) => {
                const { label, color } = getPaymentType(val);
                return <Badge color={color}>{label}</Badge>;
            },
            className: "text-center content-center",
        },
        {
            key: "amount",
            header: "Jumlah Bayar",
            render: (val) => formatRupiah(val),
            className: "text-right content-center",
        },
        {
            key: "status",
            header: "Status Pembayaran",
            render: (val) => {
                const { label, color } = getPaymentStatus(val);
                return <Badge color={color}>{label}</Badge>;
            },
            className: "text-center content-center",
        },
        {
            key: "payment_provider",
            header: "Nama Layanan",
            render: (val, row) =>
                row.detail?.provider || row.detail?.payment_provider || "-",
            className: "text-center content-center",
        },
        {
            key: "reference_no",
            header: "No Referensi",
            render: (val, row) => row.detail?.reference_no || "-",
            className: "text-left content-center",
        },
        {
            key: "payer_name",
            header: "Nama Pengirim",
            render: (val, row) => row.detail?.payer_name || "-",
            className: "text-center content-center",
        },
        {
            key: "payment_date",
            header: "Tanggal Transaksi",
            render: (val, row) =>
                formatDateTime(row.detail?.payment_date) || "-",

            className: "text-center content-center",
        },
        {
            key: "proof",
            header: "Bukti",
            render: (val, row) => {
                const proof = row.detail?.proof || row.detail?.proof_of_payment;
                if (!proof) return "-";

                const isImage = /\.(jpg|jpeg|png)$/i.test(proof);
                return (
                    <a
                        href={proof}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex justify-center"
                    >
                        {isImage ? (
                            <Image className="w-5 h-5 text-blue-500" />
                        ) : (
                            <FileText className="w-5 h-5 text-red-500" />
                        )}
                    </a>
                );
            },
            className: "text-center content-center",
        },
    ];

    return (
        <MerchantLayout>
            <Head title={`Booking - ${venue.name}`} />
            <Card className="flex flex-col h-full rounded-lg shadow-none dark:border-none">
                <CardHeader>
                    <div className="flex flex-row justify-between items-center p-4">
                        <div className="font-bold uppercase text-lg">
                            Booking Lapangan {venue.name}
                        </div>
                    </div>
                </CardHeader>
                <CardBody className="px-0">
                    <div className="flex flex-row gap-4 items-center font-bold">
                        <div className="flex flex-row gap-2">
                            <span>Total Booking:</span>
                            {/* <span>{totals.total_transactions}</span> */}
                        </div>
                        <div className="flex flex-row gap-2">
                            <span>Total Booking (Tunai):</span>
                            {/* <span>{totals.total_transactions}</span> */}
                        </div>
                        <div className="flex flex-row gap-2">
                            <span>Total Booking (Transfer Langsung):</span>
                            {/* <span>{totals.total_transactions}</span> */}
                        </div>
                        <div className="flex flex-row gap-2">
                            <span>Total Booking (Midtrans):</span>
                            {/* <span>{totals.total_transactions}</span> */}
                        </div>
                        <div className="flex flex-row gap-2">
                            <span>Total Tagihan:</span>
                            {/* <span>{formatRupiah(totals.total_income)}</span> */}
                        </div>
                        <div className="flex flex-row gap-2">
                            <span>Total Dibayar:</span>
                            {/* <span>{formatRupiah(totals.total_income)}</span> */}
                        </div>
                        <div className="flex flex-row gap-2">
                            <span>Total Sisa Tagihan:</span>
                            {/* <span>{formatRupiah(totals.total_unpaid)}</span> */}
                        </div>
                    </div>
                    <div className="flex flex-row gap-2 justify-between py-4 px-8">
                        <div className="flex flex-row gap-2">
                            <SearchInput />
                            <Button
                                variant="primary"
                                size="xs"
                                className="gap-2"
                            >
                                Semua Status Pesanan
                                <ChevronDown className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="primary"
                                size="xs"
                                className="gap-2"
                            >
                                Semua Status Transaksi
                                <ChevronDown className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="flex flex-row gap-2">
                            <Button
                                variant="primary"
                                size="xs"
                                onClick={() =>
                                    router.get(
                                        route(
                                            "merchant.venues.bookings.create",
                                            {
                                                venue: venue.slug,
                                            }
                                        )
                                    )
                                }
                            >
                                + Buat Pesanan
                            </Button>
                            <Button variant="primary" size="xs">
                                Cetak Laporan Booking
                            </Button>
                        </div>
                    </div>
                    <Table
                        columns={columns}
                        data={bookings.data}
                        wrapperClassName="border-none rounded-none shadow-none"
                        tableClassName="text-xs"
                        expandedRowKeys={[expanded]}
                        renderExpandRow={(row) => (
                            <div
                                className="pr-8 pl-14 pt-4 pb-8 flex flex-col gap-4 bg-white dark:bg-secondary-900 border-b-2 border-b-secondary-200 dark:border-secondary-700
                            "
                            >
                                <div className="flex flex-col gap-4">
                                    <span className="font-semibold">
                                        Detail Pesanan: {row.order_no}
                                    </span>
                                    <Table
                                        columns={columnDetails}
                                        data={row.details}
                                        wrapperClassName="shadow-sm"
                                        tableClassName="text-xs"
                                        footer={
                                            <tr className="bg-secondary-50 dark:bg-secondary-900 border-t border-secondary-100 dark:border-secondary-700 text-xs">
                                                <td
                                                    colSpan={3}
                                                    className="text-right font-semibold pr-4"
                                                ></td>
                                                <td className="px-4 py-2 text-right font-semibold">
                                                    {formatRupiah(
                                                        row.total_original_price
                                                    )}
                                                </td>
                                                <td className="px-4 py-2 text-right font-semibold">
                                                    {formatRupiah(
                                                        row.total_discount
                                                    )}
                                                </td>
                                                <td className="px-4 py-2 text-right font-semibold">
                                                    {formatRupiah(
                                                        row.total_price
                                                    )}
                                                </td>
                                            </tr>
                                        }
                                        emptyState={
                                            <div className="text-center text-sm text-gray-500">
                                                Tidak ada detail pesanan
                                            </div>
                                        }
                                    />
                                </div>
                                {row.invoice && (
                                    <div
                                        key={row.invoice.id}
                                        className="flex flex-col gap-4"
                                    >
                                        <span className="font-semibold">
                                            Nomor Transaksi:{" "}
                                            {row.invoice.invoice_no}
                                        </span>
                                        <Table
                                            columns={columnPayments}
                                            data={row.invoice.payments || []}
                                            wrapperClassName="shadow-sm"
                                            tableClassName="text-xs"
                                            emptyState={
                                                <div className="text-center text-sm text-gray-500">
                                                    Tidak ada detail invoice
                                                </div>
                                            }
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                        emptyState={
                            <div className="text-center text-sm text-secondary-600 dark:text-secondary-400">
                                Tidak ada data.{" "}
                                <Link
                                    href={route(
                                        "merchant.venues.bookings.create",
                                        {
                                            venue: venue.slug,
                                        }
                                    )}
                                    className="text-secondary-900 hover:underline dark:text-primary-400 font-semibold"
                                >
                                    Booking sekarang!
                                </Link>
                            </div>
                        }
                    />
                    <Pagination
                        links={bookings.links}
                        meta={bookings}
                        className="p-6 my-2"
                    />
                </CardBody>
                <CardFooter className="my-8 p-8 flex justify-end gap-2">
                    <Button
                        variant="light"
                        type="button"
                        onClick={() =>
                            router.get(route("merchant.venues.index"))
                        }
                    >
                        Kembali ke Venue
                    </Button>
                </CardFooter>
            </Card>
        </MerchantLayout>
    );
}
