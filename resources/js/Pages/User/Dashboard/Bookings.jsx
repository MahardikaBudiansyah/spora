import React, { useState } from "react";
import { router } from "@inertiajs/react";
import Dashboard from "@/Pages/User/Dashboard/Dashboard";
import Button from "@/components/Common/Button";
import ContentCard from "@/components/cards/ContentCard";
import { getBookingStatus } from "@/utils/attributes/bookingAttribute";
import { getInvoiceStatus } from "@/utils/attributes/invoiceAttribute";
import { formatFullDateTimeWithDay, formatDate } from "@/utils/date";
import { formatRupiah } from "@/utils/currency";
import Badge from "@/components/common/Badge";
import {
    FileText,
    RectangleEllipsis,
    ChevronDown,
    ChevronUp,
    CalendarDays,
    MapPin,
    Copy,
    EllipsisVertical,
} from "lucide-react";
import Pagination from "@/components/Common/Pagination";
import BannerAlert from "@/components/Common/BannerAlert";
import { formatDistrictCity } from "@/utils/address";
import { toast } from "react-toastify";
import { RiWhatsappLine } from "react-icons/ri";
import { formatTo08 } from "@/utils/numberPhone";
import useModal from "@/hooks/useModal";
import DevelopmentPlaceholder from "@/components/Common/DevelopmentPlaceholder";
import { useUserPayment } from "@/features/orders/hooks/useUserPayment";

