import React from "react";
import { usePage, router } from "@inertiajs/react"; // Import router untuk navigasi
import { Wallet, Settings, Edit2 } from "lucide-react";
import { formatRupiah } from "@/utils/currency";
import { Card } from "@/components/Common/Card";
import Button from "@/components/Common/Button";

const VenuePaymentInfo = ({ paymentPolicies, venueSlug }) => {
    const { auth } = usePage().props;
    const isMerchant = auth?.merchant;

    const policy = Array.isArray(paymentPolicies)
        ? paymentPolicies.find((p) => p.order_type === "booking")
        : paymentPolicies;

    if (!policy || !policy.is_active) return null;

    const { enable_dp, dp_type, dp_value, full_payment_days_before } = policy;

    const handleSettingsClick = () => {
        router.get(
            route("merchant.venues.settings.payment", { venue: venueSlug }),
        );
    };

    return (
        <Card className="relative flex flex-col h-full py-3 px-4 rounded-lg shadow-sm border dark:border-none transition">
            {isMerchant && (
                <div className="absolute top-2 right-2 group-hover:opacity-100 transition-opacity">
                    <Button
                        variant="ghost"
                        size="xs"
                        onClick={handleSettingsClick}
                        className="p-1 rounded-full"
                        tooltip="Atur Pembayaran"
                    >
                        <Settings className="w-4 h-4 text-secondary-500 dark:text-secondary-200" />
                    </Button>
                </div>
            )}
            <div className="flex flex-row items-start gap-3">
                <span className="mt-1">
                    <Wallet className="w-4 h-4" />
                </span>
                {enable_dp ? (
                    <div className="flex flex-col items-start text-sm">
                        <div className=" text-gray-600 dark:text-gray-400">
                            Bisa bayar DP sebesar{" "}
                            <span className="text-secondary-700 dark:text-secondary-300 font-semibold">
                                {dp_type === "fixed"
                                    ? formatRupiah(dp_value)
                                    : `${Math.round(dp_value)}%`}
                            </span>
                        </div>
                        <span>
                            Pelunasan maksimal {full_payment_days_before} hari
                            sebelum jadwal main.
                        </span>
                    </div>
                ) : (
                    <p className="text-sm font-semibold italic">
                        Venue ini hanya menerima Pembayaran Lunas.
                    </p>
                )}
            </div>
        </Card>
    );
};

export default VenuePaymentInfo;
