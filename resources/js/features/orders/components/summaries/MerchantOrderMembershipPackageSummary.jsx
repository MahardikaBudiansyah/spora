import React, { useMemo, useState } from "react";
import {
    Info,
    CheckCircle,
    ChevronDown,
    ChevronRight,
    Package,
    Tag,
} from "lucide-react";
import ContentCard from "@/components/cards/ContentCard";
import DescriptionItem from "@/components/Common/DescriptionItem";
import { formatRupiah, formatDiscount } from "@/utils/currency";
import { formatFullDateWithDay } from "@/utils/date";

export default function MerchantOrderMembershipPackageSummary({
    membershipSelection = null,
    onRemove,
}) {
    const [isOpen, setIsOpen] = useState(true);

    const benefits = useMemo(() => {
        const pkg = membershipSelection?.package;
        if (!pkg) return { discounts: [], others: [] };

        return {
            discounts: Array.isArray(pkg.discounts) ? pkg.discounts : [],
            others: Array.isArray(pkg.others) ? pkg.others : [],
        };
    }, [membershipSelection]);

    if (!membershipSelection) {
        return (
            <ContentCard title="Ringkasan Order" icon={Package}>
                <div className="py-6 flex flex-col items-center justify-center text-center">
                    <p className="text-sm text-secondary-500 italic">
                        Belum ada paket membership yang dipilih.
                    </p>
                </div>
            </ContentCard>
        );
    }

    return (
        <ContentCard
            variant="elevated"
            title="Ringkasan Order"
            icon={Package}
            className="shadow-none"
        >
            <div className="space-y-6">
                <div
                    className="flex items-start justify-between group cursor-pointer"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <div className="flex flex-col gap-1">
                        <h4 className="font-bold text-secondary-900 dark:text-white">
                            {membershipSelection?.package?.name}
                        </h4>
                        <div className="flex items-center gap-2 text-secondary-500 dark:text-secondary-400 font-semibold text-xs">
                            <Tag className="w-3.5 h-3.5" />
                            Durasi {membershipSelection.duration_months} Bulan
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

                {isOpen &&
                    (benefits.discounts.length > 0 ||
                        benefits.others.length > 0) && (
                        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="bg-emerald-50/50 dark:bg-emerald-500/5 p-4 rounded-md text-left">
                                <p className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400 mb-2 tracking-tighter">
                                    Keuntungan Paket:
                                </p>
                                <ul className="space-y-2">
                                    {/* Render List Diskon */}
                                    {benefits.discounts.map((benefit, idx) => (
                                        <li
                                            key={`disc-${idx}`}
                                            className="flex gap-2 items-start text-xs text-secondary-700 dark:text-secondary-300"
                                        >
                                            <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                            <span>
                                                Diskon{" "}
                                                {formatDiscount(
                                                    benefit.discount_type,
                                                    benefit.discount_value,
                                                )}
                                                <span className="mx-1 opacity-50">
                                                    •
                                                </span>
                                                Kuota {benefit.discount_limit}x
                                                Penggunaan
                                            </span>
                                        </li>
                                    ))}

                                    {/* Render List Benefit Lainnya (Others) */}
                                    {benefits.others.map((item, idx) => (
                                        <li
                                            key={`other-${idx}`}
                                            className="flex gap-2 items-start text-xs text-secondary-700 dark:text-secondary-300"
                                        >
                                            <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                            <span>
                                                {item.name ||
                                                    item.description ||
                                                    item}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                <div className="grid md:grid-cols-2 gap-4 pt-2 items-start text-left md:text-center">
                    <DescriptionItem
                        label="Mulai Aktif"
                        value={formatFullDateWithDay(
                            membershipSelection.start_date,
                        )}
                    />
                    <DescriptionItem
                        label="Berakhir"
                        valueClassName="text-primary-600 dark:text-primary-400 font-bold"
                        value={formatFullDateWithDay(
                            membershipSelection.end_date,
                        )}
                    />
                </div>

                <div className="pt-4 border-t border-dashed border-secondary-100 dark:border-secondary-800">
                    <div className="flex justify-between items-center bg-secondary-50 dark:bg-secondary-800/50 p-3 rounded-lg">
                        <p className="text-sm font-bold text-secondary-500 uppercase">
                            Harga Paket
                        </p>
                        <p className="text-xl font-black text-secondary-900 dark:text-white">
                            {formatRupiah(membershipSelection.price || 0)}
                        </p>
                    </div>
                </div>
            </div>
        </ContentCard>
    );
}
