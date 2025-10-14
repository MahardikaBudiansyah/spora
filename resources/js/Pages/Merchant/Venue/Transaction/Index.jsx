import { useState } from "react";
import { Head, usePage, router, Link } from "@inertiajs/react";
import { toast } from "react-toastify";
import MerchantLayout from "@/Layouts/MerchantLayout";
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
import { formatShortDate, formatDateTime } from "@/utils/date";
import { formatRupiah } from "@/utils/currency";
import { getBookingStatus } from "@/utils/bookingAttribute";
import { getInvoiceStatus } from "@/utils/invoiceAttribute";
import Badge from "@/components/Common/Badge";
import SearchInput from "@/components/Common/SearchInput";
import { ChevronDown } from "lucide-react";

export default function Index() {
    const { transactions, venue, totals } = usePage().props;

    const columns = [
        {
            key: "invoice_no",
            header: "No. Invoice",
            className: "content-center text-center",
        },
        {
            key: "order_type",
            header: "Jenis Pesanan",
            className: "content-center text-center",
        },
        {
            key: "created_at",
            header: "Tanggal Transaksi",
            render: (val) => formatDateTime(val),
            className: "content-center text-center",
        },
        {
            key: "total_amount",
            header: "Total Tagihan",
            render: (val, row) => formatRupiah(val),
            className: "content-center text-right",
        },
        {
            key: "status",
            header: "Status",
            render: (val) => {
                const { label, color } = getInvoiceStatus(val);
                return <Badge color={color}>{label}</Badge>;
            },
            className: "content-center text-center",
        },
        {
            key: "action",
            header: "Aksi",
            className: "content-center text-center",
            render: (val, row) => (
                <div className="flex gap-2 justify-center">
                    <Button variant="info" size="xs">
                        Info
                    </Button>
                    <Button variant="success" size="xs">
                        Cetak Invoice
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <MerchantLayout>
            <Head title={`Transaksi - ${venue.name}`} />
            <Card className="flex flex-col h-full rounded-lg shadow-none dark:border-none">
                <CardHeader className="">
                    <div className="flex flex-row justify-between items-center p-4">
                        <div className="font-bold uppercase text-lg">
                            Transaksi {venue.name}
                        </div>
                    </div>
                </CardHeader>
                <CardBody className="px-0 pb-8">
                    <div className="flex flex-row gap-4 items-center font-bold">
                        <div className="flex flex-row gap-2">
                            <span>Total Transaksi:</span>
                            <span>{totals.total_transactions}</span>
                        </div>
                        <div className="flex flex-row gap-2">
                            <span>Total Pendapatan:</span>
                            <span>{formatRupiah(totals.total_income)}</span>
                        </div>
                        <div className="flex flex-row gap-2">
                            <span>Total Belum Dibayar:</span>
                            <span>{formatRupiah(totals.total_unpaid)}</span>
                        </div>
                    </div>
                    <div className="flex flex-row gap-2 justify-between py-4 px-8">
                        <div className="flex flex-row gap-2">
                            <SearchInput />
                            <Button
                                variant="primary"
                                size="xs"
                                className="gap-2"
                            >
                                Semua Tipe
                                <ChevronDown className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="primary"
                                size="xs"
                                className="gap-2"
                            >
                                Semua Status
                                <ChevronDown className="w-4 h-4" />
                            </Button>
                        </div>
                        <div>
                            <Button variant="primary" size="xs">
                                Cetak Transaksi
                            </Button>
                        </div>
                    </div>
                    <Table
                        columns={columns}
                        data={transactions.data}
                        wrapperClassName="border-none rounded-none shadow-none"
                        tableClassName="text-xs"
                        emptyState={
                            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                                Tidak ada data Transaksi.
                            </div>
                        }
                    />
                    <Pagination
                        links={transactions.links}
                        meta={transactions}
                        className="p-6 my-2"
                    />
                </CardBody>

                <CardFooter className="my-8 p-8 flex justify-end gap-2">
                    <Button
                        variant="light"
                        type="button"
                        onClick={() =>
                            router.get(route("merchant.venues.index"))
                        }
                    >
                        Kembali ke Venue
                    </Button>
                </CardFooter>
            </Card>
        </MerchantLayout>
    );
}
