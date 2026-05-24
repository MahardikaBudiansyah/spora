import { useMemo } from "react";
import Table from "@/components/Common/Table";
import Button from "@/components/Common/Button";
import Pagination from "@/components/common/Pagination";
import Badge from "@/components/Common/Badge";
import ButtonToggle from "@/components/Common/ButtonToggle";
import {
    Eye,
    EyeClosed,
    Info,
    Edit,
    RectangleEllipsis,
    Package2,
    IdCard,
    UserPlus2,
    CalendarCheck,
    CircleDollarSign,
    Settings,
    Trash2,
} from "lucide-react";
import { formatTo08 } from "@/utils/numberPhone";
import { formatFullDateTime } from "@/utils/date";
import { getVenueStatus } from "@/utils/attributes/venueAttribute";
import { formatFullAddress } from "@/utils/address";

export default function MerchantVenueTable({
    auth_status,
    venues,
    handleToggleActive,
    handleVerification,
    handleDelete,
}) {
    const canRequestVerification = (row) => {
        const isNeedsAction =
            ["draft", "rejected"].includes(row.status) ||
            row.is_reverification_required;
        const isDataComplete =
            row.name && row.phone_number && row?.address?.full_address;

        return isNeedsAction && isDataComplete;
    };

    const columns = useMemo(() => {
        const cols = [
            {
                key: "number",
                header: "#",
                className: "text-center content-start",
                render: (_, __, index) => {
                    const currentPage =
                        venues.current_page || venues.meta?.current_page || 1;
                    const perPage =
                        venues.per_page || venues.meta?.per_page || 10;
                    return (currentPage - 1) * perPage + index + 1;
                },
            },
            {
                key: "name",
                header: "Nama Venue",
                className: "content-start whitespace-nowrap",
            },
            {
                key: "address",
                header: "Alamat",
                className: "min-w-[200px] max-w-[500px] content-start",
                render: (val, row) => {
                    const address = formatFullAddress(
                        row?.address?.full_address,
                    );
                    return (
                        <div className="break-words line-clamp-4">
                            {address}
                        </div>
                    );
                },
            },
            {
                key: "phone_number",
                header: "No Handphone",
                className: "text-center content-start whitespace-nowrap",
                render: (val, row) => formatTo08(row.phone_number) || "-",
            },
            {
                key: "courts",
                header: "Lapangan",
                className: "content-start whitespace-nowrap",
                render: (val, row) =>
                    row.courts && row.courts.length > 0 ? (
                        <ul className="flex flex-wrap gap-1 w-[200px]">
                            {row.courts.map((court, idx) => (
                                <li key={court.id || idx}>
                                    <Badge>{court.name}</Badge>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <Badge variant="outline" className="text-normal">
                            Belum ada lapangan
                        </Badge>
                    ),
            },
            {
                key: "created_at",
                header: "Tanggal Ditambahkan",
                className: "content-start whitespace-nowrap",
                render: (val, row) => formatFullDateTime(row.created_at) || "-",
            },
            {
                key: "status",
                header: "Status",
                render: (val, row) => {
                    const latestStatus = row.latest_status;
                    const statusVenue = getVenueStatus(
                        row.status,
                        latestStatus?.created_at,
                        latestStatus,
                    );
                    const StatusIcon = statusVenue.icon;

                    return (
                        <div className="flex flex-col gap-1 items-center">
                            <span className="flex">
                                <Badge
                                    color={statusVenue.color}
                                    tooltip={statusVenue.timestamp || ""}
                                    className="flex items-center gap-1 px-2 py-1 font-bold whitespace-nowrap"
                                >
                                    <StatusIcon
                                        size={14}
                                        className={
                                            row?.status === "rejected"
                                                ? "animate-pulse"
                                                : ""
                                        }
                                    />
                                    {statusVenue.label}
                                </Badge>
                            </span>

                            <span className="whitespace-nowrap">
                                {latestStatus
                                    ? formatFullDateTime(latestStatus)
                                    : formatFullDateTime(row.created_at)}
                            </span>
                        </div>
                    );
                },
                className: "text-center content-start",
            },
            {
                key: "action",
                header: "Aksi",
                className: "w-[750px] content-start items-start",
                render: (val, row) => (
                    <div className="flex flex-wrap gap-2 w-[350px]">
                        <ButtonToggle
                            active={row.is_active}
                            onClick={() => handleToggleActive(row)}
                            activeIcon={<Eye className="w-4 h-4" />}
                            inactiveIcon={<EyeClosed className="w-4 h-4" />}
                            activeVariant="success"
                            inactiveVariant="danger"
                            size="sm"
                        />
                        {["draft", "rejected"].includes(row.status) && (
                            <Button
                                variant="warning"
                                size="xs"
                                onClick={() => handleVerification(row)}
                                disabled={!canRequestVerification(row)}
                            >
                                Verifikasi
                            </Button>
                        )}
                        <Button
                            variant="info"
                            size="xs"
                            href={route("merchant.venues.show", {
                                venue: row.slug,
                            })}
                            disabled={!auth_status.is_merchant_approved}
                        >
                            Info
                        </Button>
                        <Button
                            variant="success"
                            size="xs"
                            href={route("merchant.venues.edit", {
                                venue: row.slug,
                            })}
                            disabled={!auth_status.is_merchant_approved}
                        >
                            Edit
                        </Button>
                        <Button
                            variant="warning"
                            size="xs"
                            href={route("merchant.venues.courts.index", {
                                venue: row.slug,
                            })}
                            disabled={
                                !auth_status.is_merchant_approved ||
                                !auth_status.has_approved_venue
                            }
                        >
                            Lapangan
                        </Button>
                        <Button
                            variant="violet"
                            size="xs"
                            href={route(
                                "merchant.venues.memberships.packages.index",
                                {
                                    venue: row.slug,
                                },
                            )}
                            disabled={
                                !auth_status.is_merchant_approved ||
                                !auth_status.has_approved_venue
                            }
                        >
                            Paket Membership
                        </Button>
                        <Button
                            variant="violet"
                            size="xs"
                            href={route(
                                "merchant.venues.memberships.packages.index",
                                {
                                    venue: row.slug,
                                },
                            )}
                            disabled={
                                !auth_status.is_merchant_approved ||
                                !auth_status.has_approved_venue
                            }
                        >
                            Paket Membership
                        </Button>
                        <Button
                            variant="violet"
                            size="xs"
                            href={route(
                                "merchant.venues.memberships.cards.index",
                                {
                                    venue: row.slug,
                                },
                            )}
                            disabled={
                                !auth_status.is_merchant_approved ||
                                !auth_status.has_approved_venue
                            }
                        >
                            Kartu Member
                        </Button>
                        <Button
                            variant="violet"
                            size="xs"
                            href={route(
                                "merchant.venues.memberships.orders.index",
                                {
                                    venue: row.slug,
                                },
                            )}
                            disabled={
                                !auth_status.is_merchant_approved ||
                                !auth_status.has_approved_venue
                            }
                        >
                            Oeder Membership
                        </Button>
                        <Button
                            variant="pink"
                            size="xs"
                            href={route("merchant.venues.bookings.index", {
                                venue: row.slug,
                            })}
                            disabled={
                                !auth_status.is_merchant_approved ||
                                !auth_status.has_approved_venue
                            }
                        >
                            Oeder Booking
                        </Button>
                        <Button
                            variant="fuchsia"
                            size="xs"
                            href={route("merchant.venues.transactions.index", {
                                venue: row.slug,
                            })}
                            disabled={
                                !auth_status.is_merchant_approved ||
                                !auth_status.has_approved_venue
                            }
                        >
                            Transaksi
                        </Button>
                        <Button
                            variant="zinc"
                            size="xs"
                            href={route(
                                "merchant.venues.settings.payment-policy.index",
                                {
                                    venue: row.slug,
                                },
                            )}
                        >
                            Pengaturan
                        </Button>

                        <Button
                            variant="danger"
                            size="xs"
                            onClick={() => handleDelete(row)}
                            className="flex items-center w-auto gap-1.5 px-3 min-w-max"
                        >
                            <Trash2 className="w-4 h-4" />
                            <span>Hapus</span>
                        </Button>
                    </div>
                ),
            },
        ];

        return cols;
    }, [venues.current_page, venues.per_page]);

    return (
        <div className="py-2 flex-1 overflow-visible overflow-x-auto">
            <Table
                columns={columns}
                data={venues}
                wrapperClassName="border-none rounded-none shadow-none"
                tableClassName="text-xs"
                emptyState={
                    <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                        Tidak ada data Mitra.{" "}
                    </div>
                }
            />
            {venues.links && (
                <Pagination links={venues} meta={venues} className="p-6 my-2" />
            )}
        </div>
    );
}
