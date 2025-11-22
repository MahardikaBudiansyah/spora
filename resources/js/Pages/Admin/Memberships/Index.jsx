import { useState } from "react";
import { Head, usePage, router, Link } from "@inertiajs/react";
import { toast } from "react-toastify";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
} from "@/components/Common/Card";
import Table from "@/components/Common/Table";
import Button from "@/components/Common/Button";
import Pagination from "@/components/common/Pagination";
import DeleteModal from "@/components/common/DeleteModal";

import { formatTo08 } from "@/utils/numberPhone";
import { formatShortDate, formatFullDateTime } from "@/utils/date";
import { formatRupiah } from "@/utils/currency";
import {
    formatDiscountLimit,
    getMembershipStatus,
} from "@/utils/membershipAttribute";
import { getInvoiceStatus } from "@/utils/invoiceAttribute";
import Badge from "@/components/Common/Badge";

export default function Index() {
    const { memberships = [] } = usePage().props;
    console.log("membership: ", memberships);

    const columns = [
        { key: "number", header: "#", className: "text-center content-center" },
        {
            key: "order_no",
            header: "Nomor Pesanan",
            className: "content-center",
        },
        {
            key: "venue_name",
            header: "Venue",
            render: (val, row) => row.membership_package?.venue?.name || "-",
            className: "text-center content-center",
        },
        {
            key: "membership_packages",
            header: "Paket Membership",
            render: (val, row) => row.membership_package?.name || "-",
            className: "text-center content-center",
        },
        {
            key: "phone_number",
            header: "Nomor Handphone Penyewa",
            render: (val, row) =>
                formatTo08(row.membership_user?.user?.phone_number) || "-",
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
            key: "total_price",
            header: "Total Harga",
            render: (val, row) => formatRupiah(row.total_price) || "-",
            className: "text-right content-center w-32",
        },
        {
            key: "status",
            header: "Status Membership",
            render: (val, row) => {
                const status = row.status; // atau val juga bisa
                const { label, color } = getMembershipStatus(status);
                return <Badge color={color}>{label}</Badge>;
            },
            className: "text-center content-center w-40",
        },
        {
            key: "invoice_status",
            header: "Status Transaksi",
            render: (val, row) => {
                const status = row.invoice?.status ?? "-";
                const { label, color } = getInvoiceStatus(status);
                return <Badge color={color}>{label}</Badge>;
            },
            className: "text-center content-center",
        },

        {
            key: "created_at",
            header: "Tanggal Pesanan",
            render: (val, row) => formatFullDateTime(row.created_at) || "-",
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
                        onClick={() => handleInfo(row)}
                    >
                        Info
                    </Button>
                </div>
            ),
        },
    ];

    const handleInfo = (row) => {
        router.get(route("admin.memberships.show", { membership: row.slug }));
    };

    return (
        <AdminLayout>
            <Head title="Daftar Data Pesanan Membership" />
            <Card className="flex flex-col h-full rounded-lg shadow-none dark:border-none">
                <CardHeader className="">
                    <div className="flex flex-row justify-between items-center p-4">
                        <div className="font-bold uppercase text-lg">
                            Daftar Data Pesanan Membership
                        </div>
                        <Button
                            variant="primary"
                            size="xs"
                            onClick={() => handlePrint()}
                        >
                            Cetak Data
                        </Button>
                    </div>
                </CardHeader>
                <CardBody className="px-0 pb-8">
                    <Table
                        columns={columns}
                        data={memberships.data}
                        wrapperClassName="border-none rounded-none shadow-none"
                        tableClassName="text-xs"
                        emptyState={
                            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                                Tidak ada data Pesanan Membership.{" "}
                            </div>
                        }
                    />
                    <Pagination
                        links={memberships.links}
                        meta={memberships}
                        className="p-6 my-2"
                    />
                </CardBody>

                <CardFooter className="my-8 p-8 flex justify-end gap-2"></CardFooter>
            </Card>
        </AdminLayout>
    );
}
