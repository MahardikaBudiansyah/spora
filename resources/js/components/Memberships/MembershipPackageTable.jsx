import React, { useState } from "react";
import Table from "@/components/Common/Table";
import Button from "@/components/Common/Button";
import ButtonToggle from "@/components/Common/ButtonToggle";
import Badge from "@/components/Common/Badge";
import {
    ChevronDown,
    ChevronRight,
    Edit,
    Eye,
    EyeClosed,
    Trash2,
} from "lucide-react";
import { getMembershipPackageDuration } from "@/utils/attributes/membershipAttribute";
import {
    formatDiscount,
    translateDiscountType,
    formatRupiah,
} from "@/utils/currency";
import { formatFullDate } from "@/utils/date";

export default function MembershipPackageTable({
    packages,
    onToggle,
    onEdit,
    onDelete,
    venueContext = null,
}) {
    const [expanded, setExpanded] = useState([]);

    const toggleExpand = (id) => {
        setExpanded((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
        );
    };

    const columns = [
        {
            key: "expand",
            header: "",
            render: (_, row) =>
                row ? (
                    <button onClick={() => toggleExpand(row.id)}>
                        {expanded.includes(row.id) ? (
                            <ChevronDown className="w-4 h-4" />
                        ) : (
                            <ChevronRight className="w-4 h-4" />
                        )}
                    </button>
                ) : null,
            className: "text-center content-center",
        },
        {
            key: "name",
            header: "Nama Paket",
            render: (val, row) => (
                <div className="font-semibold">{row.name}</div>
            ),
            className: "text-left content-center whitespace-nowrap min-w-max",
        },
        {
            key: "description",
            header: "Deskripsi",
            className: "text-left content-center",
        },
        {
            key: "duration_months",
            header: "Durasi Paket",
            render: (val) => {
                const { label, color } = getMembershipPackageDuration(val);
                return <Badge color={color}>{label}</Badge>;
            },
            className: "text-center content-center whitespace-nowrap min-w-max",
        },
        {
            key: "price",
            header: "Harga",
            render: (val) => formatRupiah(val),
            className: "text-right content-center whitespace-nowrap min-w-max",
        },
        {
            key: "updated_at",
            header: "Tanggal Pembaruan",
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
                    <Button
                        variant="success"
                        size="xs"
                        onClick={() => onEdit(row)}
                        className="flex items-center w-auto gap-1.5 px-3 min-w-max"
                    >
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
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
            className: "text-center",
        },
    ];

    const columnBenefits = [
        {
            key: "type",
            header: "Tipe Manfaat",
            className: "text-center ",
        },
        { key: "name", header: "Nama Manfaat", className: "content-left" },
        { key: "description", header: "Deskripsi", className: "content-left" },
        {
            key: "discount_type",
            header: "Jenis Diskon",
            className: "text-center ",
            render: (_, row) => translateDiscountType(row.discount_type),
        },
        {
            key: "discount_value",
            header: "Nilai Diskon",
            className: "text-center  whitespace-nowrap w-32",
            render: (_, row) => row.discount_value,
        },
        {
            key: "discount_limit",
            header: "Limit Diskon",
            className: "text-center  whitespace-nowrap w-32",
            render: (_, row) => {
                if (row.type === "Lainnya") {
                    return "-";
                }

                if (!row.discount_limit) {
                    return <Badge color="green">Tidak terbatas</Badge>;
                }

                return (
                    <Badge color="green">{row.discount_limit} slot/jam</Badge>
                );
            },
        },
    ];

    const renderExpandRow = (row) => {
        if (!row) return null;
        const combinedBenefits = [
            ...(row.discounts || []).map((d) => ({
                id: `discount-${d.id}`,
                type: "Diskon",
                name: d.name,
                description: d.description || "-",
                discount_type: d.discount_type,
                discount_value: formatDiscount(
                    d.discount_type,
                    d.discount_value,
                ),
                discount_limit: d.discount_limit,
            })),
            ...(row.others || []).map((o) => ({
                id: `other-${o.id}`,
                type: "Lainnya",
                name: o.name,
                description: o.description || "-",
                discount_type: "-",
                discount_value: "-",
            })),
        ];

        return (
            <div className="px-8 pt-4 pb-8 flex flex-col gap-4 bg-white dark:bg-secondary-900 border-b-2 border-b-secondary-200 dark:border-secondary-700">
                <span className="font-semibold">
                    Manfaat Membership: {row.name}
                </span>
                <Table
                    columns={columnBenefits}
                    data={combinedBenefits}
                    wrapperClassName="shadow-sm"
                    tableClassName="text-xs"
                    emptyState={
                        <div className="text-center text-sm text-gray-500">
                            Tidak ada Manfaat Membership.
                        </div>
                    }
                />
            </div>
        );
    };

    return (
        <Table
            columns={columns}
            data={Array.isArray(packages) ? packages : packages || []}
            wrapperClassName="border-none rounded-none shadow-none"
            tableClassName="text-xs"
            expandedRowKeys={expanded}
            renderExpandRow={renderExpandRow}
            emptyState={
                <div className="text-center text-sm text-secondary-500 dark:text-secondary-400">
                    Tidak ada data Paket Membership.
                </div>
            }
        />
    );
}
