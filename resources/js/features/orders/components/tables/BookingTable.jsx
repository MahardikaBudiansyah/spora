import React, { useState } from "react";
import Pagination from "@/components/common/Pagination";
import Table from "@/components/Common/Table";
import { formatTo08 } from "@/utils/numberPhone";
import { formatShortDate, formatDateTime } from "@/utils/date";
import { formatRupiah } from "@/utils/currency";
import { getBookingStatus } from "@/utils/attributes/bookingAttribute";
import { getInvoiceStatus } from "@/utils/attributes/invoiceAttribute";
import {
    getPaymentStatus,
    getPaymentMethod,
    getPaymentType,
} from "@/utils/attributes/paymentAttribute";

import { ChevronDown, ChevronRight, FileText, Image } from "lucide-react";
import Badge from "@/components/Common/Badge";

export default function BookingTable({
    bookings,
    onInfo = () => {},
    isVenueLevel = false,
}) {
    console.log(bookings);
    const [showPrintModal, setShowPrintModal] = useState(false);
    const [expanded, setExpanded] = useState([]);

    const toggleExpand = (id) => {
        setExpanded((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
        );
    };
    const baseColumns = [
        {
            key: "expand",
            header: "",
            render: (val, row) =>
                row ? (
                    <button onClick={() => toggleExpand(row.id)}>
                        {expanded.includes(row.id) ? (
                            <ChevronDown className="w-4 h-4 text-secondary-500 dark:text-secondary-400" />
                        ) : (
                            <ChevronRight className="w-4 h-4 text-secondary-500 dark:text-secondary-400" />
                        )}
                    </button>
                ) : null,
            className: "text-center content-center",
        },
        {
            key: "created_at",
            header: "Tanggal Pesanan",
            render: (val, row) => formatDateTime(row.created_at) || "-",
            className:
                "text-center md:content-center whitespace-nowrap mix-w-max",
        },
    ];

    const venueColumn = {
        key: "venue_name",
        header: "Venue",
        render: (val, row) => row.venue?.name || "-",
        className: "text-center md:content-center",
    };

    const bookingColumn = [
        {
            key: "order_no",
            header: "Nomor Pesanan",
            className: "content-center",
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
    ];

    const customerColumn = [
        {
            key: "name",
            header: "Nama Konsumen",
            render: (val, row) =>
                row.customers?.map((c) => c.name).join(", ") || "-",
            className: "text-left content-center truncate",
        },
        {
            key: "phone_number",
            header: "Nomor Handphone Konsumen",
            render: (val, row) =>
                row.customers
                    ?.map((c) => formatTo08(c.phone_number))
                    .join(", ") || "-",
            className: "text-center content-center",
        },
    ];

    const pricingColumn = [
        {
            key: "total_price",
            header: "Total Pembayaran",
            render: (val, row) => formatRupiah(row?.pricing?.total_bill),
            className: "text-right content-center whitespace-nowrap min-w-max",
        },
        {
            key: "paid_amount",
            header: "Sudah Dibayar",
            render: (val, row) => formatRupiah(row?.pricing?.paid_amount),
            className: "text-right content-center whitespace-nowrap min-w-max",
        },
        {
            key: "remaining_amount",
            header: "Sisa Pembayaran",
            render: (val, row) => formatRupiah(row?.pricing?.remaining_amount),
            className: "text-right content-center whitespace-nowrap min-w-max",
        },
    ];

    const statusInvoiceColumn = [
        {
            key: "invoice_status",
            header: "Status Transaksi",
            render: (val, row) => {
                const { label, color } = getInvoiceStatus(row?.invoice?.status);
                return <Badge color={color}>{label}</Badge>;
            },
            className: "text-center content-center",
        },
    ];

    const columns = [
        ...baseColumns,
        ...(isVenueLevel ? [] : [venueColumn]),
        ...bookingColumn,
        ...customerColumn,
        ...pricingColumn,
        ...statusInvoiceColumn,
    ].filter(Boolean);

    const columnDetails = [
        {
            key: "court_name",
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
            key: "time_slot_name",
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
            render: (val) => {
                const { label, color } = getPaymentMethod(val);
                return <Badge color={color}>{label}</Badge>;
            },
            className: "text-center content-center",
        },
        {
            key: "gateway_order_id",
            header: "Nomor Gateway",
            render: (val) => val || "-",
            className: "text-center content-center",
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
            className: "text-center content-center capitalize",
        },
        {
            key: "reference_no",
            header: "No Referensi",
            render: (val, row) => row.detail?.reference_no || "-",
            className: "text-center content-center truncate",
        },
        {
            key: "payer_name",
            header: "Nama Pengirim",
            render: (val, row) => row.detail?.payer_name || "-",
            className: "text-center content-center",
        },
        {
            key: "payment_date",
            header: "Tanggal Pembayaran",
            render: (val, row) => row?.detail?.payment_date || "-",
            className: "text-center content-center",
        },
        {
            key: "proof",
            header: "Bukti",
            render: (val, row) => {
                const proof = row.detail?.proof_url;
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
                            <Image className="w-5 h-5 text-primary-500" />
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
        <div className="flex flex-col">
            <Table
                columns={columns}
                data={bookings.data}
                wrapperClassName="border-none rounded-none shadow-none"
                tableClassName="text-xs my-4"
                expandedRowKeys={expanded}
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
                                                row?.pricing?.total_original,
                                            )}
                                        </td>
                                        <td className="px-4 py-2 text-right font-semibold">
                                            {formatRupiah(
                                                row?.pricing?.total_discount,
                                            )}
                                        </td>
                                        <td className="px-4 py-2 text-right font-semibold">
                                            {formatRupiah(
                                                row?.pricing?.total_bill,
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

                        <div
                            key={row.invoice.id}
                            className="flex flex-col gap-4"
                        >
                            <span className="font-semibold">
                                Nomor Transaksi: {row.invoice.invoice_no}
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
                    </div>
                )}
                emptyState={
                    <div className="text-center text-sm text-secondary-500 dark:text-secondary-400">
                        Tidak ada data.{" "}
                    </div>
                }
            />

            {bookings.links && (
                <Pagination
                    links={bookings.links}
                    meta={bookings.meta}
                    className="p-6 my-2"
                />
            )}
        </div>
    );
}
