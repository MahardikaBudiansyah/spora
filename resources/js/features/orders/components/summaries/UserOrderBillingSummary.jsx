import React, { useState } from "react";
import {
    Wallet,
    ChevronDown,
    ChevronRight,
    TriangleAlert,
    Tag,
    Tags,
} from "lucide-react";
import { formatRupiah } from "@/utils/currency";
import { formatFullDate } from "@/utils/date";
import ContentCard from "@/components/cards/ContentCard";
import DescriptionItem from "@/components/Common/DescriptionItem";
import BannerAlert from "@/components/Common/BannerAlert";

export default function UserOrderBillingSummary({
    mode = "booking",
    allSlots = [],
    selectedSlots = [],
    summary = { original_total: 0, final_total: 0, items: [] },
    grossAmount = 0,
    selectedPaymentType = "full_payment",
    membershipBenefit = null,
    earliestDate = null,
}) {
    const [showDetails, setShowDetails] = useState(false);

    const selectedItems = allSlots.filter((slot) =>
        selectedSlots.includes(slot.id || slot.cart_id),
    );
    const displayItems = summary?.items || [];

    const remainingAmount = Math.max(0, summary.final_total - grossAmount);

    const benefitDetails = membershipBenefit?.membership_benefit;

    const currentRemainingQuota = benefitDetails?.remaining_quota ?? 0;

    const discountedItemsCount = displayItems.filter(
        (i) => Number(i.discount_amount) > 0,
    ).length;

    const estimatedNextQuota = Math.max(
        0,
        currentRemainingQuota - discountedItemsCount,
    );

    const policy = summary?.policy;

    const dpValue = policy ? Math.round(policy.dp_value) : 0;

    const dpLabel =
        selectedPaymentType === "down_payment" && policy
            ? `Telah Dibayar (DP ${dpValue}${policy.dp_type === "percentage" ? "%" : ""})`
            : "Telah Dibayar";

    return (
        <ContentCard
            variant="plain"
            title="Rincian Biaya"
            icon={Wallet}
            className="shadow-none"
        >
            <div className="flex flex-col gap-4">
                {mode === "booking" && selectedItems.length > 0 && (
                    <div className="flex flex-col overflow-hidden">
                        <button
                            onClick={() => setShowDetails(!showDetails)}
                            className="flex justify-between items-center group"
                        >
                            <span className="text-xs font-bold text-secondary-400 uppercase tracking-wider group-hover:text-primary-500">
                                Rincian Order ({selectedItems.length} Sesi)
                            </span>
                            <div className="text-secondary-400 group-hover:text-primary-500">
                                {showDetails ? (
                                    <ChevronDown className="w-4 h-4" />
                                ) : (
                                    <ChevronRight className="w-4 h-4" />
                                )}
                            </div>
                        </button>

                        <div
                            className={` overflow-hidden pr-1 ${
                                showDetails
                                    ? "max-h-72 mt-3 overflow-y-auto custom-scrollbar"
                                    : "max-h-0"
                            }`}
                        >
                            <div className="flex flex-col gap-3 py-2">
                                {displayItems.map((slot, idx) => (
                                    <div
                                        key={slot.cart_id || idx}
                                        className="flex justify-between items-start text-sm text-left"
                                    >
                                        <div className="flex flex-col gap-0.5">
                                            <span className="font-semibold text-secondary-700 dark:text-white">
                                                {slot.court_name}
                                            </span>
                                            <span className="text-[10px] text-secondary-400 uppercase">
                                                {formatFullDate(
                                                    slot.booking_date,
                                                )}{" "}
                                                •{" "}
                                                {slot.start_time?.slice(0, 5) ||
                                                    "--:--"}{" "}
                                                -{" "}
                                                {slot.end_time?.slice(0, 5) ||
                                                    "--:--"}
                                            </span>

                                            {Number(slot.discount_amount) >
                                                0 && (
                                                <div className="flex items-center gap-1 text-[9px] font-bold text-green-600 dark:text-green-500 uppercase">
                                                    <Tag className="w-2.5 h-2.5" />
                                                    Diskon Member
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            {Number(slot.discount_amount) >
                                            0 ? (
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] line-through text-secondary-400">
                                                        {formatRupiah(
                                                            slot.original_price,
                                                        )}
                                                    </span>
                                                    <span className="text-xs font-bold text-green-600 dark:text-green-500">
                                                        {formatRupiah(
                                                            slot.final_price,
                                                        )}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-xs font-bold">
                                                    {formatRupiah(
                                                        slot.original_price,
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                <div
                    className={`space-y-3 pt-2 ${mode === "booking" ? "border-t border-secondary-100 dark:border-secondary-500" : ""}`}
                >
                    <DescriptionItem
                        layout="horizontal"
                        label={
                            mode === "booking"
                                ? "Total Harga Sewa"
                                : "Harga Paket"
                        }
                        value={formatRupiah(summary.original_total)}
                    />

                    {mode === "booking" &&
                        membershipBenefit &&
                        benefitDetails && (
                            <div
                                className={`p-3 rounded-lg border ${
                                    currentRemainingQuota > 0
                                        ? "bg-sky-50 dark:bg-sky-900 border-sky-100 dark:border-sky-800"
                                        : "bg-red-50 dark:bg-red-900 border-red-100 dark:border-red-800"
                                }`}
                            >
                                {currentRemainingQuota > 0 ? (
                                    <div className="flex flex-col gap-2">
                                        <div className="flex flex-col text-[10px] font-bold text-sky-700 dark:text-sky-400">
                                            <p className="uppercase tracking-wider">
                                                Benefit Member{" "}
                                                {benefitDetails.package_name}
                                            </p>
                                            <p>
                                                Masa Aktif:{" "}
                                                {formatFullDate(
                                                    benefitDetails.start_date,
                                                )}{" "}
                                                -{" "}
                                                {formatFullDate(
                                                    benefitDetails.end_date,
                                                )}
                                            </p>
                                            <span className="flex flex-row gap-2 items-center font-semibold text-green-600 dark:text-green-500">
                                                <Tag className="w-3 h-3" />
                                                <p>
                                                    Diskon{" "}
                                                    {benefitDetails.discount_type ===
                                                    "percentage"
                                                        ? `${benefitDetails.discount_value}%`
                                                        : formatRupiah(
                                                              benefitDetails.discount_value,
                                                          )}
                                                </p>
                                            </span>
                                        </div>

                                        <div className="space-y-1 pt-2 border-t border-sky-400/50 dark:border-sky-200/50 text-[10px] font-semibold">
                                            <div className="flex justify-between items-center text-green-600 dark:text-green-400">
                                                <span>Kuota:</span>
                                                <span>
                                                    {currentRemainingQuota} Slot
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center text-red-500">
                                                <span>Digunakan:</span>
                                                <span>
                                                    -{discountedItemsCount} Slot
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center pt-1 border-t border-dashed border-sky-400/50 dark:border-sky-200/50 text-sky-700 dark:text-sky-400">
                                                <span>
                                                    Estimasi Sisa Kuota:
                                                </span>
                                                <span>
                                                    {estimatedNextQuota} Slot
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-2">
                                            <DescriptionItem
                                                layout="horizontal"
                                                label={
                                                    <span className="text-sm font-bold text-green-600 dark:text-green-500 flex items-center gap-2">
                                                        <Tags className="w-4 h-4" />{" "}
                                                        Total Diskon
                                                    </span>
                                                }
                                                value={`-${formatRupiah(summary.discount_amount)}`}
                                                valueClassName="text-green-600 dark:text-green-500 font-bold text-sm"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-red-100 dark:bg-red-800 rounded-full text-red-600 dark:text-red-200">
                                            <TriangleAlert className="w-4 h-4" />
                                        </div>
                                        <div className="flex flex-col text-left">
                                            <span className="text-xs font-bold text-red-700 dark:text-red-300 uppercase">
                                                Kuota Membership Habis
                                            </span>
                                            <span className="text-[10px] text-red-600 dark:text-red-400 opacity-90">
                                                Benefit "
                                                {membershipBenefit.package_name}
                                                " sudah tidak dapat digunakan.
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                    <DescriptionItem
                        layout="horizontal"
                        label="Biaya Lainnya"
                        value={formatRupiah(0)}
                    />

                    <DescriptionItem
                        layout="horizontal"
                        label="Total Pembayaran"
                        value={formatRupiah(summary.final_total)}
                        labelClassName="font-bold text-base md:text-lg"
                        valueClassName="font-bold text-lg"
                    />

                    {/* --- BAGIAN 3: SKENARIO DP --- */}
                    {selectedPaymentType === "down_payment" && (
                        <div className="space-y-3">
                            <DescriptionItem
                                layout="horizontal"
                                label={dpLabel}
                                value={formatRupiah(grossAmount)}
                                valueClassName="text-emerald-500 dark:text-emerald-500 font-bold"
                            />
                            <div className="pt-2 border-t-2 border-dashed border-secondary-100 dark:border-secondary-500">
                                <DescriptionItem
                                    layout="horizontal"
                                    label="Sisa Pembayaran"
                                    value={formatRupiah(remainingAmount)}
                                    labelClassName="font-bold"
                                    valueClassName={`text-lg font-black ${remainingAmount > 0 ? "text-red-500 dark:text-red-500" : "text-emerald-500 dark:text-emerald-500"}`}
                                />
                                <BannerAlert
                                    type="warning"
                                    title="Pelunasan"
                                    size="xs"
                                    showIcon={false}
                                    titleClassName="text-xs font-bold"
                                >
                                    <div className="text-[10px] leading-relaxed">
                                        <p className="mb-1">
                                            Pelunasan sisa pembayaran wajib
                                            dilakukan paling lambat pada{" "}
                                            {mode === "booking"
                                                ? "hari-H sebelum jadwal dimulai"
                                                : "hari-H aktivasi"}
                                            {earliestDate && (
                                                <strong>
                                                    {" "}
                                                    (
                                                    {formatFullDate(
                                                        earliestDate,
                                                    )}
                                                    )
                                                </strong>
                                            )}
                                            .
                                        </p>
                                        {/* <p className="text-red-700 font-medium italic">
                                            * DP yang sudah dibayarkan tidak
                                            dapat dikembalikan (Non-Refundable).
                                        </p> */}
                                    </div>
                                </BannerAlert>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </ContentCard>
    );
}
