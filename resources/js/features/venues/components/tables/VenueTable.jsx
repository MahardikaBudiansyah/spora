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
import {
    getVenueStatus,
    getVenueCourtsCountBadge,
} from "@/utils/attributes/venueAttribute";
import { formatFullAddress } from "@/utils/address";

export default function VenueTable({
    auth,
    venues,
    handleToggleActive,
    handleInfo,
    handleVerification,
    handleDelete,
}) {
    const merchantActionButtons = [
        {
            label: "Info",
            icon: <Info className="w-4 h-4" />,
            variant: "info",
            route: "merchant.venues.show",
        },
        {
            label: "Edit",
            icon: <Edit className="w-4 h-4" />,
            variant: "success",
            route: "merchant.venues.edit",
        },
        {
            label: "Lapangan",
            icon: <RectangleEllipsis className="w-4 h-4" />,
            variant: "warning",
            route: "merchant.venues.courts.index",
        },
        {
            label: "Paket Membership",
            icon: <Package2 className="w-4 h-4" />,
            variant: "violet",
            route: "merchant.venues.courts.index",
        },
        {
            label: "Kartu Member",
            icon: <IdCard className="w-4 h-4" />,
            variant: "violet",
            route: "merchant.venues.courts.index",
        },
        {
            label: "Order Membership",
            icon: <UserPlus2 className="w-4 h-4" />,
            variant: "violet",
            route: "merchant.venues.courts.index",
        },
        {
            label: "Order Booking",
            icon: <CalendarCheck className="w-4 h-4" />,
            variant: "pink",
            route: "merchant.venues.bookings.index",
        },
        {
            label: "Transaksi",
            icon: <CircleDollarSign className="w-4 h-4" />,
            variant: "fuchsia",
            route: "merchant.venues.bookings.index",
        },
        {
            label: "Pengaturan",
            icon: <Settings className="w-4 h-4" />,
            variant: "zinc",
            route: "merchant.venues.bookings.index",
        },
    ];

    const columns = useMemo(() => {
        const cols = [
            {
                key: "number",
                header: "#",
                className: `text-center content-start ${auth.merchant ? "" : ""}`,
                render: (_, __, index) => {
                    const currentPage =
                        venues.current_page || venues.meta?.current_page || 1;
                    const perPage =
                        venues.per_page || venues.meta?.per_page || 10;
                    return (currentPage - 1) * perPage + index + 1;
                },
            },
        ];

        if (auth.admin) {
            cols.push({
                key: "merchant_name",
                header: "Mitra",
                className: "content-start whitespace-nowrap",
                render: (val, row) => (row.merchant ? row.merchant.name : "-"),
            });
        }

        cols.push(
            {
                key: "name",
                header: "Nama Venue",
                className: `content-start whitespace-nowrap ${auth.merchant ? "" : ""}`,
            },
            {
                key: "address",
                header: "Alamat",
                className: `min-w-[200px] max-w-[500px] content-start`,
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
                className: `text-center content-start whitespace-nowrap ${auth.merchant ? "" : ""}`,
                render: (val, row) => formatTo08(row.phone_number) || "-",
            },
        );

        if (auth.admin) {
            cols.push({
                key: "court_count",
                header: "Court",
                className: "text-center content-start whitespace-nowrap",
                render: (val, row) => {
                    const { label, color } = getVenueCourtsCountBadge(
                        row.courts_count,
                    );
                    return <Badge color={color}>{label}</Badge>;
                },
            });
        } else if (auth.merchant) {
            cols.push({
                key: "courts",
                header: "Court",
                className: `content-start whitespace-nowrap ${auth.merchant ? "" : ""}`,
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
            });
        }

        cols.push(
            {
                key: "created_at",
                header: "Tanggal Ditambahkan",
                className: `content-start whitespace-nowrap ${auth.merchant ? "" : ""}`,
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
        );

        cols.push({
            key: "action",
            header: "Aksi",
            className: ` w-[750px] content-start ${auth.merchant ? "items-start" : "text-center"}`,
            render: (val, row) => (
                <div
                    className={`flex flex-wrap gap-2 ${auth.merchant ? "w-[480px]" : "w-[200px] justify-center"}`}
                >
                    {auth.admin && (
                        <>
                            <Button
                                variant="warning"
                                size="xs"
                                onClick={() => handleVerification(row)}
                            >
                                Verifikasi
                            </Button>
                            <Button
                                variant="info"
                                size="xs"
                                onClick={() => handleInfo(row)}
                            >
                                Info
                            </Button>
                        </>
                    )}

                    {auth.merchant && (
                        <>
                            {" "}
                            <ButtonToggle
                                active={row.is_active}
                                onClick={() => handleToggleActive(row)}
                                activeIcon={<Eye className="w-4 h-4" />}
                                inactiveIcon={<EyeClosed className="w-4 h-4" />}
                                activeVariant="success"
                                inactiveVariant="danger"
                                size="sm"
                            />
                            <Button
                                variant="warning"
                                size="xs"
                                onClick={() => handleVerification(row)}
                            >
                                Verifikasi
                            </Button>
                            {merchantActionButtons.map((btn, idx) => (
                                <Button
                                    key={idx}
                                    variant={btn.variant}
                                    size="xs"
                                    href={route(btn.route, { venue: row.slug })}
                                    className="flex items-center w-auto gap-1.5 px-3 min-w-max"
                                >
                                    {btn.icon}
                                    <span>{btn.label}</span>
                                </Button>
                            ))}
                            <Button
                                variant="danger"
                                size="xs"
                                onClick={() => handleDelete(row)}
                                className="flex items-center w-auto gap-1.5 px-3 min-w-max"
                            >
                                <Trash2 className="w-4 h-4" />
                                <span>Hapus</span>
                            </Button>
                        </>
                    )}
                </div>
            ),
        });

        return cols;
    }, [auth, venues.current_page, venues.per_page]);

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
