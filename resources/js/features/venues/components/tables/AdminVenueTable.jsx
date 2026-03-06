import { useMemo } from "react";
import Table from "@/components/Common/Table";
import Button from "@/components/Common/Button";
import Pagination from "@/components/common/Pagination";
import Badge from "@/components/Common/Badge";
import { formatTo08 } from "@/utils/numberPhone";
import { formatFullDateTime } from "@/utils/date";
import {
    getVenueStatus,
    getVenueCourtsCountBadge,
} from "@/utils/attributes/venueAttribute";
import { formatFullAddress } from "@/utils/address";

export default function AdminVenueTable({
    auth,
    venues,
    handleInfo,
    handleVerification,
}) {
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
            {
                key: "merchant_name",
                header: "Mitra",
                className: "content-start whitespace-nowrap",
                render: (val, row) => (row.merchant ? row.merchant.name : "-"),
            },
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
            {
                key: "court_count",
                header: "Court",
                className: "text-center content-start whitespace-nowrap",
                render: (val, row) => {
                    const { label, color } = getVenueCourtsCountBadge(
                        row.courts_count,
                    );
                    return <Badge color={color}>{label}</Badge>;
                },
            },
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
            {
                key: "action",
                header: "Aksi",
                className: "w-[750px] content-start text-center",
                render: (val, row) => (
                    <div className="flex flex-wrap gap-2 w-[200px] justify-center">
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
