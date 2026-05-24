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
import Badge from "@/components/common/Badge";

import { formatTo08 } from "@/utils/numberPhone";
import { formatFullDateTime } from "@/utils/date";
import { formatRupiah } from "@/utils/currency";
import { getInvoiceStatus } from "@/utils/attributes/invoiceAttribute";

export default function Index() {
    const { transactions = [] } = usePage().props;

    console.log(transactions);
    const columns = [
        {
            key: "number",
            header: "#",
            className: "text-center content-center",
            render: (_, __, index) => {
                const currentPage =
                    transactions.current_page ||
                    transactions.meta?.current_page ||
                    1;
                const perPage =
                    transactions.per_page || transactions.meta?.per_page || 10;
                return (currentPage - 1) * perPage + index + 1;
            },
        },
        { key: "invoice_no", header: "Invoice", className: "content-center" },
        {
            key: "order",
            header: "Nomor Pesanan",
            className: "content-center",
            render: (val, row) => row.order?.order_no || "-",
        },
        {
            key: "order_type_label",
            header: "Tipe Pesanan",
            className: "text-center content-center",
        },
        {
            key: "venue_name",
            header: "Nama Venue",
            render: (val, row) => {
                if (!row?.order) return "-";

                if (row.order_type === "booking") {
                    return row.order.venue_name_snapshot || "-";
                } else if (row.order_type === "membership") {
                    return row.order.venue_name_snapshot || "-";
                }
                return "-";
            },
            className: "text-center content-center",
        },
        {
            key: "customer_name",
            header: "Nama Konsumen",
            render: (val, row) => {
                if (!row?.order) return "-";

                if (row.order_type === "booking") {
                    return row.order.customer_name_snapshot || "-";
                } else if (row.order_type === "membership") {
                    return row.order.member_name_snapshot || "-";
                }
                return "-";
            },
            className: "text-center content-center",
        },
        {
            key: "phone_number",
            header: "No Handphone",
            render: (val, row) => {
                if (!row?.order) return "-";

                let phone = "-";
                if (row.order_type === "booking") {
                    phone = row.order.customer_phone_number_snapshot || "-";
                } else if (row.order_type === "membership") {
                    phone = row.order?.member_number_phone_snapshot || "-";
                }
                return formatTo08(phone);
            },
            className: "text-center content-center",
        },
        {
            key: "total_amount",
            header: "Jumlah Pembayaran",
            render: (val, row) => formatRupiah(row.total_amount) || "-",
            className: "text-right content-center w-28",
        },
        {
            key: "status",
            header: "Status Transaksi",
            render: (val) => {
                const { label, color } = getInvoiceStatus(val);
                return <Badge color={color}>{label}</Badge>;
            },
            className: "text-center content-center w-32",
        },
        {
            key: "created_at",
            header: "Tanggal Pembuatan",
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
                    <Button
                        variant="primary"
                        size="xs"
                        onClick={() => handlePrintInvoices(row)}
                    >
                        Cetak
                    </Button>
                </div>
            ),
        },
    ];

    const handleInfo = (row) => {
        router.get(route("admin.transactions.show", { transaction: row.slug }));
    };

    return (
        <AdminLayout>
            <Head title="Kelola Data Transaksi" />
            <Card className="flex flex-col h-full rounded-md shadow-none">
                <CardHeader className="p-4 md:p-6">
                    <div className="p-2 flex flex-col md:flex-row justify-between gap-6 md:items-center">
                        <div className="flex flex-col md:gap-1 md:text-left">
                            <div className="flex flex-row md:flex-row gap-2 font-bold text-2xl items-center ">
                                <span>Kelola</span>
                                <span className="text-primary-600 dark:text-primary-500">
                                    Data Transaksi
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
                            data={transactions.data}
                            wrapperClassName="border-none rounded-none shadow-none"
                            tableClassName="text-xs"
                            emptyState={
                                <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                                    Tidak ada data Transaksi.{" "}
                                </div>
                            }
                        />
                        <Pagination
                            links={transactions.links}
                            meta={transactions}
                            className="p-6 my-2"
                        />
                    </div>
                </CardBody>

                <CardFooter className="p-6 md:p-8 flex gap-2 justify-end"></CardFooter>
            </Card>
        </AdminLayout>
    );
}
