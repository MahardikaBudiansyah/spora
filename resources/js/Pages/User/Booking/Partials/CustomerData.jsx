import { Card, CardHeader, CardBody } from "@/components/common/Card";
import Avatar from "@/components/Common/Avatar";
import Badge from "@/components/Common/Badge";
import Tippy from "@tippyjs/react";
import {
    getMembershipStatus,
    formatMembershipPeriod,
    formatDiscountLimitUsage,
} from "@/utils/membershipAttribute";
import { formatTo08 } from "@/utils/numberPhone";

export default function CustomerData({ user }) {
    const membershipStatus = getMembershipStatus(user.membership?.status);

    const getInitials = (name) => {
        if (!name) return "";
        const words = name.trim().split(" ");
        return words
            .slice(0, 2)
            .map((w) => w[0])
            .join("")
            .toUpperCase();
    };

    return (
        <Card className="rounded-xl dark:border-none shadow-sm p-4">
            <CardHeader className="pb-4 border-b text-xl font-bold text-secondary-500 dark:text-white">
                Penyewa
            </CardHeader>
            <CardBody>
                <div className="py-2 flex flex-row items-start gap-3">
                    <Avatar
                        src={user.photo || ""}
                        fallback={getInitials(user.name)}
                        size="xl"
                        className="mt-1"
                    />
                    <div className="flex flex-col gap-1">
                        <div className="flex flex-col  ">
                            <span className="text-lg font-bold">
                                {user.name}
                            </span>
                            <span>{user.email}</span>
                            <span>{formatTo08(user.phone_number)}</span>
                        </div>

                        <div className="flex flex-col gap-1">
                            <div className="flex flex-wrap flex-row gap-2">
                                <Badge
                                    color={membershipStatus.color}
                                    className="w-fit mt-1"
                                >
                                    {membershipStatus.label}
                                </Badge>
                                {user.membership && (
                                    <Badge color="green" className="w-fit mt-1">
                                        {user.membership.package_name}
                                    </Badge>
                                )}
                            </div>

                            {user.membership && (
                                <div className="flex flex-wrap flex-row gap-2">
                                    <Badge color="green" className="w-fit mt-1">
                                        {formatMembershipPeriod(
                                            user.membership
                                        )}
                                    </Badge>

                                    {user.membership?.discount?.limit && (
                                        <span className="flex items-center gap-2">
                                            {(() => {
                                                const usage =
                                                    formatDiscountLimitUsage(
                                                        user.membership.discount
                                                            .limit,
                                                        user.membership.discount
                                                            .used
                                                    );
                                                if (!usage) return null;

                                                return (
                                                    <Tippy
                                                        content={usage.tooltip}
                                                    >
                                                        <span>
                                                            <Badge
                                                                color={
                                                                    usage.color
                                                                }
                                                                className="w-fit mt-1 cursor-help"
                                                            >
                                                                {usage.label}
                                                            </Badge>
                                                        </span>
                                                    </Tippy>
                                                );
                                            })()}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}
