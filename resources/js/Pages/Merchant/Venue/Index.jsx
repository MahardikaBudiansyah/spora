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
import Button from "@/components/Common/Button";
import DeleteModal from "@/components/common/DeleteModal";
import VenueTable from "@/features/venues/components/tables/VenueTable";
import { Plus } from "lucide-react";
import BannerAlert from "@/components/Common/BannerAlert";
import ConfirmModal from "@/components/Common/ConfirmModal";
import MerchantVenueTable from "@/features/venues/components/tables/MerchantVenueTable";

export default function Index() {
    const {
        auth_status,
        merchant,
        venues: { data: venues },
    } = usePage().props;

    const [isModalVerificationOpen, setIsModalVerificationOpen] =
        useState(false);
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
    const [selectedVenue, setSelectedVenue] = useState(null);
    const [processing, setProcessing] = useState(false);

    const openVerificationModal = (row) => {
        setSelectedVenue(row);
        setIsModalVerificationOpen(true);
    };

    const handleDelete = (row) => {
        setSelectedVenue(row);
        setIsModalDeleteOpen(true);
    };

    const handleToggleActive = async (row) => {
        try {
            const newStatus = !row.is_active;

            router.patch(
                route("merchant.venues.toggleActive", { venue: row.slug }),
                { is_active: newStatus },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        toast.success(
                            `Data Venue "${row.name}" berhasil ${
                                newStatus ? "diaktifkan" : "dinonaktifkan"
                            }.`,
                        );
                    },
                    onError: () => {
                        toast.error(
                            `Gagal mengubah status Data Venue "${row.name}".`,
                        );
                    },
                },
            );
        } catch (err) {
            toast.error("Terjadi kesalahan saat mengubah status.");
        }
    };

    const handleVenueVerification = (reason) => {
        if (!selectedVenue) return;

        setProcessing(true);

        router.patch(
            route("merchant.venues.verification.requestVerification", {
                venue: selectedVenue.slug,
            }),
            { reason },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(
                        "Proses pengajuan verifikasi data Venue berhasil",
                    );
                    setIsModalVerificationOpen(false);
                    setSelectedVenue(null);
                },
                onBefore: () => setProcessing(true),
                onError: (errors) => {
                    toast.error("Gagal mengajukan verifikasi Venue.");
                },
                onFinish: () => setProcessing(false),
            },
        );
    };

    const handleDeleteVenue = () => {
        if (!selectedVenue) return;

        setProcessing(true);

        router.delete(
            route("merchant.venues.destroy", { venue: selectedVenue.slug }),
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success("Venue berhasil dihapus!");
                    setIsModalDeleteOpen(false);
                    setSelectedVenue(null);
                },
                onError: (errors) => {
                    toast.error("Gagal menghapus data venue.");
                },
                onFinish: () => setProcessing(false),
            },
        );
    };
    return (
        <MerchantLayout>
            <Head title={`Daftar Venue - ${merchant?.name || "Merchant"}`} />
            <Card className="flex flex-col h-full rounded-md shadow-none">
                <CardHeader className="p-4 md:p-6">
                    <div className="p-2 flex flex-col md:flex-row justify-between gap-6 md:items-center">
                        <div className="flex flex-col md:gap-1 md:text-left">
                            <div className="flex flex-row md:flex-row gap-2 font-bold text-2xl items-center ">
                                <span>Daftar</span>
                                <span className="text-primary-600 dark:text-primary-500">
                                    Venue
                                </span>
                            </div>
                            <div className="text-sm text-secondary-600 dark:text-secondary-400">
                                <span>Mitra </span>
                                <span>{merchant.name}</span>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Button
                                variant="primary"
                                size="xs"
                                href={route("merchant.venues.create")}
                                disabled={!auth_status.is_merchant_approved}
                                className="flex items-center w-auto gap-1.5 px-3 min-w-max"
                            >
                                <Plus className="w-4 h-4 md:h-3" />
                                <span className="">Tambah Venue</span>
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardBody className="py-4 md:py-6 px-0 min-h-[280px] sm:min-h-[310px] flex flex-col">
                    {!auth_status.is_merchant_approved && (
                        <BannerAlert
                            type="warning"
                            title="Verifikasi Data Mitra Diperlukan"
                            size="md"
                            titleClassName="text-xs"
                            className="mb-4 mx-4 md:mx-8"
                        >
                            <div className="flex text-xs">
                                <p>
                                    Anda belum dapat menambah atau mengelola
                                    venue secara penuh sebelum verifikasi profil
                                    Mitra Anda disetujui oleh Admin. Silakan
                                    lengkapi data profil dan tunggu proses
                                    verifikasi.{" "}
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
                    <MerchantVenueTable
                        auth_status={auth_status}
                        venues={venues}
                        handleToggleActive={handleToggleActive}
                        handleVerification={openVerificationModal}
                        handleDelete={handleDelete}
                    />
                </CardBody>

                <CardFooter className="p-6 md:p-8 flex gap-2 justify-end"></CardFooter>
            </Card>
            {isModalVerificationOpen && selectedVenue && (
                <ConfirmModal
                    show={isModalVerificationOpen}
                    onClose={() => setIsModalVerificationOpen(false)}
                    maxWidth="xl"
                    title={`Pengajuan Verifikasi Data Venue ${selectedVenue?.name}`}
                    description={`Apakah Anda ingin yakin pengajuan verifikasi Data Venue ${selectedVenue?.name}?`}
                    confirmText="Setujui"
                    requireReason={true}
                    reasonPlaceholder="Tambah catatan pengajuan verifikasi di sini..."
                    onConfirm={({ reason }) => handleVenueVerification(reason)}
                    isProcessing={processing}
                />
            )}
            {isModalDeleteOpen && selectedVenue && (
                <DeleteModal
                    show={isModalDeleteOpen}
                    onClose={() => setIsModalDeleteOpen(false)}
                    onConfirm={handleDeleteVenue}
                    isProcessing={processing}
                    title="Hapus Venue"
                    description={`Yakin ingin menghapus venue "${selectedVenue.name}"?`}
                />
            )}
        </MerchantLayout>
    );
}
