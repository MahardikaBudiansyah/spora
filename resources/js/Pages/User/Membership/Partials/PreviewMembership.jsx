import { useState } from "react";
import { router } from "@inertiajs/react";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
} from "@/components/common/Card";
import Button from "@/components/Common/Button";
import IconButton from "@/components/Common/IconButton";
import {
    Trash2,
    Dot,
    ArrowLeft,
    ChevronDown,
    ChevronRight,
    CheckCircle,
    HelpCircle,
} from "lucide-react";
import { formatFullDateWithDay } from "@/utils/date";
import { formatDistrictCity } from "@/utils/address";
import BannerAlert from "@/components/Common/BannerAlert";
import Tippy from "@tippyjs/react";
import { formatDiscount, formatRupiah } from "@/utils/currency";

export default function PreviewMembership({ membershipPackage }) {
    const [open, setOpen] = useState(false);
    const hasDiscounts = membershipPackage.discounts?.length > 0;
    const hasOthers = membershipPackage.others?.length > 0;

    return (
        <Card className="rounded-xl dark:border-none shadow-sm p-4">
            {/* Header Venue */}
            <CardHeader className="pb-4 border-b">
                <div className="text-xl font-bold text-secondary-500 dark:text-white">
                    {membershipPackage.venue?.name || "Venue"}
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-sm">
                    {formatDistrictCity(
                        membershipPackage.venue.addresses[0].district?.name,
                        membershipPackage.venue.addresses[0].city?.name
                    )}
                </div>
            </CardHeader>
            <CardBody>
                <Card
                    key={membershipPackage.id}
                    className="p-4 border-none rounded-lg shadow-sm"
                >
                    <div className="pb-2 text-base font-bold flex justify-start items-center">
                        {membershipPackage.name}
                        {membershipPackage.description && (
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

                    {open && membershipPackage.description && (
                        <div className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                            {membershipPackage.description}
                        </div>
                    )}

                    {(hasDiscounts || hasOthers) && (
                        <ul className="flex flex-col gap-2 items-start text-xs mb-3">
                            {hasDiscounts &&
                                membershipPackage.discounts.map((d) => (
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
                                                per jam, berlaku maksimal{" "}
                                                {d.discount_limit} jam
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
                                ))}

                            {hasOthers &&
                                membershipPackage.others.map((o) => (
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
                                ))}
                        </ul>
                    )}

                    <div className="flex flex-row justify-between gap-2 items-end">
                        <div className="flex flex-row gap-1 items-end">
                            <span className="text-base font-bold">
                                {formatRupiah(membershipPackage.price)}/
                            </span>
                            <span>
                                {membershipPackage.duration_months} Bulan
                            </span>
                        </div>
                    </div>
                </Card>
            </CardBody>

            <CardFooter className="pt-4 border-t text-right">
                <Button
                    variant="primary"
                    onClick={() => router.visit(route("venues.index"))}
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Membership Venue Lainnya
                </Button>
            </CardFooter>
        </Card>
    );
}
