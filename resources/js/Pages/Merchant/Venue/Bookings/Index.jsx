import React from "react";
import { Head, usePage, router } from "@inertiajs/react";
import MerchantLayout from "@/Layouts/MerchantLayout";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
} from "@/components/Common/Card";
import Button from "@/components/Common/Button";
import SearchInput from "@/components/Common/SearchInput";
import DevelopmentPlaceholder from "@/components/Common/DevelopmentPlaceholder";
import {
    ArrowLeft,
    ChevronDown,
    FileText,
    Plus,
    ShoppingBag,
    Users,
    DollarSign,
    Search,
} from "lucide-react";
import IconButton from "@/components/Common/IconButton";
import StatCard from "@/components/Common/StatCard";
import useModal from "@/hooks/useModal";
import BookingTable from "@/features/orders/components/tables/BookingTable";

export default function Index() {
    const { venue, bookings } = usePage().props;

    const { isOpen, open, close } = useModal();

    return (
        <MerchantLayout>
            <Head title={`Booking - ${venue.name}`} />
            <Card className="flex flex-col h-full rounded-md shadow-none">
                <CardHeader className="p-4 md:p-6">
                    <div className="p-2 flex flex-col md:flex-row justify-between gap-6 md:items-center">
                        <div className="flex flex-col md:gap-1 md:text-left">
                            <div className="flex flex-wrap flex-row md:flex-row gap-2 font-bold text-2xl items-center ">
                                <span>Order</span>
                                <span className="text-primary-600 dark:text-primary-500">
                                    Booking
                                </span>
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
                                    variant="primary"
                                    size="xs"
                                    href={route(
                                        "merchant.venues.bookings.create",
                                        {
                                            venue: venue.slug,
                                        },
                                    )}
                                    className="px-2 md:px-3 gap-1.5"
                                >
                                    <Plus className="w-4 h-4 md:h-3" />
                                    <span>Buat Pesanan</span>
                                </Button>
                                <Button
                                    variant="outline"
                                    size="xs"
                                    onClick={() => open("PrintModal")}
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
                                title="Total Order"
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

                        <BookingTable
                            venue={venue}
                            bookings={bookings}
                            isVenueLevel={true}
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
                title={`Cetak Data Booking ${venue.name}`}
                show={isOpen("PrintModal")}
                onClose={close}
            />
        </MerchantLayout>
    );
}
