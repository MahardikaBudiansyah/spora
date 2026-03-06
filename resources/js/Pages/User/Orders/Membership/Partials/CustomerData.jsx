import { Card, CardHeader, CardBody } from "@/components/common/Card";
import Avatar from "@/components/Common/Avatar";
import { formatTo08 } from "@/utils/numberPhone";
import { getMembershipCard } from "@/utils/attributes/membershipAttribute";
import Badge from "@/components/Common/Badge";
import { formatShortDate } from "@/utils/date";
import { ChevronRight } from "lucide-react";

export default function CustomerData({ user, card, activeOrders = [] }) {
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
                Pelanggan
            </CardHeader>
            <CardBody>
                <div className="py-2 flex flex-row items-start gap-4">
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
                        <div>
                            <span className="font-semibold">
                                Nomor Member:{" "}
                            </span>
                            <Badge
                                color={getMembershipCard(card).color}
                                className=""
                            >
                                {getMembershipCard(card).label}
                            </Badge>
                        </div>
                        <div>
                            <span className="font-semibold">
                                Riwayat Langganan Membership:
                            </span>

                            {activeOrders?.length === 0 ? (
                                <div className="text-sm text-gray-500 mt-1">
                                    Tidak ada riwayat membership yang aktif atau
                                    dalam antrian.
                                </div>
                            ) : (
                                activeOrders.map((order) => (
                                    <Card
                                        key={order.id}
                                        className="shadow-none border-none py-2 px-0 flex flex-row gap-2 items-center"
                                    >
                                        <div className="mt-[-16px]">
                                            <ChevronRight className="w-3 h-auto" />
                                        </div>
                                        <div>
                                            {/* Nama paket */}
                                            <div className="font-semibold">
                                                {order.membership_package
                                                    ?.name ??
                                                    "Paket Tidak Diketahui"}
                                            </div>

                                            {/* Periode */}
                                            <div className="flex items-center gap-2">
                                                <span>
                                                    {formatShortDate(
                                                        order.start_date
                                                    )}{" "}
                                                    -{" "}
                                                    {formatShortDate(
                                                        order.end_date
                                                    )}
                                                </span>

                                                <Badge
                                                    color={
                                                        order.status ===
                                                        "active"
                                                            ? "green"
                                                            : "yellow"
                                                    }
                                                    className="text-xs"
                                                >
                                                    {order.status === "active"
                                                        ? "Aktif"
                                                        : order.status ===
                                                          "queued"
                                                        ? "Dalam Antrian"
                                                        : order.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    </Card>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}
