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
import { formatShortDate, formatFullDateTime } from "@/utils/date";
import { formatRupiah } from "@/utils/currency";
import { getBookingStatus } from "@/utils/attributes/bookingAttribute";
import { getInvoiceStatus } from "@/utils/attributes/invoiceAttribute";
import Badge from "@/components/Common/Badge";
import SearchInput from "@/components/Common/SearchInput";
import DevelopmentPlaceholder from "@/components/Common/DevelopmentPlaceholder";
import {
    ArrowLeft,
    ChevronDown,
    DollarSign,
    FileText,
    Info,
    Plus,
    Search,
    ShoppingBag,
    Users,
} from "lucide-react";
import IconButton from "@/components/Common/IconButton";
import StatCard from "@/components/Common/StatCard";

export default function Index() {
    const {
        transactions: { data: transactions },
        venue,
        totals,
    } = usePage().props;

    console.log(transactions);

    const [showPrintModal, setShowPrintModal] = useState(false);

    const columns = [
        {
            key: "invoice_no",
            header: "No. Invoice",
            className: "content-center text-center",
        },
        {
            key: "customer",
            header: "Pelanggan",
            // Kamu bisa menambahkan data customer di order_detail Resource
            render: (val, row) => (
                <div className="text-left">
                    <p className="font-medium">
                        {row.order_detail?.customer_name ?? "-"}
                    </p>
                    <p className="text-xs text-gray-500">
                        {row.order_detail?.customer_phone ?? "-"}
                    </p>
                </div>
            ),
            className: "content-center",
        },
        {
            key: "order_type",
            header: "Jenis Pesanan",
            className: "content-center text-center capitalize",
        },
        {
            key: "created",
            header: "Tanggal Transaksi",
            render: (val, row) => formatFullDateTime(row?.dates?.created),
            className: "content-center text-center",
        },
        {
            key: "total_amount",
            header: "Total Tagihan",
            render: (val, row) => formatRupiah(row?.amount?.total),
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
                    <Button
                        variant="info"
                        size="xs"
                        onClick={() => setShowPrintModal(true)}
                        className="flex items-center w-auto gap-1.5 px-3 min-w-max"
                    >
                        <Info className="w-4 h-4" strokeWidth={2.5} />
                        <span className="">Info</span>
                    </Button>
                    <Button
                        variant="sky"
                        size="xs"
                        onClick={() => setShowPrintModal(true)}
                        className="flex items-center w-auto gap-1.5 px-3 min-w-max"
                    >
                        <FileText className="w-4 h-4" />
                        <span>Cetak</span>
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <MerchantLayout>
            <Head title={`Daftar Transaksi - ${venue.name}`} />
            <Card className="flex flex-col h-full rounded-md shadow-none">
                <CardHeader className="p-4 md:p-6">
                    <div className="p-2 flex flex-col md:flex-row justify-between gap-6 md:items-center">
                        <div className="flex flex-col md:gap-1 justify-center text-center md:text-left">
                            <div className="flex flex-col md:flex-row font-bold text-2xl">
                                <span>Daftar Transaksi</span>
                            </div>
                            <div className="text-sm text-secondary-600 dark:text-secondary-400">
                                <span>Venue </span>
                                <span>{venue.name}</span>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardBody className="py-4 md:py-6 px-0 min-h-[280px] sm:min-h-[310px] flex flex-col">
                    <div className="py-2 flex-1 overflow-x-auto">
                        <div className="flex flex-row gap-2 justify-between px-8">
                            <div className="flex flex-row gap-2">
                                <SearchInput className="hidden md:flex" />
                                <IconButton className="block md:hidden">
                                    <Search className="w-4 h-4" />
                                </IconButton>
                                <Button
                                    variant="primary"
                                    size="xs"
                                    className="hidden md:flex gap-2"
                                >
                                    Semua Status Pesanan
                                    <ChevronDown className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="primary"
                                    size="xs"
                                    className="hidden md:flex gap-2"
                                >
                                    Semua Status Transaksi
                                    <ChevronDown className="w-4 h-4" />
                                </Button>
                            </div>
                            <div className="flex flex-row gap-2">
                                <Button
                                    variant="outline"
                                    size="xs"
                                    onClick={() => setShowPrintModal(true)}
                                    className="px-2 md:px-3 gap-1.5"
                                >
                                    <FileText className="w-4 h-4" />
                                    <span>Cetak Data</span>
                                </Button>
                            </div>
                        </div>
                        <div className="py-4 px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-6">
                            <StatCard
                                variant="minimal"
                                title="Total Booking"
                                value="1,240 Order"
                                description="dari bulan lalu"
                                trend="+12%"
                                trendType="positive"
                                Icon={ShoppingBag}
                            />
                            <StatCard
                                variant="minimal"
                                title="Total Revenue"
                                value="Rp 45.200.000"
                                description="target tercapai"
                                trend="+8.5%"
                                trendType="positive"
                                Icon={DollarSign}
                                iconBgColor="bg-emerald-50"
                                iconColor="text-emerald-600"
                            />
                            <StatCard
                                variant="minimal"
                                title="Pelanggan Baru"
                                value="180 User"
                                description="penurunan traffic"
                                trend="-3.2%"
                                trendType="negative"
                                Icon={Users}
                                iconBgColor="bg-blue-50"
                                iconColor="text-blue-600"
                            />
                            <StatCard
                                variant="minimal"
                                title="Pencarian Terpopuler"
                                value="Sepatu Lari"
                                description="kata kunci minggu ini"
                                Icon={Search}
                                iconBgColor="bg-orange-50"
                                iconColor="text-orange-600"
                            />
                        </div>
                        <Table
                            columns={columns}
                            data={transactions}
                            wrapperClassName="border-none rounded-none shadow-none"
                            tableClassName="text-xs"
                            emptyState={
                                <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                                    Tidak ada data Transaksi.
                                </div>
                            }
                        />
                        <Pagination
                            links={transactions}
                            meta={transactions}
                            className="p-6 my-2"
                        />
                    </div>
                </CardBody>

                <CardFooter className="p-6 md:p-8 flex gap-2 justify-end">
                    <Button
                        variant="light"
                        size="xs"
                        onClick={() =>
                            router.get(route("merchant.venues.index"))
                        }
                        className="flex gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Kembali</span>
                    </Button>
                </CardFooter>
            </Card>

            <DevelopmentPlaceholder
                title={`Cetak Data Member ${venue.name}`}
                show={showPrintModal}
                onClose={() => setShowPrintModal(false)}
            />
        </MerchantLayout>
    );
}
