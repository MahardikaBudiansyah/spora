import { useMemo, useState } from "react";
import { router } from "@inertiajs/react";
import ContentCard from "@/components/cards/ContentCard";
import Button from "@/components/Common/Button";
import {
    ChevronDown,
    ChevronRight,
    CheckCircle,
    Calendar,
    Package,
    Tag,
    HelpCircle,
    Info,
    ArrowLeft,
    MapPin,
} from "lucide-react";
import { formatRupiah, formatDiscount } from "@/utils/currency";
import { formatFullDateWithDay, parseDate } from "@/utils/date";
import { formatDistrictCity } from "@/utils/address";
import Tippy from "@tippyjs/react";

export default function UserPreviewMembershipPackage({
    membershipPackage,
    venue,
    pricing,
}) {
    const [isOpen, setIsOpen] = useState(true);

    const discounts = membershipPackage?.discounts || [];
    const others = membershipPackage?.others || [];

    const hasDiscounts = discounts.length > 0;
    const hasOthers = others.length > 0;

    const totalBill =
        pricing?.payment_summary?.total_bill ?? membershipPackage?.price ?? 0;

    const startDate = pricing?.schedule_prediction?.start_date
        ? new Date(pricing.schedule_prediction.start_date)
        : new Date();

    const displayEndDate = pricing?.schedule_prediction?.end_date
        ? new Date(pricing.schedule_prediction.end_date)
        : null;

    const isQueued = pricing?.schedule_prediction?.is_queued;

    const action = (
        <Button
            variant="outline"
            size="xs"
            onClick={() =>
                router.visit(route("venues.show", venue?.slug || ""))
            }
            className="flex items-center justify-center gap-1 text-[10px] py-1 px-2"
        >
            <ArrowLeft className="w-3 h-3" />
            Ganti Paket
        </Button>
    );

    return (
        <ContentCard
            variant="plain"
            title="Ringkasan Paket"
            icon={Package}
            action={action}
            className="shadow-none"
        >
            {!membershipPackage ? (
                <div className="py-8 flex flex-col gap-2 items-center justify-center text-center text-secondary-500 dark:text-secondary-400">
                    <div className="w-12 h-12 rounded-full bg-secondary-100 dark:bg-secondary-700 flex items-center justify-center">
                        <Info className="w-6 h-6" />
                    </div>
                    <span className=" mb-4">
                        <p className="font-bold text-sm">
                            Wah, belum ada paket membership yang dipilih...
                        </p>
                        <p className="text-[11px]">
                            Pilih Venue favoritmu dan Langganan membership
                            sekarang.
                        </p>
                    </span>
                    <Button
                        size="xs"
                        onClick={() => router.visit(route("venues"))}
                    >
                        Lihat Venue
                    </Button>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="flex flex-col gap-1">
                        <h4 className="font-bold text-left text-sm text-secondary-800 dark:text-white">
                            {venue?.name}
                        </h4>
                        {venue.address && (
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-1.5 text-secondary-500 dark:text-secondary-400 text-[10px]">
                                    <MapPin className="w-3 h-3" />
                                    {venue?.short_address ||
                                        formatDistrictCity(
                                            venue?.address?.district,
                                            venue?.address?.city,
                                        )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div
                        className="flex items-start justify-between group cursor-pointer"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <div className="flex flex-col gap-1">
                            <h4 className="font-bold text-secondary-900 dark:text-white">
                                {membershipPackage.name}
                            </h4>
                            <div className="flex items-center gap-2 text-secondary-500 dark:text-secondary-400 font-semibold text-xs">
                                <Tag className="w-3.5 h-3.5" />
                                Durasi {membershipPackage.duration_months} Bulan
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
                            {membershipPackage.description && (
                                <p className="text-left text-xs text-secondary-600 dark:text-secondary-400 leading-relaxed italic ">
                                    "{membershipPackage.description}"
                                </p>
                            )}

                            {(hasDiscounts || hasOthers) && (
                                <ul className="space-y-2 bg-secondary-50 dark:bg-secondary-800/40 p-3 rounded-xl">
                                    {hasDiscounts &&
                                        discounts.map((d) => (
                                            <li
                                                key={d.id}
                                                className="flex gap-2 items-start justify-between text-[11px] md:text-xs"
                                            >
                                                <div className="flex gap-2 items-start text-left">
                                                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                                    <span className="text-secondary-700 dark:text-secondary-300">
                                                        Diskon{" "}
                                                        {formatDiscount(
                                                            d.discount_type,
                                                            d.discount_value,
                                                        )}{" "}
                                                        {d.discount_limit &&
                                                            ` (Maks ${d.discount_limit} jam)`}
                                                    </span>
                                                </div>
                                                {d.description && (
                                                    <Tippy
                                                        content={d.description}
                                                    >
                                                        <HelpCircle className="w-3.5 h-3.5 text-secondary-400 cursor-help ml-2 flex-shrink-0" />
                                                    </Tippy>
                                                )}
                                            </li>
                                        ))}
                                    {hasOthers &&
                                        others.map((o) => (
                                            <li
                                                key={o.id}
                                                className="flex gap-2 items-start justify-between text-[11px] md:text-xs"
                                            >
                                                <div className="flex gap-2 items-start text-left">
                                                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                                    <span className="text-secondary-700 dark:text-secondary-300">
                                                        {o.name}
                                                    </span>
                                                </div>
                                                {o.description && (
                                                    <Tippy
                                                        content={o.description}
                                                    >
                                                        <HelpCircle className="w-3.5 h-3.5 text-secondary-400 cursor-help ml-2" />
                                                    </Tippy>
                                                )}
                                            </li>
                                        ))}
                                </ul>
                            )}
                        </div>
                    )}

                    <div className="pt-4 border-t border-secondary-100 dark:border-secondary-800">
                        <div className="flex items-center gap-2 mb-3 text-xs font-bold text-secondary-400 uppercase tracking-tight">
                            <Calendar className="w-3 h-3" />
                            Estimasi Periode Membership
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                                <span className="text-secondary-500">
                                    Mulai Aktif
                                </span>
                                <span className="font-medium text-secondary-900 dark:text-white">
                                    {startDate
                                        ? formatFullDateWithDay(startDate)
                                        : "-"}
                                </span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-secondary-500">
                                    Berakhir Pada
                                </span>
                                <span className="font-medium text-primary-600 dark:text-primary-400">
                                    {displayEndDate
                                        ? formatFullDateWithDay(displayEndDate)
                                        : "-"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t-2 border-dashed border-secondary-100 dark:border-secondary-800 mt-4">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-secondary-500 font-medium">
                                Harga Paket
                            </span>
                            <span className="text-sm text-secondary-900 dark:text-white font-semibold">
                                {formatRupiah(membershipPackage.price)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center pt-2 text-primary-600 dark:text-primary-500 text-sm">
                            <span className=" font-bold">Total Pembayaran</span>
                            <span className="md:text-xl font-black">
                                {formatRupiah(totalBill)}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </ContentCard>
    );
}
