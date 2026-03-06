import Table from "@/components/Common/Table";
import Button from "@/components/Common/Button";
import Pagination from "@/components/common/Pagination";
import Badge from "@/components/Common/Badge";
import ButtonToggle from "@/components/Common/ButtonToggle";
import { Eye, EyeClosed } from "lucide-react";
import { formatTo08 } from "@/utils/numberPhone";
import { formatFullDateTime } from "@/utils/date";
import {
    getUserStatus,
    getUserMembershipStatus,
    getUserBookingStatus,
} from "@/utils/attributes/userAttribute";

export default function UserTable({
    users,
    handleToggleActive,
    handleInfo,
    handleDelete,
}) {
    const columns = [
        {
            key: "number",
            header: "#",
            render: (_, __, index) => {
                const currentPage =
                    users.current_page || users.meta?.current_page || 1;
                const perPage = users.per_page || users.meta?.per_page || 10;

                return (currentPage - 1) * perPage + index + 1;
            },
            className: "text-center content-start",
        },
        {
            key: "name",
            header: "Nama User",
            className: "content-start whitespace-nowrap",
        },
        {
            key: "email",
            header: "email",
            className: "text-left content-start truncate",
        },
        {
            key: "phone_number",
            header: "No Handphone",
            render: (val, row) => formatTo08(row.phone_number) || "-",
            className: "text-center content-start",
        },
        {
            key: "membership_cards_count",
            header: "Membership",
            className: "text-center content-start whitespace-nowrap",
            render: (val, row) => {
                const { label, color } = getUserMembershipStatus(
                    row.membership_cards_count,
                );
                return <Badge color={color}>{label}</Badge>;
            },
        },
        {
            key: "bookings_count",
            header: "Riwayat Booking",
            className: "text-center content-start whitespace-nowrap",
            render: (val, row) => {
                const { label, color } = getUserBookingStatus(
                    row.booking_customers_count,
                );
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

                const { label, color } = getUserStatus(row.status);

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
                data={users}
                wrapperClassName="border-none rounded-none shadow-none"
                tableClassName="text-xs"
                emptyState={
                    <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                        Tidak ada data User.{" "}
                    </div>
                }
            />
            {users.links && (
                <Pagination links={users} meta={users} className="p-6 my-2" />
            )}
        </div>
    );
}
