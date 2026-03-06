import Table from "@/components/Common/Table";
import Pagination from "@/components/Common/Pagination";
import Button from "@/components/Common/Button";
import { formatTo08 } from "@/utils/numberPhone";
import { getMembershipOrderStatus } from "@/utils/attributes/membershipAttribute";
import Badge from "@/components/Common/Badge";
import { Info } from "lucide-react";

export default function MembershipOrderTable({
    membershipOrders,
    onInfo = () => {},
    isVenueLevel = false,
}) {
    console.log(membershipOrders);
    const baseColumns = [
        {
            key: "created_at",
            header: "Tanggal Pesanan",
            className:
                "text-center md:content-center whitespace-nowrap mix-w-max",
        },
        {
            key: "order_no",
            header: "Nomor Pesanan",
            className: "text-left md:content-center",
        },
        {
            key: "member_name",
            header: "Nama Member",
            render: (val, row) => row?.member?.name || "-",
            className: "text-left md:content-center",
        },
        {
            key: "phone",
            header: "Nomor Handphone",
            render: (val, row) => formatTo08(row?.member?.phone) || "-",
            className:
                "text-center md:content-center whitespace-nowrap min-w-max",
        },
    ];

    const venueColumn = {
        key: "venue_name",
        header: "Venue",
        render: (val, row) => row?.venue?.name || "-",
        className: "text-center md:content-center",
    };

    const remainingColumns = [
        {
            key: "package_name",
            header: "Nama Paket",
            render: (val, row) => row?.package?.name || "-",
            className: "text-center md:content-center",
        },
        {
            key: "remaining_discount_limits",
            header: "Sisa Batas Diskon",
            render: (val, row) => {
                return <Badge>{row.remaining_discount_limits}</Badge>;
            },
            className:
                "text-center md:content-center whitespace-nowrap min-w-max",
        },
        {
            key: "period",
            header: "Periode Membership",
            render: (_, row) => (
                <div className="flex flex-col md:items-center">
                    {row?.period?.start_date} -{row?.period?.end_date}
                </div>
            ),
            className:
                "text-center md:content-center whitespace-nowrap min-w-max",
        },
        {
            key: "status",
            header: "Status Membership",
            render: (val, row) => {
                const status = row.status;
                const { label, color } = getMembershipOrderStatus(status);
                return <Badge color={color}>{label}</Badge>;
            },
            className:
                "text-center md:content-center whitespace-nowrap min-w-max",
        },
        {
            key: "action",
            header: "Aksi",
            className: "text-center md:content-center",
            render: (val, row) => (
                <div className="flex gap-2 justify-center">
                    <Button
                        variant="info"
                        size="xs"
                        onClick={() => onInfo(row)}
                        className="flex items-center w-auto gap-1.5 px-3 min-w-max"
                    >
                        <Info className="w-4 h-4" strokeWidth={2.5} />
                        <span>Info</span>
                    </Button>
                </div>
            ),
        },
    ];

    const columns = [
        ...baseColumns,
        !isVenueLevel && venueColumn,
        ...remainingColumns,
    ].filter(Boolean);

    return (
        <div className="flex flex-col">
            <Table
                columns={columns}
                data={membershipOrders.data}
                wrapperClassName="border-none rounded-none shadow-none"
                tableClassName="text-xs "
                emptyState={
                    <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                        Tidak ada data Membership.
                    </div>
                }
            />

            {membershipOrders.links && (
                <Pagination
                    links={membershipOrders.links}
                    meta={membershipOrders.meta}
                    className="p-6 my-2"
                />
            )}
        </div>
    );
}
