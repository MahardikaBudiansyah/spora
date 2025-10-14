import React, { useState } from "react";
import Button from "@/components/Common/Button";
import {
    Card,
    CardBody,
    CardFooter,
    CardHeader,
} from "@/components/Common/Card";
import { getBookingStatus } from "@/utils/bookingAttribute";
import { getInvoiceStatus } from "@/utils/invoiceAttribute";
import { formatFullDate, formatShortDate } from "@/utils/date";
import { formatRupiah } from "@/utils/currency";
import Badge from "@/components/common/Badge";
import { FileText, RectangleEllipsis } from "lucide-react";
import Pagination from "@/components/Common/Pagination";

export default function BookingHistory({
    bookings,
    pagination,
    meta,
    className = "",
}) {
    if (!bookings || bookings.length === 0) {
        return <p>Belum ada riwayat booking.</p>;
    }

    const [expandedId, setExpandedId] = useState(null);

    /**
     * Helper untuk menentukan label tombol berdasarkan status invoice
     */
    const getPaymentButtonLabel = (status) => {
        const map = {
            unpaid: "Bayar Sekarang",
            partial: "Bayar Lunas (DP)",
            paid: "Pesan Lagi dari Venue Ini",
        };
        return map[status] || null;
    };
    /**
     * Tentukan tombol-tombol aksi yang ditampilkan di setiap card booking
     */
    const getCardActions = (booking) => {
        const actions = [];
        const invoice = booking.invoice;
        if (!invoice) return actions;

        const label = getPaymentButtonLabel(invoice.status);

        if (invoice.status === "unpaid" || invoice.status === "partial") {
            actions.push({ label, type: "payment" });
        } else if (invoice.status === "paid") {
            actions.push({ label, type: "rebook" });
        }

        if (booking.status === "completed" && !booking.has_review) {
            actions.push({ label: "Isi Testimoni", type: "review" });
        }

        return actions;
    };

    /**
     * Handler klik tombol aksi
     */
    const handleAction = (action, booking) => {
        switch (action.type) {
            case "payment":
                window.location.href = route(
                    "user.booking.payment",
                    booking.id
                );
                break;
            case "review":
                window.location.href = route("user.booking.review", booking.id);
                break;
            case "rebook":
                window.location.href = route("venue.show", booking.venue_id);
                break;
            default:
                break;
        }
    };

    const handleNavigate = (url) => {
        if (url) Inertia.visit(url, { preserveScroll: true });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium">
                    Riwayat Booking Lapangan
                </h2>
            </header>

            <div className="mt-6 flex flex-col gap-6">
                {bookings.map((booking) => {
                    const { label, color } = getBookingStatus(booking.status);
                    const isExpanded = expandedId === booking.id;
                    const visibleDetails = isExpanded
                        ? booking.details
                        : booking.details.slice(0, 2);

                    const invoice = booking.invoice;
                    const invoiceInfo = invoice
                        ? getInvoiceStatus(invoice.status)
                        : null;

                    return (
                        <Card
                            key={booking.id}
                            id={`order-${
                                booking.invoice?.invoice_no || booking.id
                            }`}
                            className="py-6 px-4 border rounded-lg shadow-md hover:bg-gray-50 dark:hover:bg-secondary-800 transition"
                        >
                            {/* HEADER */}
                            <CardHeader className="flex flex-col gap-2 border-none">
                                <div className="flex items-center gap-2">
                                    <div className="font-bold">
                                        {booking.order_no}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        {formatShortDate(booking.created_at)}
                                    </div>

                                    {/* Status Booking */}
                                    <Badge color={color} className="font-bold">
                                        {label}
                                    </Badge>
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                    {/* Invoice info hanya jika bukan unpaid */}
                                    {invoice && invoice.status !== "unpaid" && (
                                        <>
                                            <FileText className="w-5 h-5" />
                                            <div className="uppercase font-semibold text-gray-700 dark:text-gray-300">
                                                {invoice.invoice_no}
                                            </div>
                                            <Badge color={invoiceInfo.color}>
                                                {invoiceInfo.label}
                                            </Badge>
                                        </>
                                    )}
                                </div>
                            </CardHeader>

                            {/* BODY */}
                            <CardBody className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <RectangleEllipsis className="w-5 h-5" />
                                    <div className="font-bold">
                                        {booking.venue.name}
                                    </div>
                                </div>
                                <div className="flex flex-row gap-3">
                                    {/* Gambar venue */}
                                    <div>
                                        <img
                                            src={
                                                booking.venue.featured_image
                                                    ? `/storage/${booking.venue.featured_image.image_path}`
                                                    : "/assets/images/field-default.jpg"
                                            }
                                            alt={booking.venue.name}
                                            className="w-48 h-24 object-cover rounded-md"
                                        />
                                    </div>

                                    {/* Detail booking */}
                                    <div className="w-full flex flex-col gap-2">
                                        {visibleDetails.map((detail) => (
                                            <div
                                                key={detail.id}
                                                className="px-4 py-2 flex justify-between items-center border-l-4 
                                            bg-primary-200 dark:bg-primary-800 
                                            border-primary-700 dark:border-primary-900 
                                            hover:bg-primary-300 dark:hover:bg-primary-900 
                                            rounded-md transition"
                                            >
                                                <div className="space-x-2">
                                                    <span className="font-bold">
                                                        {detail.field.name}
                                                    </span>
                                                    <span>
                                                        {formatShortDate(
                                                            detail.booking_date
                                                        )}
                                                        ,
                                                    </span>
                                                    <span>
                                                        {detail.time_slot.name}
                                                    </span>
                                                </div>
                                                <div className="font-semibold">
                                                    {formatRupiah(
                                                        detail.final_price
                                                    )}
                                                </div>
                                            </div>
                                        ))}

                                        {/* Expand/collapse detail */}
                                        {booking.details.length > 2 && (
                                            <button
                                                onClick={() =>
                                                    setExpandedId(
                                                        isExpanded
                                                            ? null
                                                            : booking.id
                                                    )
                                                }
                                                className="text-sm text-primary-500 hover:text-primary-600 hover:font-bold self-start ml-5"
                                            >
                                                {isExpanded
                                                    ? "Sembunyikan"
                                                    : `Lihat ${
                                                          booking.details
                                                              .length - 2
                                                      } slot/jam lainnya`}
                                            </button>
                                        )}

                                        {/* Total harga */}
                                        <div className="px-4 flex flex-col text-right mt-2">
                                            <div className="flex flex-row justify-end gap-2">
                                                <span className="font-bold">
                                                    Total Sewa Lapangan
                                                </span>
                                                {booking.total_price !==
                                                    booking.total_original_price && (
                                                    <span className="line-through text-gray-400">
                                                        {formatRupiah(
                                                            booking.total_original_price
                                                        )}
                                                    </span>
                                                )}
                                                <span className="font-bold text-green-600 dark:text-green-400">
                                                    {formatRupiah(
                                                        booking.total_price
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardBody>

                            {/* FOOTER (Tombol Aksi) */}
                            <CardFooter className="flex gap-2 justify-end items-center border-none">
                                {getCardActions(booking).map((action, idx) => (
                                    <Button
                                        key={idx}
                                        variant="primary"
                                        onClick={() =>
                                            handleAction(action, booking)
                                        }
                                    >
                                        {action.label}
                                    </Button>
                                ))}
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>

            {/* PAGINATION */}
            <div className="my-8">
                <Pagination
                    links={pagination}
                    meta={meta}
                    onNavigate={handleNavigate}
                    className="justify-center"
                />
            </div>
        </section>
    );
}
