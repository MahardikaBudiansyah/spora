import ContentCard from "@/components/cards/ContentCard";
import Avatar from "@/components/Common/Avatar";
import Badge from "@/components/Common/Badge";
import FeatureCard from "@/components/cards/FeatureCard";
import {
    getMembershipCardInfo,
    getMembershipOrderStatus,
    formatMembershipPeriod,
} from "@/utils/attributes/membershipAttribute";
import { formatAmountByType } from "@/utils/pricing";
import { formatTo08 } from "@/utils/numberPhone";
import { User } from "lucide-react";
import { twMerge } from "tailwind-merge";

export default function UserOrderCustomerSummary({ user, membership }) {
    const activeOrder = membership?.active_order || null;
    const queuedOrders = membership?.queued_orders || [];
    const card = getMembershipCardInfo(membership);

    const activeOrderDisplay = activeOrder
        ? {
              ...activeOrder,
              statusInfo: getMembershipOrderStatus(activeOrder?.status),
              displayColor:
                  activeOrder?.remaining_quota === 0 ? "red" : "emerald",
          }
        : null;

    const queuedOrderDisplay = queuedOrders.map((order) => ({
        ...order,
        statusInfo: getMembershipOrderStatus(order.status, true),
    }));

    const getInitials = (name) => {
        if (!name) return "";
        return name
            .trim()
            .split(" ")
            .slice(0, 2)
            .map((w) => w[0])
            .join("")
            .toUpperCase();
    };

    return (
        <ContentCard
            variant="plain"
            title="Informasi Konsumen"
            icon={User}
            className="shadow-none"
        >
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-row gap-3 w-full md:w-1/2">
                    <Avatar
                        src={user?.photo ? `/storage/${user.photo}` : null}
                        fallback={getInitials(user.name)}
                        size="xl"
                        className="mt-1"
                    />

                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col">
                            <span className="text-lg font-bold leading-tight">
                                {user?.name}
                            </span>
                            <span className="text-sm text-secondary-500 dark:text-secondary-400">
                                {user?.email || "-"}
                            </span>
                            <span className="text-sm text-secondary-500 dark:text-secondary-400">
                                {formatTo08(user?.phone_number) || "-"}
                            </span>
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="text-xs font-bold text-secondary-500 dark:text-secondary-400 uppercase">
                                Status Member
                            </span>
                            <div className="flex gap-2">
                                {card?.isActive && (
                                    <Badge
                                        color={card?.isActive ? "green" : "red"}
                                    >
                                        {card?.isActive ? "Aktif" : "Non-Aktif"}
                                    </Badge>
                                )}
                                <Badge color={card?.color}>{card?.label}</Badge>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    {activeOrderDisplay && (
                        <FeatureCard
                            color="emerald"
                            variant="subtle"
                            className="font-bold"
                        >
                            <div className="flex justify-between items-center border-b border-emerald-200 dark:border-emerald-600 pb-2">
                                <span>{activeOrderDisplay?.package_name}</span>
                                <Badge
                                    variant="solid"
                                    color={activeOrderDisplay?.statusInfo.color}
                                    size="xs"
                                >
                                    {activeOrderDisplay?.statusInfo.label}
                                </Badge>
                            </div>

                            <div className="pt-2 flex flex-col gap-2 text-xs">
                                <div className="flex flex-row justify-between">
                                    <div className="text-left">
                                        <p className="text-[9px] uppercase">
                                            Diskon
                                        </p>
                                        <p>
                                            {formatAmountByType(
                                                activeOrderDisplay?.benefit
                                                    .discount_type,
                                                activeOrderDisplay?.benefit
                                                    .discount_value,
                                            )}{" "}
                                            per Sesi
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[9px] uppercase">
                                            Kuota
                                        </p>
                                        <p
                                            className={twMerge(
                                                "",
                                                activeOrderDisplay?.remaining_quota ===
                                                    0
                                                    ? "text-red-500"
                                                    : "",
                                            )}
                                        >
                                            {
                                                activeOrderDisplay?.remaining_quota
                                            }{" "}
                                            Sesi
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[9px] uppercase">
                                        Periode
                                    </p>
                                    <p>
                                        {formatMembershipPeriod(
                                            activeOrderDisplay?.start_date,
                                            activeOrderDisplay?.end_date,
                                        )}
                                    </p>
                                </div>
                            </div>
                        </FeatureCard>
                    )}
                    {queuedOrderDisplay.map((q, i) => (
                        <FeatureCard
                            key={i}
                            color="amber"
                            variant="subtle"
                            className="font-bold"
                        >
                            <div className="flex justify-between items-center border-b border-amber-200 dark:border-amber-600 pb-2">
                                <span>{q?.package_name}</span>
                                <Badge
                                    variant="solid"
                                    color={q?.statusInfo.color}
                                    size="xs"
                                >
                                    {q?.statusInfo.label}
                                </Badge>
                            </div>

                            <div className="pt-2 flex flex-col gap-2 text-xs">
                                <div className="flex flex-row justify-between">
                                    <div className="text-left">
                                        <p className="text-[9px] uppercase">
                                            Diskon
                                        </p>
                                        <p>
                                            {formatAmountByType(
                                                q?.benefit.discount_type,
                                                q?.benefit.discount_value,
                                            )}{" "}
                                            per Sesi
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[9px] uppercase">
                                            Kuota
                                        </p>
                                        <p
                                            className={twMerge(
                                                "",
                                                q?.remaining_quota === 0
                                                    ? "text-red-500"
                                                    : "",
                                            )}
                                        >
                                            {q?.remaining_quota} Sesi
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[9px] uppercase">
                                        Periode
                                    </p>
                                    <p>
                                        {formatMembershipPeriod(
                                            q?.start_date,
                                            q?.end_date,
                                        )}
                                    </p>
                                </div>
                            </div>
                        </FeatureCard>
                    ))}
                </div>
            </div>
        </ContentCard>
    );
}
