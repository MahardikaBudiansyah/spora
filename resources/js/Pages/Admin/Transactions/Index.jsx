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
        { key: "number", header: "#", className: "text-center content-center" },
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

                if (row.order_type_label === "Booking") {
                    return row.order.venue?.name || "-";
                } else if (row.order_type_label === "Membership") {
                    return row.order.membership_package?.venue?.name || "-";
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

                if (row.order_type_label === "Booking") {
                    // jika booking_customers ada, bisa ambil nama utama atau gabungan
                    return row.order.customer?.name || "-";
                } else if (row.order_type_label === "Membership") {
                    return row.order?.user?.name || "-";
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
                if (row.order_type_label === "Booking") {
                    phone = row.order.customer?.phone_number || "-";
                } else if (row.order_type_label === "Membership") {
                    phone = row.order?.user?.phone_number || "-";
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
            <Head title="Daftar Transaksi" />
            <Card className="flex flex-col h-full rounded-lg shadow-none dark:border-none">
                <CardHeader className="">
                    <div className="flex flex-row justify-between items-center p-4">
                        <div className="font-bold uppercase text-lg">
                            Daftar Data Transaksi
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
                </CardBody>

                <CardFooter className="my-8 p-8 flex justify-end gap-2"></CardFooter>
            </Card>
        </AdminLayout>
    );
}
