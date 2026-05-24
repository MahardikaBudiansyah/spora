import React from "react";
import Table from "@/components/Common/Table";
import Button from "@/components/Common/Button";
import Pagination from "@/components/Common/Pagination";
import Badge from "@/components/Common/Badge";
import { Eye, EyeClosed, FileText, StickyNote, Trash2 } from "lucide-react";
import ButtonToggle from "@/components/Common/ButtonToggle";
import { getMembershipCardInfo } from "@/utils/attributes/membershipAttribute";
import { formatFullDate } from "@/utils/date";
import { formatTo08 } from "@/utils/numberPhone";

export default function MembershipCardTable({
    membershipCards,
    viewMode = "venue",
    onToggle,
    onEdit,
    onPrint,
    onDelete,
}) {
    const showVenueColumn = viewMode === "global" || viewMode === "admin";

    const baseColumns = [
        { key: "number", header: "#", className: "text-center content-center" },
        {
            key: "member_no",
            header: "Nomor Member",
            className:
                "text-center content-center whitespace-nowrap min-w-max ",
        },
        {
            key: "name",
            header: "Nama Member",
            render: (val, row) => row.customer?.name || row.name || "-",
            className: "text-left content-center break-words",
        },
        {
            key: "phone_number",
            header: "No Handphone Member",
            render: (val, row) => {
                const phone = row.customer?.phone_number || row.phone_number;
                return phone ? formatTo08(phone) : "-";
            },
            className: "text-center content-center",
        },
        {
            key: "email",
            header: "Email Member",
            render: (val, row) => row.customer?.email || row.email || "-",
            className: "text-left content-center max-w-40 break-words",
        },
    ];

    const venueColumn = {
        key: "venue",
        header: "Venue",
        render: (val, row) => row.venue?.name || "-",
        className: "text-center content-center",
    };

    const commonColumns = [
        ...(!showVenueColumn ? [] : [venueColumn]),
        {
            key: "is_active",
            header: "Status",
            render: (val, row) => {
                const activeStatus = !!val;
                const { label, color } = getMembershipCardInfo(activeStatus);
                return <Badge color={color}>{label}</Badge>;
            },
            className: "text-center content-center whitespace-nowrap min-w-max",
        },
        {
            key: "notes",
            header: "Catatan",
            render: (val, row) =>
                row.notes ? (
                    <div
                        className="text-left line-clamp-3 cursor-help"
                        title={row.notes}
                    >
                        {row.notes}
                    </div>
                ) : (
                    <div className="text-center text-gray-500">-</div>
                ),
            className: "text-left content-center max-w-36 break-words",
        },
        {
            key: "created_at",
            header: "Tanggal Pendaftaran",
            render: (val) => formatFullDate(val),
            className: "text-center content-center whitespace-nowrap min-w-max",
        },
        {
            key: "action",
            header: "Aksi",
            render: (val, row) => (
                <div className="flex gap-2 justify-center">
                    <ButtonToggle
                        active={row.is_active}
                        onClick={() => onToggle(row)}
                        activeIcon={<Eye className="w-4 h-4" />}
                        inactiveIcon={<EyeClosed className="w-4 h-4" />}
                        tooltipActive="Aktif"
                        tooltipInactive="Nonaktif"
                        activeVariant="success"
                        inactiveVariant="danger"
                        size="sm"
                    />
                    {viewMode !== "admin" && (
                        <Button
                            variant="warning"
                            size="xs"
                            onClick={() => onEdit(row)}
                            className="flex items-center w-auto gap-1.5 px-3 min-w-max"
                        >
                            <StickyNote className="w-4 h-4" />
                            <span>Catatan</span>
                        </Button>
                    )}
                    <Button
                        variant="sky"
                        size="xs"
                        onClick={() => onPrint(row)}
                        className="flex items-center w-auto gap-1.5 px-3 min-w-max"
                    >
                        <FileText className="w-4 h-4" />
                        <span>Cetak</span>
                    </Button>
                    <Button
                        variant="danger"
                        size="xs"
                        onClick={() => onDelete(row)}
                        className="flex items-center w-auto gap-1.5 px-3 min-w-max"
                    >
                        <Trash2 className="w-4 h-4" />
                        <span>Hapus</span>
                    </Button>
                </div>
            ),
            className: "text-center content-center",
        },
    ];

    const columns = baseColumns.concat(commonColumns);

    return (
        <div className="py-2 flex-1 overflow-visible overflow-x-auto">
            <Table
                columns={columns}
                data={membershipCards.data}
                wrapperClassName="border-none rounded-none shadow-none"
                tableClassName="text-xs"
                emptyState={
                    <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                        Tidak ada data Member Aktif.
                    </div>
                }
            />
            {membershipCards.links && (
                <Pagination
                    links={membershipCards.links}
                    meta={membershipCards.meta}
                    className="p-6 my-2"
                />
            )}
        </div>
    );
}
