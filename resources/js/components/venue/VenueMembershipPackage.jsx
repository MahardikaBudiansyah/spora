import { useState } from "react";
import { useMembership } from "@/contexts/MembershipContext";
import {
    CheckCircle,
    HelpCircle,
    ChevronDown,
    ChevronRight,
} from "lucide-react";
import Tippy from "@tippyjs/react";
import { formatDiscount, formatRupiah } from "@/utils/currency";
import Button from "@/components/Common/Button";
import { Card } from "@/components/Common/Card";

const VenueMembershipPackage = ({ packages = [] }) => {
    const handleBuy = async (pkg) => {
        try {
            await axios.post(route("user.memberships.selectPackages"), {
                package_id: pkg.id,
            });
            window.location.href = route("user.memberships.create");
        } catch (error) {
            console.error("Gagal memilih paket membership:", error);
        }
    };

    if (!packages.length) {
        return (
            <p className="text-sm text-gray-500">Belum ada paket membership.</p>
        );
    }

    return (
        <div className="w-full">
            <span className="text-xl font-bold">Memberships:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                {packages.map((pkg) => {
                    const [open, setOpen] = useState(false);
                    const hasDiscounts =
                        pkg.membership_benefit_discounts?.length > 0;
                    const hasOthers = pkg.membership_benefit_others?.length > 0;

                    return (
                        <Card
                            key={pkg.id}
                            className="p-4 border-none hover:bg-primary-200 dark:hover:bg-primary-600 rounded-lg shadow-sm"
                        >
                            <div className="pb-2 text-base font-bold flex justify-start items-center">
                                {pkg.name}
                                {pkg.description && (
                                    <button
                                        onClick={() => setOpen(!open)}
                                        className="ml-2"
                                    >
                                        {open ? (
                                            <ChevronDown className="w-4 h-4 text-gray-500" />
                                        ) : (
                                            <ChevronRight className="w-4 h-4 text-gray-500" />
                                        )}
                                    </button>
                                )}
                            </div>

                            {open && pkg.description && (
                                <div className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                                    {pkg.description}
                                </div>
                            )}

                            {(hasDiscounts || hasOthers) && (
                                <ul className="flex flex-col gap-2 items-start text-xs mb-3">
                                    {hasDiscounts &&
                                        pkg.membership_benefit_discounts.map(
                                            (d) => (
                                                <li
                                                    key={`discount-${d.id}`}
                                                    className="flex flex-row gap-2 items-start justify-between"
                                                >
                                                    <div className="flex flex-row gap-2 items-start">
                                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                                        <span>
                                                            Diskon{" "}
                                                            {formatDiscount(
                                                                d.discount_type,
                                                                d.discount_value
                                                            )}{" "}
                                                            per jam, berlaku
                                                            maksimal{" "}
                                                            {d.discount_limit}{" "}
                                                            jam
                                                        </span>
                                                    </div>
                                                    <Tippy
                                                        content={
                                                            d.description ||
                                                            "Tidak ada deskripsi"
                                                        }
                                                    >
                                                        <HelpCircle className="w-3 h-3 text-gray-400 cursor-pointer" />
                                                    </Tippy>
                                                </li>
                                            )
                                        )}

                                    {hasOthers &&
                                        pkg.membership_benefit_others.map(
                                            (o) => (
                                                <li
                                                    key={`other-${o.id}`}
                                                    className="flex flex-row gap-2 items-center justify-between"
                                                >
                                                    <div className="flex flex-row gap-2 items-center">
                                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                                        <span>{o.name}</span>
                                                    </div>
                                                    <Tippy
                                                        content={
                                                            o.description ||
                                                            "Tidak ada deskripsi"
                                                        }
                                                    >
                                                        <HelpCircle className="w-3 h-3 text-gray-400 cursor-pointer" />
                                                    </Tippy>
                                                </li>
                                            )
                                        )}
                                </ul>
                            )}

                            <div className="flex flex-row justify-between gap-2 items-end">
                                <div className="flex flex-row gap-1 items-end">
                                    <span className="text-base font-bold">
                                        {formatRupiah(pkg.price)}/
                                    </span>
                                    <span>{pkg.duration_months} Bulan</span>
                                </div>
                                <Button
                                    variant="primary"
                                    onClick={() => handleBuy(pkg)}
                                >
                                    Beli
                                </Button>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};

export default VenueMembershipPackage;
