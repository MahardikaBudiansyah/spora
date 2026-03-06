import React, { useMemo, useState } from "react";
import {
    Info,
    CheckCircle,
    ChevronDown,
    ChevronRight,
    Package,
    Tag,
} from "lucide-react";
import SummarySection from "@/components/cards/SummaryCard";
import DescriptionItem from "@/components/Common/DescriptionItem";
import { formatRupiah, formatDiscount } from "@/utils/currency";
import { formatFullDateWithDay } from "@/utils/date";

export default function OrderMembershipPackageSummary({
    membershipSelection = null,
    onRemove,
}) {
    const [isOpen, setIsOpen] = useState(true);

    const benefits = useMemo(() => {
        return membershipSelection?.package?.membership_benefit_discounts || [];
    }, [membershipSelection]);

    if (!membershipSelection) {
        return (
            <SummarySection
                title="Ringkasan Paket"
                icon={<Package className="w-4 h-4" />}
            >
                <div className="py-6 flex flex-col items-center justify-center text-center">
                    <p className="text-sm text-secondary-500 italic">
                        Belum ada paket membership yang dipilih.
                    </p>
                </div>
            </SummarySection>
        );
    }

    return (
        <SummarySection
            title="Ringkasan Paket"
            icon={<Package className="w-4 h-4" />}
        >
            <div className="space-y-6">
                <div className="flex justify-between items-start">
                    <div
                        className="space-y-1 cursor-pointer group"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <h4 className="text-lg font-black text-secondary-900 dark:text-white leading-tight group-hover:text-primary-600 transition-colors">
                            {membershipSelection.package?.name ||
                                "Paket Membership"}
                        </h4>
                        <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-semibold text-sm">
                            <Tag className="w-3.5 h-3.5" />
                            {membershipSelection.duration} Bulan Layanan
                            {isOpen ? (
                                <ChevronDown className="w-3 h-3" />
                            ) : (
                                <ChevronRight className="w-3 h-3" />
                            )}
                        </div>
                    </div>

                    {onRemove && (
                        <button
                            onClick={onRemove}
                            className="text-[10px] text-red-500 hover:text-red-700 font-bold uppercase tracking-wider border border-red-100 px-2 py-1 rounded-md hover:bg-red-50 transition-colors"
                        >
                            Ubah
                        </button>
                    )}
                </div>

                {isOpen && benefits.length > 0 && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="bg-emerald-50/50 dark:bg-emerald-500/5 p-4 rounded-xl border border-emerald-100 dark:border-emerald-500/20">
                            <p className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400 mb-2 tracking-tighter">
                                Benefit Termasuk:
                            </p>
                            <ul className="space-y-2">
                                {benefits.map((benefit, idx) => (
                                    <li
                                        key={idx}
                                        className="flex gap-2 items-start text-xs text-secondary-700 dark:text-secondary-300"
                                    >
                                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                        <span>
                                            Diskon{" "}
                                            {formatDiscount(
                                                benefit.discount_type,
                                                benefit.discount_value
                                            )}
                                            <span className="mx-1 opacity-50">
                                                •
                                            </span>
                                            Kuota {benefit.discount_limit}x
                                            Penggunaan
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
                            membershipSelection.start_date
                        )}
                    />
                    <DescriptionItem
                        label="Berakhir"
                        valueClassName="text-primary-600 dark:text-primary-400 font-bold"
                        value={formatFullDateWithDay(
                            membershipSelection.end_date
                        )}
                    />
                </div>

                {/* Footer Harga (Total di dalam paket) */}
                <div className="pt-4 border-t border-dashed border-gray-100 dark:border-secondary-800">
                    <div className="flex justify-between items-center bg-gray-50 dark:bg-secondary-800/50 p-3 rounded-lg">
                        <div>
                            <p className="text-[10px] font-bold text-secondary-500 uppercase">
                                Subtotal Paket
                            </p>
                            <p className="text-xl font-black text-secondary-900 dark:text-white">
                                {formatRupiah(membershipSelection.price || 0)}
                            </p>
                        </div>
                        <div className="px-2 py-1 bg-primary-100 dark:bg-primary-900/40 rounded text-[9px] font-black text-primary-700 dark:text-primary-300 uppercase">
                            Best Value
                        </div>
                    </div>
                </div>
            </div>
        </SummarySection>
    );
}
