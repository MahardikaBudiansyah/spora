import { Head, Link, usePage } from "@inertiajs/react";
import MerchantLayout from "@/Layouts/MerchantLayout";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
} from "@/components/Common/Card";
import Button from "@/components/Common/Button";
import SearchInput from "@/components/Common/SearchInput";
import IconButton from "@/components/Common/IconButton";
import StatCard from "@/components/Common/StatCard";
import MembershipOrderTable from "@/features/orders/components/tables/MembershipOrderTable";
import DevelopmentPlaceholder from "@/components/Common/DevelopmentPlaceholder";
import {
    ChevronDown,
    DollarSign,
    FileText,
    Plus,
    Search,
    ShoppingBag,
    Users,
} from "lucide-react";
import useModal from "@/hooks/useModal";
import BannerAlert from "@/components/Common/BannerAlert";

export default function Index() {
    const { merchant, membershipOrders, can_create } = usePage().props;

    const { isOpen, open, close } = useModal();

    return (
        <MerchantLayout>
            <Head title="Semua Order Membership" />
            <Card className="flex flex-col h-full rounded-md shadow-none">
                <CardHeader className="p-4 md:p-6">
                    <div className="p-2 flex flex-col md:flex-row justify-between gap-6 md:items-center">
                        <div className="flex flex-col md:gap-1 md:text-left">
                            <div className="flex flex-wrap flex-row md:flex-row gap-2 font-bold text-2xl items-center ">
                                <span>Order</span>
                                <span className="text-primary-600 dark:text-primary-500">
                                    Membership
                                </span>
                            </div>
                            <div className="text-sm text-secondary-600 dark:text-secondary-400">
                                <span>Mitra </span>
                                <span>{merchant.name}</span>
                            </div>
                        </div>
                    </div>
                </CardHeader>

                <CardBody className="py-4 md:py-6 px-0 min-h-[280px] sm:min-h-[310px] flex flex-col">
                    {!can_create && (
                        <BannerAlert
                            type="warning"
                            title="Verifikasi Data Mitra Diperlukan"
                            size="md"
                            titleClassName="text-xs"
                            className="mt-0 mb-4 mx-4 md:mx-8"
                        >
                            <div className="flex text-xs">
                                <p>
                                    Anda belum dapat menambah atau mengelola
                                    kartu member (membership) secara penuh
                                    sebelum verifikasi profil Mitra Anda
                                    disetujui oleh Admin. Silakan lengkapi data
                                    profil dan tunggu proses verifikasi.{" "}
                                    <Link
                                        href={route("merchant.profile.index")}
                                        className="font-bold"
                                    >
                                        Lengkapi Profil Sekarang.
                                    </Link>
                                </p>
                            </div>
                        </BannerAlert>
                    )}
                    <div className="py-2 flex-1 overflow-x-auto">
                        <div className="flex flex-row flex-wrap gap-2 justify-start md:justify-between px-8">
                            <div className="flex flex-row gap-2">
                                <SearchInput className="hidden md:flex" />
                                <IconButton
                                    variant="light"
                                    className="block md:hidden"
                                >
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
                                        "merchant.memberships.orders.create",
                                    )}
                                    disabled={!can_create}
                                    className="px-2 md:px-3 gap-1.5"
                                >
                                    <Plus className="w-4 h-4 md:h-3" />
                                    <span>Buat Pesanan</span>
                                </Button>
                                <Button
                                    variant="outline"
                                    size="xs"
                                    onClick={() => open("PrintModal")}
                                    disabled={!can_create}
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
                        <MembershipOrderTable
                            membershipOrders={membershipOrders}
                            isVenueLevel={false}
                        />
                    </div>
                </CardBody>

                <CardFooter className="p-7 md:p-8 flex justify-end "></CardFooter>
            </Card>
            <DevelopmentPlaceholder
                title={`Cetak Data Booking ${merchant.name}`}
                show={isOpen("PrintModal")}
                onClose={close}
            />
        </MerchantLayout>
    );
}
