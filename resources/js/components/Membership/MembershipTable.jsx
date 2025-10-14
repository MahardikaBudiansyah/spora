// components/Membership/MembershipTable.jsx
import Table from "@/components/Common/Table";
import Pagination from "@/components/Common/Pagination";
import Button from "@/components/Common/Button";
import { formatShortDate, formatDateTime } from "@/utils/date";
import { formatTo08 } from "@/utils/numberPhone";
import {
    formatDiscountLimit,
    getMembershipStatus,
} from "@/utils/membershipAttribute";
import Badge from "@/components/Common/Badge";

export default function MembershipTable({ memberships, onInfo = () => {} }) {
    const columns = [
        {
            key: "order_no",
            header: "Nomor Pesanan",
            className: "text-left content-center truncate",
        },
        {
            key: "user_name",
            header: "Nama Member",
            render: (val, row) => row.user.user_name || "-",
            className: "text-left content-center",
        },
        {
            key: "phone_number",
            header: "Nomor Penyewa",
            render: (val, row) => formatTo08(row.user.phone_number) || "-",
            className: "text-center content-center",
        },
        {
            key: "package_name",
            header: "Nama Paket",
            render: (val, row) => row.membership_package.package_name || "-",
            className: "text-center content-center",
        },
        {
            key: "remaining_discount_limits",
            header: "Sisa Batas Diskon",
            render: (val, row) => {
                const { label, color } = formatDiscountLimit(
                    row.remaining_discount_limits
                );
                return <Badge color={color}>{label}</Badge>;
            },
            className: "text-center content-center",
        },
        {
            key: "start_date",
            header: "Tanggal Dimulai",
            render: (val) => formatShortDate(val) || "-",
            className: "text-center content-center",
        },
        {
            key: "end_date",
            header: "Tanggal Berakhir",
            render: (val) => formatShortDate(val) || "-",
            className: "text-center content-center",
        },
        {
            key: "status",
            header: "Status Membership",
            render: (val, row) => {
                const status = row.status; // atau val juga bisa
                const { label, color } = getMembershipStatus(status);
                return <Badge color={color}>{label}</Badge>;
            },
            className: "text-center content-center",
        },
        {
            key: "action",
            header: "Aksi",
            className: "text-center content-center",
            render: (val, row) => (
                <div className="flex gap-2 justify-center">
                    <Button
                        variant="info"
                        size="xs"
                        onClick={() => onInfo(row)}
                    >
                        Info
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div>
            <div className="flex flex-row gap-4 justify-end mb-4"></div>
            <Table
                columns={columns}
                data={memberships.data}
                wrapperClassName="border-none rounded-none shadow-none"
                tableClassName="text-xs "
                emptyState={
                    <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                        Tidak ada data Membership.
                    </div>
                }
            />

            <Pagination
                links={memberships.links}
                meta={memberships}
                className="p-6 my-2"
            />
        </div>
    );
}
