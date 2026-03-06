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
import { formatWithPattern, formatFullDate } from "@/utils/date";
import ContentCard from "@/components/cards/ContentCard";
import DescriptionItem from "@/components/Common/DescriptionItem";
import BannerAlert from "@/components/Common/BannerAlert";

export default function MerchantOrderBillingSummary({
    variant = "plain",
    mode,
    displayData,
    value,
    activePolicy,
    minAmountRequired,
    remainingAmount,
}) {
    const [showDetails, setShowDetails] = useState(false);
    const paidAmount = Number(value.amount || 0);

    return (
        <ContentCard
            variant={variant}
            title="Rincian Biaya"
            icon={Wallet}
            className="shadow-none"
        >
            <div className="flex flex-col gap-4">
                {mode === "booking" && displayData.details.length > 0 && (
                    <div className="flex flex-col overflow-hidden">
                        <button
                            onClick={() => setShowDetails(!showDetails)}
                            className="flex justify-between items-center group"
                        >
                            <span className="text-xs font-bold text-secondary-400 uppercase tracking-wider group-hover:text-primary-500">
                                Rincian Order ({displayData.details.length}{" "}
                                Slot)
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
                            className={`overflow-hidden pr-1 ${showDetails ? "max-h-72 mt-3 overflow-y-auto custom-scrollbar" : "max-h-0"}`}
                        >
                            <div className="flex flex-col gap-3 py-2">
                                {displayData.details.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="flex justify-between items-start text-sm text-left"
                                    >
                                        <div className="flex flex-col gap-0.5">
                                            <span className="font-semibold">
                                                {item.court_name}
                                            </span>
                                            <span className="text-[10px] text-secondary-400 uppercase">
                                                {formatWithPattern(
                                                    item.booking_date,
                                                )}{" "}
                                                • {item.time_range}
                                            </span>
                                            {/* Label Tag Diskon per Item */}
                                            {item.discount_amount > 0 && (
                                                <div className="flex items-center gap-1 text-[9px] font-bold text-green-600 dark:text-green-500 uppercase">
                                                    <Tag className="w-2.5 h-2.5" />
                                                    Diskon Member
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            {item.discount_amount > 0 ? (
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] line-through text-secondary-400">
                                                        {formatRupiah(
                                                            item.original_price,
                                                        )}
                                                    </span>
                                                    <span className="text-xs font-bold text-green-600 dark:text-green-500">
                                                        {formatRupiah(
                                                            item.final_price,
                                                        )}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-xs font-bold">
                                                    {formatRupiah(
                                                        item.original_price,
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
                            mode === "membership"
                                ? "Harga Paket"
                                : "Total Harga Sewa"
                        }
                        value={formatRupiah(displayData.original)}
                    />

                    {mode === "booking" && value.membership_benefit && (
                        <div
                            className={`p-3 rounded-lg border ${
                                value.membership_benefit.remaining_quota > 0
                                    ? "bg-sky-50 dark:bg-sky-900 border-sky-100 dark:border-sky-800"
                                    : "bg-red-50 dark:bg-red-900 border-red-100 dark:border-red-800"
                            }`}
                        >
                            {value.membership_benefit.remaining_quota > 0 ? (
                                <div className="flex flex-col gap-2">
                                    <div className="flex flex-col gap-2 text-[10px] font-bold text-sky-700 dark:text-sky-400">
                                        <p className="uppercase tracking-wider">
                                            Benefit Member{" "}
                                            {
                                                value.membership_benefit
                                                    .package_name
                                            }
                                        </p>
                                        <p>
                                            Masa Aktif:{" "}
                                            {formatFullDate(
                                                value.membership_benefit
                                                    .start_date,
                                            )}{" "}
                                            -{" "}
                                            {formatFullDate(
                                                value.membership_benefit
                                                    .end_date,
                                            )}
                                        </p>
                                        <span className="flex flex-row gap-2 items-center font-semibold text-green-600 dark:text-green-500">
                                            <Tag className="w-3 h-3" />
                                            <p>
                                                Diskon:{" "}
                                                {value.membership_benefit
                                                    .discount_type ===
                                                "percentage"
                                                    ? `${value.membership_benefit.discount_value}%`
                                                    : formatRupiah(
                                                          value
                                                              .membership_benefit
                                                              .discount_value,
                                                      )}
                                            </p>
                                        </span>
                                    </div>

                                    <div className="space-y-1 pt-2 border-t border-sky-400/50 dark:border-sky-200/50 text-[10px] font-semibold">
                                        <div className="flex justify-between items-center text-green-600 dark:text-green-400">
                                            <span>Kuota:</span>
                                            <span>
                                                {
                                                    value.membership_benefit
                                                        .remaining_quota
                                                }{" "}
                                                Slot
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-red-500">
                                            <span>Digunakan:</span>
                                            <span>
                                                -{displayData.details.length}{" "}
                                                Slot
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center pt-1 border-t border-dashed border-sky-400/50 dark:border-sky-200/50 text-sky-700 dark:text-sky-400">
                                            <span>Estimasi Sisa Kuota:</span>
                                            <span>
                                                {Math.max(
                                                    0,
                                                    value.membership_benefit
                                                        .remaining_quota -
                                                        displayData.details
                                                            .length,
                                                )}{" "}
                                                Slot
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
                                            value={`-${formatRupiah(displayData.discount)}`}
                                            valueClassName="text-green-600 dark:text-green-500 font-bold text-sm"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-red-200 dark:bg-red-700 rounded-full text-red-600 dark:text-red-200">
                                        <TriangleAlert className="w-5 h-5" />
                                    </div>
                                    <div className="flex flex-col text-left">
                                        <span className="text-xs font-bold text-red-700 dark:text-red-200 uppercase">
                                            Kuota Membership Habis
                                        </span>
                                        <span className="text-[10px] text-red-600 dark:text-red-300 opacity-90">
                                            Benefit "
                                            {
                                                value.membership_benefit
                                                    .package_name
                                            }
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
                        label="Total Pemabayaran"
                        value={formatRupiah(displayData.final)}
                        labelClassName="font-bold text-base md:text-lg"
                        valueClassName="font-bold text-lg"
                    />

                    {value.payment_type === "down_payment" &&
                        activePolicy?.enable_dp && (
                            <BannerAlert
                                type="warning"
                                title={`Kebijakan DP (${activePolicy.dp_value}${activePolicy.dp_type === "percentage" ? "%" : ""})`}
                                showIcon={false}
                                titleClassName="text-xs text-left"
                            >
                                <p className="text-xs font-semibold text-left">
                                    Minimal bayar di awal{" "}
                                    {formatRupiah(minAmountRequired)}
                                </p>
                            </BannerAlert>
                        )}

                    <DescriptionItem
                        layout="horizontal"
                        label="Telah Dibayar (DP)"
                        value={formatRupiah(paidAmount)}
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
                    </div>
                </div>
            </div>
        </ContentCard>
    );
}
