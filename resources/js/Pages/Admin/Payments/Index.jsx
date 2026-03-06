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
import Badge from "@/components/Common/Badge";

import { formatTo08 } from "@/utils/numberPhone";
import { formatRupiah } from "@/utils/currency";
import { formatFullDateTime } from "@/utils/date";
import {
    getPaymentStatus,
    getPaymentMethod,
    getPaymentType,
} from "@/utils/attributes/paymentAttribute";

export default function Index() {
    const { payments = [] } = usePage().props;

    const columns = [
        { key: "number", header: "#", className: "text-center content-center" },
        {
            key: "invoice_no",
            header: "Invoice",
            render: (val, row) => row.invoice?.invoice_no || "-",
            className: "content-center",
        },
        {
            key: "order_no",
            header: "Nomor Pesanan",
            render: (val, row) => row.invoice?.order?.order_no || "-",
            className: "content-center",
        },
        {
            key: "order_type",
            header: "Tipe Pesanan",
            render: (val, row) => row.invoice?.order_type_label || "-",
            className: "text-center content-center",
        },
        {
            key: "venue_name",
            header: "Nama Venue",
            render: (val, row) => {
                if (!row.invoice?.order) return "-";

                if (row.invoice.order_type_label === "Booking") {
                    return row.invoice.order.venue?.name || "-";
                } else if (row.invoice.order_type_label === "Membership") {
                    return (
                        row.invoice.order.membership_package?.venue?.name || "-"
                    );
                }
                return "-";
            },
            className: "text-center content-center",
        },
        {
            key: "phone_number",
            header: "No Handphone Pemesan",
            render: (val, row) => {
                if (!row.invoice?.order) return "-";

                let phone = "-";
                if (row.invoice.order_type_label === "Booking") {
                    phone = row.invoice.order.customer?.phone_number || "-";
                } else if (row.invoice.order_type_label === "Membership") {
                    phone =
                        row.invoice.order.membership_user?.user?.phone_number ||
                        "-";
                }
                return formatTo08(phone);
            },
            className: "text-center content-center",
        },

        {
            key: "payment_type",
            header: "Tipe Pembayaran",
            render: (val) => {
                const { label, color } = getPaymentType(val);
                return <Badge color={color}>{label}</Badge>;
            },
            className: "text-center content-center",
        },
        {
            key: "payment_method",
            header: "Metode Pembayaran",
            render: (val) => {
                const { label, color } = getPaymentMethod(val);
                return <Badge color={color}>{label}</Badge>;
            },
            className: "text-center content-center",
        },
        {
            key: "amount",
            header: "Jumlah Pembayaran",
            render: (val, row) => formatRupiah(row.amount) || "-",
            className: "text-right content-center w-28",
        },
        {
            key: "payment_status",
            header: "Status Pembayaran",
            render: (val) => {
                const { label, color } = getPaymentStatus(val);
                return <Badge color={color}>{label}</Badge>;
            },
            className: "text-center content-center",
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
                </div>
            ),
        },
    ];

    const handleInfo = (row) => {
        router.get(route("admin.payments.show", { transaction: row.slug }));
    };

    return (
        <AdminLayout>
            <Head title="Daftar Pembayaran" />
            <Card className="flex flex-col h-full rounded-lg shadow-none dark:border-none">
                <CardHeader className="">
                    <div className="flex flex-row justify-between items-center p-4">
                        <div className="font-bold uppercase text-lg">
                            Daftar Data Pembayaran
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
                        data={payments.data}
                        wrapperClassName="border-none rounded-none shadow-none"
                        tableClassName="text-xs"
                        emptyState={
                            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                                Tidak ada data Pembayaran.
                            </div>
                        }
                    />
                    <Pagination
                        links={payments.links}
                        meta={payments}
                        className="p-6 my-2"
                    />
                </CardBody>

                <CardFooter className="my-8 p-8 flex justify-end gap-2"></CardFooter>
            </Card>
        </AdminLayout>
    );
}
