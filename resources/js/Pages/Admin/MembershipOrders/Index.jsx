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
import { getMembershipOrderStatus } from "@/utils/attributes/membershipAttribute";
import { getInvoiceStatus } from "@/utils/attributes/invoiceAttribute";
import Badge from "@/components/Common/Badge";

export default function Index() {
    const { memberships = [] } = usePage().props;

    const columns = [
        {
            key: "number",
            header: "#",
            className: "text-center content-center",
            render: (_, __, index) => {
                const currentPage =
                    memberships.current_page ||
                    memberships.meta?.current_page ||
                    1;
                const perPage =
                    memberships.per_page || memberships.meta?.per_page || 10;
                return (currentPage - 1) * perPage + index + 1;
            },
        },
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
            header: "Nomor Handphone Konsumen",
            render: (val, row) =>
                formatTo08(row.membership_card?.user?.phone_number) || "-",
            className: "text-center content-center",
        },
        {
            key: "start_date",
            header: "Periode", // Ganti header
            className: "text-center content-center",
            render: (val, row) => {
                const startDate = formatShortDate(val) || "-";

                const endDate = row.end_date
                    ? formatShortDate(row.end_date)
                    : "-";

                // 3. Gabungkan dan kembalikan
                return `${startDate} - ${endDate}`;
            },
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
                const status = row.status;
                const { label, color } = getMembershipOrderStatus(status);
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
            <Head title="Kelola Data Pesanan Membership" />
            <Card className="flex flex-col h-full rounded-md shadow-none">
                <CardHeader className="p-4 md:p-6">
                    <div className="p-2 flex flex-col md:flex-row justify-between gap-6 md:items-center">
                        <div className="flex flex-col md:gap-1 md:text-left">
                            <div className="flex flex-row md:flex-row gap-2 font-bold text-2xl items-center ">
                                <span>Kelola</span>
                                <span className="text-primary-600 dark:text-primary-500">
                                    Data Pesanan Membership
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="primary"
                                size="xs"
                                onClick={() => handlePrint()}
                            >
                                Cetak Data
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardBody className="py-4 md:py-6 px-0 min-h-[280px] sm:min-h-[310px] flex flex-col">
                    <div className="py-2 flex-1 overflow-visible overflow-x-auto">
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
                    </div>
                </CardBody>

                <CardFooter className="p-6 md:p-8 flex gap-2 justify-end"></CardFooter>
            </Card>
        </AdminLayout>
    );
}
