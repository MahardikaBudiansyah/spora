import React from "react";
import { CreditCard, CircleCheck } from "lucide-react";
import { formatAmountByType } from "@/utils/pricing";
import ContentCard from "@/components/cards/ContentCard";
import BannerAlert from "@/components/Common/BannerAlert";

export default function UserPaymentTypeSelection({
    selectedPaymentType,
    setSelectedPaymentType,
    isDpAvailable,
    policy,
}) {
    const canEnableDp = policy?.enable_dp ?? false;

    const options = [
        {
            label: "Bayar Lunas",
            description: "Bayar seluruh tagihan sekarang",
            value: "full_payment",
            disabled: false,
        },
    ];

    if (canEnableDp) {
        options.push({
            label: `Uang Muka (DP)`,
            description: policy
                ? `Bayar minimal ${formatAmountByType(policy.dp_type, policy.dp_value)} sekarang`
                : "Hitung DP...",
            value: "down_payment",
            disabled: !isDpAvailable,
        });
    }

    if (!policy) {
        return (
            <div className="animate-pulse flex flex-col gap-3">
                <div className="h-20 bg-secondary-100 rounded-lg" />
            </div>
        );
    }

    return (
        <ContentCard
            variant="plain"
            title="Tipe Pembayaran"
            icon={CreditCard}
            className="shadow-none"
        >
            <div className="flex flex-col gap-3">
                {!isDpAvailable && canEnableDp && (
                    <BannerAlert
                        type="warning"
                        variant="subtle"
                        showIcon={true}
                        title="DP Tidak Tersedia"
                        titleClassName="text-xs font-bold"
                        className="my-0 py-2"
                    >
                        <span className="text-[11px] leading-tight block">
                            Kebijakan DP hanya berlaku jika pesanan dibuat
                            minimal{" "}
                            <strong>
                                {policy.full_payment_days_before} hari
                            </strong>{" "}
                            sebelum jadwal main pertama.
                        </span>
                    </BannerAlert>
                )}

                {options.map((opt) => {
                    const isActive = selectedPaymentType === opt.value;

                    return (
                        <button
                            key={opt.value}
                            type="button"
                            disabled={opt.disabled}
                            onClick={() => setSelectedPaymentType(opt.value)}
                            className={`relative flex items-center justify-between py-3 px-4 rounded-lg border-2 text-left transition-all
                                ${
                                    isActive
                                        ? "border-primary-300 bg-primary-50 dark:border-primary-700 dark:bg-primary-900"
                                        : "border-secondary-100 dark:border-secondary-800 hover:border-secondary-200"
                                }
                                ${
                                    opt.disabled
                                        ? "opacity-60 cursor-not-allowed grayscale bg-secondary-50 dark:bg-secondary-900"
                                        : "cursor-pointer"
                                }
                            `}
                        >
                            <div className="flex flex-col gap-0.5">
                                <span
                                    className={`font-bold text-sm ${
                                        isActive
                                            ? "text-primary-700 dark:text-primary-400"
                                            : "text-secondary-700 dark:text-secondary-300"
                                    }`}
                                >
                                    {opt.label}
                                </span>
                                <span
                                    className={`text-[11px] leading-tight ${
                                        isActive
                                            ? "text-primary-600/80 dark:text-primary-400/80"
                                            : "text-secondary-500 dark:text-secondary-400"
                                    }`}
                                >
                                    {opt.description}
                                </span>
                            </div>

                            {isActive ? (
                                <CircleCheck className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                            ) : (
                                <div className="w-5 h-5 rounded-full border-2 border-secondary-200 dark:border-secondary-700" />
                            )}
                        </button>
                    );
                })}
            </div>
        </ContentCard>
    );
}
