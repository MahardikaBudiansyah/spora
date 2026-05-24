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
        {
            key: "number",
            header: "#",
            className: "text-center content-center",
            render: (_, __, index) => {
                const currentPage =
                    payments.current_page || payments.meta?.current_page || 1;
                const perPage =
                    payments.per_page || payments.meta?.per_page || 10;
                return (currentPage - 1) * perPage + index + 1;
            },
        },
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

                if (row.invoice.order_type === "booking") {
                    return row.invoice.order.venue_name_snapshot || "-";
                } else if (row.invoice.order_type === "membership") {
                    return row.invoice.order.venue_name_snapshot || "-";
                }
                return "-";
            },
            className: "text-center content-center",
        },
        {
            key: "phone_number",
            header: "No Handphone Konsumen",
            render: (val, row) => {
                if (!row.invoice?.order) return "-";

                let phone = "-";
                if (row.invoice.order_type === "booking") {
                    phone =
                        row.invoice.order.customer_phone_number_snapshot || "-";
                } else if (row.invoice.order_type === "membership") {
                    phone =
                        row.invoice.order.member_number_phone_snapshot || "-";
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
            <Head title="Kelola Data Pembayaran" />
            <Card className="flex flex-col h-full rounded-md shadow-none">
                <CardHeader className="p-4 md:p-6">
                    <div className="p-2 flex flex-col md:flex-row justify-between gap-6 md:items-center">
                        <div className="flex flex-col md:gap-1 md:text-left">
                            <div className="flex flex-row md:flex-row gap-2 font-bold text-2xl items-center ">
                                <span>Kelola</span>
                                <span className="text-primary-600 dark:text-primary-500">
                                    Data Pembayaran
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
                    </div>
                </CardBody>

                <CardFooter className="p-6 md:p-8 flex gap-2 justify-end"></CardFooter>
            </Card>
        </AdminLayout>
    );
}
