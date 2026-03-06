import React, { useState } from "react";
import { router } from "@inertiajs/react";
import Dashboard from "@/Pages/User/Dashboard/Dashboard";
import Button from "@/components/Common/Button";
import ContentCard from "@/components/cards/ContentCard";
import { getMembershipOrderStatus } from "@/utils/attributes/membershipAttribute";
import { getInvoiceStatus } from "@/utils/attributes/invoiceAttribute";
import { formatFullDateTimeWithDay, formatFullDateWithDay } from "@/utils/date";
import { formatDiscount, formatRupiah } from "@/utils/currency";
import Badge from "@/components/common/Badge";
import {
    FileText,
    RectangleEllipsis,
    ChevronDown,
    CalendarDays,
    MapPin,
    Copy,
    EllipsisVertical,
    Tag,
    Calendar,
    ChevronRight,
    CheckCircle,
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

const Memberships = ({ membershipOrders, className = "" }) => {
    const { data: membershipOrderList, links, meta } = membershipOrders;

    const { isOpen, open, close } = useModal();

    if (!membershipOrderList?.length) {
        return (
            <div className="p-20 text-center bg-white dark:bg-secondary-800 rounded-xl border border-dashed border-secondary-300">
                <p className="text-secondary-500">
                    Belum ada riwayat pesanan membership.
                </p>
            </div>
        );
    }

    const { getPaymentToken } = useUserPayment();

    const handleAction = (type, membership) => {
        const routes = {
            // invoice: route("user.memberships.invoice", membership.slug),
            rebook: route("venues.show", membership.venue?.slug),
        };

        if (type === "payment") {
            getPaymentToken(
                booking.slug,
                "user.memberships.payment_token",
                "memberships",
            );
        } else if (routes[type]) {
            router.visit(routes[type]);
        }
    };

    return (
        <section className={`${className} space-y-6`}>
            <header className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-secondary-800 dark:text-white">
                    Riwayat Memberships
                </h2>
            </header>

            <div className="flex flex-col gap-6">
                {membershipOrderList.map((membershipOrder) => {
                    const membershipOrderStatus = getMembershipOrderStatus(
                        membershipOrder.status,
                    );
                    const [isOpen, setIsOpen] = useState(true);

                    const packageInfo = membershipOrder?.package;
                    const discountInfo = packageInfo?.discount;
                    const hasDiscount = discountInfo && discountInfo.value > 0;

                    const invoice_status = membershipOrder.invoice_status
                        ? getInvoiceStatus(membershipOrder.invoice_status)
                        : null;
                    const { total_bill, paid_amount } = membershipOrder.pricing;

                    const renderActions = (
                        <div className="flex flex-wrap w-full justify-end items-center gap-4">
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg font-black text-green-600 dark:text-green-400">
                                        {formatRupiah(total_bill)}
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {membershipOrder.invoice_status ===
                                    "partial" && (
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
                                {(membershipOrder.invoice_status === "unpaid" ||
                                    membershipOrder.invoice_status ===
                                        "partial") && (
                                    <Button
                                        variant="emerald"
                                        size="xs"
                                        onClick={() =>
                                            handleAction(
                                                "payment",
                                                membershipOrder,
                                            )
                                        }
                                    >
                                        {membershipOrder.invoice_status ===
                                        "unpaid"
                                            ? "Bayar Sekarang"
                                            : "Pelunasan"}
                                    </Button>
                                )}
                                {membershipOrder.invoice_status === "paid" && (
                                    <Button
                                        variant="primary"
                                        size="xs"
                                        onClick={() =>
                                            handleAction(
                                                "invoice",
                                                membershipOrder,
                                            )
                                        }
                                    >
                                        Cetak Invoice
                                    </Button>
                                )}
                                {membershipOrder.invoice_status ===
                                    "unpaid" && (
                                    <Button
                                        variant="danger"
                                        size="xs"
                                        onClick={() =>
                                            handleAction(
                                                "invoice",
                                                membershipOrder,
                                            )
                                        }
                                    >
                                        Batalkan Pesanan
                                    </Button>
                                )}
                                {membershipOrder.status === "active" &&
                                    membershipOrder.invoice_status === "paid" &&
                                    !membershipOrder.has_review && (
                                        <Button
                                            variant="emerald"
                                            size="xs"
                                            onClick={() => open("ReviewModal")}
                                        >
                                            Isi Testimoni
                                        </Button>
                                    )}
                                {membershipOrder.invoice_status === "paid" && (
                                    <Button
                                        variant="sky"
                                        size="xs"
                                        onClick={() =>
                                            handleAction(
                                                "rebook",
                                                membershipOrder,
                                            )
                                        }
                                    >
                                        Pesan Lagi
                                    </Button>
                                )}
                                <Button
                                    variant="ghost"
                                    size="xs"
                                    className="p-1 hover:bg-transparent focus:ring-0 focus:border-none"
                                >
                                    <EllipsisVertical className="w-4 h-4 text-secondary-500 dark:text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-500" />
                                </Button>
                            </div>
                        </div>
                    );

                    const title = (
                        <div className="flex items-center gap-2">
                            <span>{membershipOrder.order_no}</span>
                            <Button
                                variant="ghost"
                                size="xs"
                                className="h-8 w-8 p-0"
                                onClick={() => {
                                    if (membershipOrder.order_no) {
                                        navigator.clipboard.writeText(
                                            membershipOrder.order_no,
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
                            <Badge color={membershipOrderStatus.color}>
                                {membershipOrderStatus.label}
                            </Badge>

                            <Badge color={invoice_status.color}>
                                {invoice_status.label}
                            </Badge>
                        </div>
                    );

                    return (
                        <ContentCard
                            key={membershipOrder.id}
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
                                        src={membershipOrder.venue.image}
                                        alt={membershipOrder.venue.name}
                                        className="w-full md:w-48 h-28 object-cover rounded-lg shadow-sm border border-secondary-100 dark:border-secondary-700"
                                    />
                                    <div className="flex items-center gap-2">
                                        <RectangleEllipsis className="w-4 h-4 text-primary-500" />
                                        <span className="font-bold">
                                            {membershipOrder.venue.name}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <RiWhatsappLine className="w-4 h-4 text-primary-500" />
                                        <span className="font-medium">
                                            {formatTo08(
                                                membershipOrder.venue
                                                    .phone_number,
                                            )}
                                        </span>
                                    </div>
                                    {membershipOrder?.venue?.short_address && (
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-primary-500" />
                                            <span className="text-[12px] leading-relaxed">
                                                {formatDistrictCity(
                                                    membershipOrder.venue
                                                        .short_address,
                                                )}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 flex flex-col gap-3">
                                    <div className="text-xs text-secondary-500 dark:text-secondary-400 flex items-center gap-1">
                                        <CalendarDays size={14} /> Dipesan pada{" "}
                                        {formatFullDateTimeWithDay(
                                            membershipOrder.created_at,
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <div
                                            className="flex items-start justify-between group cursor-pointer"
                                            onClick={() => setIsOpen(!isOpen)}
                                        >
                                            <div className="flex flex-col gap-1">
                                                <h4 className="font-bold text-secondary-900 dark:text-white">
                                                    {
                                                        membershipOrder.package
                                                            .name
                                                    }
                                                </h4>
                                                <div className="flex items-center gap-2 text-secondary-500 dark:text-secondary-400 font-semibold text-xs">
                                                    <Tag className="w-3 h-3" />
                                                    Durasi{" "}
                                                    {
                                                        membershipOrder.package
                                                            .duration_months
                                                    }{" "}
                                                    Bulan
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                className="p-1 hover:bg-secondary-100 dark:hover:bg-secondary-800 rounded"
                                            >
                                                {isOpen ? (
                                                    <ChevronDown className="w-4 h-4 text-secondary-400 dark:text-secondary-300 hover:text-secondary-600 dark:hover:text-secondary-100" />
                                                ) : (
                                                    <ChevronRight className="w-4 h-4 text-secondary-400 dark:text-secondary-300 hover:text-secondary-600 dark:hover:text-secondary-100" />
                                                )}
                                            </button>
                                        </div>

                                        {isOpen && (
                                            <div className="space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
                                                <ul className="space-y-2 bg-secondary-50 dark:bg-secondary-900/50 p-3 rounded-xl">
                                                    {hasDiscount ? (
                                                        <li className="flex gap-2 items-start justify-between text-[11px] md:text-xs">
                                                            <div className="flex gap-2 items-start text-left">
                                                                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 shrink-0" />
                                                                <div className="space-x-1">
                                                                    <span>
                                                                        Diskon
                                                                    </span>
                                                                    <span className="font-bold text-emerald-500 dark:text-emerald-400">
                                                                        {formatDiscount(
                                                                            discountInfo.type,
                                                                            discountInfo.value,
                                                                        )}
                                                                    </span>
                                                                    {discountInfo.limit && (
                                                                        <span className="font-bold">
                                                                            (
                                                                            {
                                                                                discountInfo.limit
                                                                            }{" "}
                                                                            sesi)
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </li>
                                                    ) : (
                                                        <li className="text-xs font-medium text-secondary-500 dark:text-secondary-400">
                                                            Tidak ada diskon
                                                            khusus untuk paket
                                                            ini.
                                                        </li>
                                                    )}

                                                    {discountInfo?.remaining_limit !==
                                                        undefined && (
                                                        <li className="flex gap-2 items-start justify-between text-[11px] md:text-xs">
                                                            <div className="flex items-center gap-2">
                                                                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                                                                <span>
                                                                    Sisa Kuota
                                                                    Diskon:{" "}
                                                                    <strong>
                                                                        {
                                                                            discountInfo.remaining_limit
                                                                        }{" "}
                                                                        sesi
                                                                    </strong>
                                                                </span>
                                                            </div>
                                                        </li>
                                                    )}
                                                </ul>
                                            </div>
                                        )}

                                        <div className="pt-4 border-t border-secondary-100 dark:border-secondary-800">
                                            <div className="flex items-center gap-2 mb-3 text-xs font-bold text-secondary-500 dark:text-secondary-400 uppercase tracking-tight">
                                                <Calendar className="w-3 h-3" />
                                                Periode Membership
                                            </div>
                                            <div className="space-y-2">
                                                <div className="space-x-2 text-xs">
                                                    <span className="text-secondary-500 dark:text-secondary-400">
                                                        Mulai Aktif:
                                                    </span>
                                                    <span className="font-medium text-secondary-900 dark:text-white">
                                                        {formatFullDateWithDay(
                                                            membershipOrder
                                                                .period
                                                                .start_date,
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="space-x-2 text-xs">
                                                    <span className="text-secondary-500 dark:text-secondary-400">
                                                        Berakhir Pada:
                                                    </span>
                                                    <span className="font-medium text-primary-600 dark:text-primary-400">
                                                        {formatFullDateWithDay(
                                                            membershipOrder
                                                                .period
                                                                .end_date,
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
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

Memberships.layout = (page) => (
    <Dashboard
        auth={page.props.auth}
        profileIncomplete={page.props.profileIncomplete}
    >
        {page}
    </Dashboard>
);

export default Memberships;
