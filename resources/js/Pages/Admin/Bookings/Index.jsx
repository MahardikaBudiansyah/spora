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
import { formatFullDateTime } from "@/utils/date";
import { formatRupiah } from "@/utils/currency";
import { getBookingStatus } from "@/utils/attributes/bookingAttribute";
import { getInvoiceStatus } from "@/utils/attributes/invoiceAttribute";

export default function Index() {
    const { bookings = [] } = usePage().props;

    const columns = [
        {
            key: "number",
            header: "#",
            className: "text-center content-center",
            render: (_, __, index) => {
                const currentPage =
                    bookings.current_page || bookings.meta?.current_page || 1;
                const perPage =
                    bookings.per_page || bookings.meta?.per_page || 10;
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
            render: (val, row) => row.venue.name || "-",
            className: "content-center",
        },
        {
            key: "phone_number",
            header: "Nomor Handphone Konsumen",
            render: (val, row) => formatTo08(row.customer.phone_number) || "-",
            className: "text-center content-center",
        },
        {
            key: "total_original_price",
            header: "Total Harga",
            render: (val, row) => formatRupiah(row.total_original_price) || "-",
            className: "text-center content-center",
        },
        {
            key: "total_discount",
            header: "Total Diskon",
            render: (val, row) => formatRupiah(row.total_discount) || "-",
            className: "text-center content-center",
        },
        {
            key: "total_price",
            header: "Total Harga",
            render: (val, row) => formatRupiah(row.total_price) || "-",
            className: "text-center content-center",
        },
        {
            key: "status",
            header: "Status Pesanan",
            render: (val) => {
                const { label, color } = getBookingStatus(val);
                return <Badge color={color}>{label}</Badge>;
            },
            className: "text-center content-center",
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
            header: "Tanggal Booking",
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
        router.get(route("admin.bookings.show", { booking: row.slug }));
    };

    return (
        <AdminLayout>
            <Head title="Kelola Data Booking Lapangan" />
            <Card className="flex flex-col h-full rounded-md shadow-none">
                <CardHeader className="p-4 md:p-6">
                    <div className="p-2 flex flex-col md:flex-row justify-between gap-6 md:items-center">
                        <div className="flex flex-col md:gap-1 md:text-left">
                            <div className="flex flex-row md:flex-row gap-2 font-bold text-2xl items-center ">
                                <span>Kelola</span>
                                <span className="text-primary-600 dark:text-primary-500">
                                    Data Booking Lapangan
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
                            data={bookings.data}
                            wrapperClassName="border-none rounded-none shadow-none"
                            tableClassName="text-xs"
                            emptyState={
                                <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                                    Tidak ada data Booking Lapangan.{" "}
                                </div>
                            }
                        />
                        <Pagination
                            links={bookings.links}
                            meta={bookings}
                            className="p-6 my-2"
                        />
                    </div>
                </CardBody>

                <CardFooter className="p-6 md:p-8 flex gap-2 justify-end"></CardFooter>
            </Card>
        </AdminLayout>
    );
}
