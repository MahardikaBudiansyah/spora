import Table from "@/components/Common/Table";
import Button from "@/components/Common/Button";
import Pagination from "@/components/common/Pagination";
import Badge from "@/components/Common/Badge";
import ButtonToggle from "@/components/Common/ButtonToggle";
import { Eye, EyeClosed } from "lucide-react";
import { formatTo08 } from "@/utils/numberPhone";
import { formatFullDateTime } from "@/utils/date";
import { getMerchantStatus } from "@/utils/attributes/merchantAttribute";
import { getVenuesCountBadge } from "@/utils/attributes/venueAttribute";
import { formatFullAddress } from "@/utils/address";

export default function MerchantTable({
    merchants,
    handleToggleActive,
    handleVerification,
    handleInfo,
    handleDelete,
}) {
    const columns = [
        {
            key: "number",
            header: "#",
            render: (_, __, index) => {
                const currentPage =
                    merchants.current_page || merchants.meta?.current_page || 1;
                const perPage =
                    merchants.per_page || merchants.meta?.per_page || 10;

                return (currentPage - 1) * perPage + index + 1;
            },
            className: "text-center content-start",
        },
        {
            key: "name",
            header: "Nama Mitra",
            className: "content-start whitespace-nowrap",
        },
        {
            key: "email",
            header: "email",
            className: "text-left content-start truncate",
        },
        {
            key: "address",
            header: "Alamat",
            className: `min-w-[200px] max-w-[500px] content-start`,
            render: (val, row) => {
                const address = formatFullAddress(
                    row?.profile?.address?.full_address,
                );
                return (
                    <div className="break-words line-clamp-4">{address}</div>
                );
            },
        },
        {
            key: "phone_number",
            header: "No Handphone",
            render: (val, row) => formatTo08(row.phone_number) || "-",
            className: "text-center content-start whitespace-nowrap",
        },
        {
            key: "venues_count",
            header: "Venue",
            className: "text-center content-start w-32",
            render: (val, row) => {
                const { label, color } = getVenuesCountBadge(row.venues_count);
                return <Badge color={color}>{label}</Badge>;
            },
        },
        {
            key: "created_at",
            header: "Pendaftaran",
            render: (val, row) => formatFullDateTime(row.created_at) || "-",
            className: "text-center content-start whitespace-nowrap",
        },
        {
            key: "status",
            header: "Status",
            render: (val, row) => {
                const history = row.latest_status;
                if (!history) return "-";

                const { label, color } = getMerchantStatus(row.status);

                return (
                    <div className="flex flex-col gap-1 whitespace-nowrap">
                        <span>
                            <Badge color={color} className="font-bold">
                                {label}
                            </Badge>
                        </span>
                        <span>{formatFullDateTime(history.created_at)}</span>
                    </div>
                );
            },
            className: "text-center content-start",
        },
        {
            key: "action",
            header: "Aksi",
            className: "text-center content-start",
            render: (val, row) => (
                <div className="flex gap-2 justify-center">
                    <ButtonToggle
                        active={row.is_active}
                        onClick={() => handleToggleActive(row)}
                        activeIcon={<Eye className="w-4 h-4" />}
                        inactiveIcon={<EyeClosed className="w-4 h-4" />}
                        tooltipActive="Aktif"
                        tooltipInactive="Nonaktif"
                        activeVariant="success"
                        inactiveVariant="danger"
                        size="sm"
                    />
                    <Button
                        variant="warning"
                        size="xs"
                        onClick={() => handleVerification(row)}
                    >
                        Validasi
                    </Button>
                    <Button
                        variant="info"
                        size="xs"
                        onClick={() => handleInfo(row)}
                    >
                        Info
                    </Button>
                    <Button
                        variant="danger"
                        size="xs"
                        onClick={() => handleDelete(row)}
                    >
                        Hapus
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="py-2 flex-1 overflow-x-auto">
            <Table
                columns={columns}
                data={merchants}
                wrapperClassName="border-none rounded-none shadow-none"
                tableClassName="text-xs"
                emptyState={
                    <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                        Tidak ada data Mitra.{" "}
                    </div>
                }
            />
            {merchants.links && (
                <Pagination
                    links={merchants}
                    meta={merchants}
                    className="p-6 my-2"
                />
            )}
        </div>
    );
}
