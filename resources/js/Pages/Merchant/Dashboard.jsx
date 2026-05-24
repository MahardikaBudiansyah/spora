import MerchantLayout from "@/Layouts/MerchantLayout";
import { useState } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import StatCard from "@/components/Common/StatCard";
import {
    Calendar,
    DollarSign,
    Clock,
    CheckCircle,
    LayoutGrid,
    Plus,
} from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/Common/Card";
import Button from "@/components/Common/Button";
import { AnimatePresence } from "framer-motion";
import BannerAlert from "@/components/Common/BannerAlert";
import VenueList from "@/components/Venues/VenueList";

export default function Dashboard() {
    const {
        stats,
        merchant: { data: merchant },
        venues: { data: venues },
    } = usePage().props;

    const [showErrorBanner, setShowErrorBanner] = useState(false);

    const handleCreateVenue = () => {
        if (merchant.status !== "approved") {
            toast.error(
                "Akun Anda belum aktif. Silakan tunggu verifikasi admin",
            );

            setShowErrorBanner(true);
            return;
        }

        router.visit(route("merchant.venues.create"));
    };

    return (
        <MerchantLayout>
            <Head title="Dashboard Mitra" />

            <div className="p-6 space-y-6">
                {/* 🔹 Header */}
                <div>
                    <h1 className="text-2xl font-bold">Dashboard Mitra</h1>
                    <p className="text-sm text-secondary-500">
                        Selamat datang kembali, {merchant?.name}
                    </p>
                </div>

                {/* 🔹 Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard
                        title="Booking Hari Ini"
                        value={stats?.todayBookings || 0}
                        Icon={Calendar}
                    />
                    <StatCard
                        title="Pendapatan Hari Ini"
                        value={stats?.todayRevenue || "Rp 0"}
                        Icon={DollarSign}
                    />
                    <StatCard
                        title="Slot Terisi"
                        value={stats?.filledSlots || 0}
                        Icon={CheckCircle}
                    />
                    <StatCard
                        title="Slot Tersedia"
                        value={stats?.availableSlots || 0}
                        Icon={Clock}
                    />
                </div>

                <div>
                    <Card className="bg-white shadow-sm border border-gray-100">
                        <CardHeader className="border-b flex flex-col gap-2 p-6">
                            <div className="flex flex-col md:flex-row md:justify-between gap-3 md:gap-2 md:items-center">
                                <div className="flex gap-2 items-center">
                                    <LayoutGrid
                                        size={18}
                                        className="text-primary-500"
                                    />
                                    <h2 className="font-bold">
                                        Daftar Venue Terkelola
                                    </h2>
                                </div>
                                <div className="flex">
                                    <Button
                                        variant="primary"
                                        size="xs"
                                        onClick={handleCreateVenue}
                                        className="flex items-center w-auto gap-1.5 px-3 min-w-max"
                                    >
                                        <Plus className="w-4 h-4 md:h-3" />
                                        <span className="">Tambah Venue</span>
                                    </Button>
                                </div>
                            </div>
                            <AnimatePresence>
                                {showErrorBanner &&
                                    merchant.status !== "approved" && (
                                        <BannerAlert
                                            type={
                                                merchant.status === "rejected"
                                                    ? "error"
                                                    : "warning"
                                            }
                                            title={
                                                merchant.status === "rejected"
                                                    ? "Pendaftaran Ditolak"
                                                    : "Verifikasi Pending"
                                            }
                                            closable={true}
                                            onClose={() =>
                                                setShowErrorBanner(false)
                                            }
                                        >
                                            {merchant.status === "rejected" ? (
                                                <span>
                                                    Mohon maaf, pengajuan mitra
                                                    Anda ditolak. Silakan
                                                    periksa kembali profil Anda
                                                    atau hubungi dukungan
                                                    pelanggan.
                                                </span>
                                            ) : (
                                                <span>
                                                    Maaf, Anda belum bisa
                                                    menambah venue. Akun Anda
                                                    saat ini berstatus
                                                    <span className="font-bold uppercase mx-1">
                                                        {merchant.status}
                                                    </span>
                                                    . Fitur penambahan venue
                                                    akan terbuka otomatis
                                                    setelah verifikasi selesai.
                                                </span>
                                            )}
                                        </BannerAlert>
                                    )}
                            </AnimatePresence>
                        </CardHeader>
                        <CardBody className="p-6">
                            <VenueList merchant={merchant} venues={venues} />
                        </CardBody>
                    </Card>
                </div>
            </div>
        </MerchantLayout>
    );
}