const Bookings = ({ bookings, className = "" }) => {
    const { data: bookingList, links, meta } = bookings;
    console.log(bookings);
    const [expandedId, setExpandedId] = useState(null);
    const { isOpen, open, close } = useModal();

    if (!bookingList?.length) {
        return (
            <div className="p-20 text-center bg-white dark:bg-secondary-800 rounded-xl border border-dashed border-secondary-300">
                <p className="text-secondary-500">
                    Belum ada riwayat booking lapangan.
                </p>
            </div>
        );
    }

    const { getPaymentToken } = useUserPayment();

    const handleAction = (type, booking) => {
        const routes = {
            // invoice: route("user.bookings.invoice", booking.slug),
            rebook: route("venues.show", booking.venue?.slug),
        };

        if (type === "payment") {
            getPaymentToken(
                booking.slug,
                "user.bookings.payment_token",
                "bookings",
            );
        } else if (routes[type]) {
            router.visit(routes[type]);
        }
    };

    return (
        <section className={`${className} space-y-6`}>
            <header className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-secondary-800 dark:text-white">
                    Riwayat Booking Lapangan
                </h2>
            </header>

            <div className="flex flex-col gap-6">
                {bookingList.map((booking) => {
                    const statusAttr = getBookingStatus(booking.status);
                    const isExpanded = expandedId === booking.id;
                    const invoice_status = booking.invoice_status
                        ? getInvoiceStatus(booking.invoice_status)
                        : null;
                    const { total_bill, total_original, paid_amount } =
                        booking.pricing;

                    const renderActions = (
                        <div className="flex w-full justify-end items-center gap-4">
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg font-black text-green-600 dark:text-green-400">
                                        {formatRupiah(total_bill)}
                                    </span>
                                    {total_bill < total_original && (
                                        <span className="text-xs line-through text-secondary-400 italic">
                                            {formatRupiah(total_original)}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {booking.invoice_status === "partial" && (
                                    <Button
                                        variant="info"
                                        size="xs"
                                        onClick={() =>
                                            open("PaymentDetailModal")
                                        }
                                    >
                                        Rincian Pembayaran
                                    </Button>
                                )}
                                {(booking.invoice_status === "unpaid" ||
                                    booking.invoice_status === "partial") && (
                                    <Button
                                        variant="emerald"
                                        size="xs"
                                        onClick={() =>
                                            handleAction("payment", booking)
                                        }
                                    >
                                        {booking.invoice_status === "unpaid"
                                            ? "Bayar Sekarang"
                                            : "Pelunasan"}
                                    </Button>
                                )}
                                {booking.invoice_status === "paid" && (
                                    <Button
                                        variant="primary"
                                        size="xs"
                                        onClick={() =>
                                            handleAction("invoice", booking)
                                        }
                                    >
                                        Cetak Invoice
                                    </Button>
                                )}
                                {booking.invoice_status === "unpaid" && (
                                    <Button
                                        variant="danger"
                                        size="xs"
                                        onClick={() =>
                                            handleAction("invoice", booking)
                                        }
                                    >
                                        Batalkan Pesanan
                                    </Button>
                                )}
                                {booking.status === "completed" &&
                                    !booking.has_review && (
                                        <Button
                                            variant="emerald"
                                            size="xs"
                                            onClick={() => open("ReviewModal")}
                                        >
                                            Isi Testimoni
                                        </Button>
                                    )}
                                {booking.invoice_status === "paid" && (
                                    <Button
                                        variant="sky"
                                        size="xs"
                                        onClick={() =>
                                            handleAction("rebook", booking)
                                        }
                                    >
                                        Pesan Lagi
                                    </Button>
                                )}

                                <Button
                                    variant="ghost"
                                    size="xs"
                                    className="p-1 hover:bg-transparent"
                                >
                                    <EllipsisVertical className="w-4 h-4 text-secondary-500 dark:text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-500" />
                                </Button>
                            </div>
                        </div>
                    );

                    const title = (
                        <div className="flex items-center gap-2">
                            <span>{booking.order_no}</span>
                            <Button
                                variant="ghost"
                                size="xs"
                                className="h-8 w-8 p-0"
                                onClick={() => {
                                    if (booking.order_no) {
                                        navigator.clipboard.writeText(
                                            booking.order_no,
                                        );
                                        toast.success(
                                            "Nomor Pesanan berhasil disalin ke clipboard",
                                            {
                                                position: "bottom-center",
                                                autoClose: 3000,
                                                hideProgressBar: true,
                                                theme: "colored",
                                            },
                                        );
                                    }
                                }}
                                tooltip="Salin Nomor Pesanan"
                            >
                                <Copy size={14} />
                            </Button>
                        </div>
                    );

                    const headerAction = (
                        <div className="flex items-center gap-2">
                            {invoice_status === "paid" && (
                                <Badge color={statusAttr.color}>
                                    {statusAttr.label}
                                </Badge>
                            )}
                            <Badge color={invoice_status.color}>
                                {invoice_status.label}
                            </Badge>
                        </div>
                    );

                    return (
                        <ContentCard
                            key={booking.id}
                            title={title}
                            icon={FileText}
                            variant="plain"
                            action={headerAction}
                            footer={renderActions}
                            bodyClassName="p-4"
                        >
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex flex-col gap-3 shrink-0">
                                    <img
                                        src={booking.venue.image}
                                        alt={booking.venue.name}
                                        className="w-full md:w-48 h-28 object-cover rounded-lg shadow-sm border border-secondary-100 dark:border-secondary-700"
                                    />
                                    <div className="flex items-center gap-2">
                                        <RectangleEllipsis className="w-4 h-4 text-primary-500" />
                                        <span className="font-bold">
                                            {booking.venue.name}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <RiWhatsappLine className="w-4 h-4 text-primary-500" />
                                        <span className="font-medium">
                                            {formatTo08(
                                                booking.venue.phone_number,
                                            )}
                                        </span>
                                    </div>
                                    {booking?.venue?.short_address && (
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-primary-500" />
                                            <span className="text-[12px] leading-relaxed">
                                                {formatDistrictCity(
                                                    booking.venue.short_address,
                                                )}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Section Kanan: Detail Slot */}
                                <div className="flex-1 flex flex-col gap-3">
                                    <div className="text-xs text-secondary-500 dark:text-secondary-400 flex items-center gap-1">
                                        <CalendarDays size={14} /> Dipesan pada{" "}
                                        {formatFullDateTimeWithDay(
                                            booking.created_at,
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        {(isExpanded
                                            ? booking.details
                                            : booking.details.slice(0, 1)
                                        ).map((detail) => (
                                            <div
                                                key={detail.id}
                                                className="flex justify-between items-center p-3 rounded-lg bg-secondary-50 dark:bg-secondary-900/50 border border-secondary-100 dark:border-secondary-800 text-xs"
                                            >
                                                <div className="flex flex-col md:flex-row gap-1 md:gap-2">
                                                    <span className="font-bold text-primary-600 dark:text-primary-500">
                                                        {detail.court_name}
                                                    </span>
                                                    <span className="text-secondary-500 dark:text-secondary-400 hidden md:block">
                                                        |
                                                    </span>
                                                    <div className="space-x-2">
                                                        <span>
                                                            {formatDate(
                                                                detail.booking_date,
                                                            )}
                                                        </span>
                                                        <span className="text-secondary-500 dark:text-secondary-400">
                                                            |
                                                        </span>
                                                        <span className="font-medium">
                                                            {
                                                                detail.time_slot_name
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                                <span className="font-bold text-secondary-700 dark:text-secondary-300">
                                                    {formatRupiah(
                                                        detail.final_price,
                                                    )}
                                                </span>
                                            </div>
                                        ))}

                                        {booking.details.length > 1 && (
                                            <button
                                                onClick={() =>
                                                    setExpandedId(
                                                        isExpanded
                                                            ? null
                                                            : booking.id,
                                                    )
                                                }
                                                className="text-xs font-bold text-primary-500 hover:text-primary-600 flex items-center gap-1 mt-1 px-1"
                                            >
                                                {isExpanded ? (
                                                    <>
                                                        <ChevronUp size={14} />{" "}
                                                        Sembunyikan jadwal sesi
                                                    </>
                                                ) : (
                                                    <>
                                                        <ChevronDown
                                                            size={14}
                                                        />{" "}
                                                        Lihat{" "}
                                                        {booking.details
                                                            .length - 1}{" "}
                                                        jadwal sesi lainnya
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>

                                    {paid_amount > 0 &&
                                        paid_amount < total_bill && (
                                            <BannerAlert
                                                type="warning"
                                                showIcon={false}
                                                size="xs"
                                            >
                                                <span className="text-xs">
                                                    <strong>Catatan: </strong>
                                                    Pembayaran DP sebesar{" "}
                                                    <strong>
                                                        {formatRupiah(
                                                            paid_amount,
                                                        )}{" "}
                                                    </strong>
                                                    telah diverifikasi. Silakan
                                                    lunasi sebelum hari H.
                                                </span>
                                            </BannerAlert>
                                        )}
                                </div>
                            </div>
                        </ContentCard>
                    );
                })}
            </div>

            <div className="flex justify-center mt-10">
                <Pagination
                    links={links}
                    meta={meta}
                    onNavigate={(url) =>
                        url && router.visit(url, { preserveScroll: true })
                    }
                />
            </div>
            <DevelopmentPlaceholder
                title={`Cetak PaymentDetailModal`}
                show={isOpen("PaymentDetailModal")}
                onClose={close}
            />
            <DevelopmentPlaceholder
                title={`Cetak ReviewModal`}
                show={isOpen("ReviewModal")}
                onClose={close}
            />
        </section>
    );
};

Bookings.layout = (page) => (
    <Dashboard
        auth={page.props.auth}
        profileIncomplete={page.props.profileIncomplete}
    >
        {page}
    </Dashboard>
);

export default Bookings;
