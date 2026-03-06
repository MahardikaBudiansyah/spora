// @/components/Orders/OrderBillingSummary
import React from "react";
import { Wallet } from "lucide-react";
import { formatRupiah } from "@/utils/currency";
import SummarySection from "@/components/cards/SummaryCard";

export default function OrderBillingSummary({
    price,
    paidAmount,
    label = "Harga Paket",
}) {
    const remainingAmount = price - paidAmount;

    return (
        <SummarySection
            title="Rincian Biaya"
            icon={<Wallet className="w-4 h-4" />}
        >
            <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-secondary-500">{label}</span>
                    <span className="font-semibold">{formatRupiah(price)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-secondary-500">Telah Dibayar</span>
                    <span className="font-semibold text-emerald-600">
                        {formatRupiah(paidAmount)}
                    </span>
                </div>
                <div className="pt-3 border-t border-dashed border-gray-200 dark:border-secondary-700 flex justify-between items-center">
                    <span className="font-bold text-secondary-900 dark:text-white">
                        Sisa Tagihan
                    </span>
                    <span
                        className={`text-lg font-black ${
                            remainingAmount > 0
                                ? "text-red-500"
                                : "text-emerald-500"
                        }`}
                    >
                        {formatRupiah(remainingAmount)}
                    </span>
                </div>
            </div>
        </SummarySection>
    );
}
