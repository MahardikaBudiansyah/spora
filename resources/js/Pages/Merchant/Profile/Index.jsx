import { useState } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import MerchantLayout from "@/Layouts/MerchantLayout";
import { Card, CardHeader, CardBody } from "@/components/common/Card";
import VenueList from "@/components/venues/VenueList";
import { LayoutGrid, Plus } from "lucide-react";
import useModal from "@/hooks/useModal";
import Button from "@/components/Common/Button";
import BannerAlert from "@/components/Common/BannerAlert";
import { toast } from "react-toastify";
import { AnimatePresence } from "framer-motion";

import MerchantProfileInfo from "@/features/merchants/components/details/MerchantProfileInfo";
import MerchantPayoutInfo from "@/features/merchants/components/details/MerchantPayoutInfo";
import MerchantOwnerInfo from "@/features/merchants/components/details/MerchantOwnerInfo";
import MerchantProfileHeader from "@/features/merchants/components/details/MerchantProfileHeader";

import MerchantAccountModal from "@/features/merchants/components/modals/MerchantAccountModal";
import MerchantAccountSecurityModal from "@/features/merchants/components/modals/MerchantAccountSecurityModal";
import MerchantProfileModal from "@/features/merchants/components/modals/MerchantProfileModal";
import MerchantPayoutModal from "@/features/merchants/components/modals/MerchantPayoutMethodModal";
import MerchantOwnerModal from "@/features/merchants/components/modals/MerchantOwnerModal";
import DeleteModal from "@/components/Common/DeleteModal";

export default function Index() {
    const {
        merchant: { data: merchant },
        venues: { data: venues },
    } = usePage().props;

    const profile = merchant?.profile;
    const rawPayoutMethods = merchant?.payout_methods || [];

    const sortedPayoutMethods = [...rawPayoutMethods].sort((a, b) => {
        return b.is_primary === true || b.is_primary === 1 ? 1 : -1;
    });

    const owner = merchant?.owner;

    const { isOpen, open, close } = useModal();
    const [isProcessing, setIsProcessing] = useState(false);
    const [showErrorBanner, setShowErrorBanner] = useState(false);

    const handleEditMerchant = (type) => {
        if (type === "account") {
            open("MerchantAccountModal");
        } else if (type === "security") {
            open("MerchantAccountSecurityModal");
        }
    };

    const handleEditProfileMerchant = () => {
        open("MerchantProfileModal");
    };

    const [selectedPayout, setSelectedPayout] = useState(null);

    const handleOpenCreatePayoutModal = () => {
        setSelectedPayout(null);
        open("MerchantPayoutModal");
    };

    const handleOpenEditPayoutModal = (payout) => {
        setSelectedPayout(payout);
        open("MerchantPayoutModal");
    };

    const handleCreateVenue = () => {
        if (merchant.status !== "active") {
            toast.error(
                "Akun Anda belum aktif. Silakan tunggu verifikasi admin",
            );

            setShowErrorBanner(true);
            return;
        }

        router.visit(route("merchant.venues.create"));
    };

    const handleDeleteMerchant = () => {
        open("MerchantDeleteModal");
    };

    const handleConfirmDelete = (data) => {
        router.post(
            route("merchant.profile.account.request-deactivation"),
            {
                reason: data.reason,
            },
            {
                onBefore: () => setIsProcessing(true),
                onFinish: () => setIsProcessing(false),
                onSuccess: () => {
                    close();
                    toast.success(
                        "Pengajuan Tutup Toko telah dikirim ke Admin",
                    );
                },
                onError: (errors) => {
                    console.log("Error Validasi:", errors);
                    if (errors.reason) {
                        toast.error(errors.reason);
                    } else {
                        toast.error("Gagal mengirim permintaan.");
                    }
                },
            },
        );
    };

    return (
        <MerchantLayout>
            <Head title="Profil Mitra" />
            <div className="relative pb-10 space-y-6">
                <MerchantProfileHeader
                    merchant={merchant}
                    onEdit={handleEditMerchant}
                    onDelete={handleDeleteMerchant}
                />
                <div className="px-4 md:px-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <MerchantOwnerInfo
                        merchant={merchant}
                        onEdit={() => open("MerchantOwnerModal")}
                    />
                    <MerchantProfileInfo
                        merchant={merchant}
                        onEdit={handleEditProfileMerchant}
                    />
                    <MerchantPayoutInfo
                        merchant={merchant}
                        payoutMethods={sortedPayoutMethods}
                        onCreate={handleOpenCreatePayoutModal}
                        onEdit={handleOpenEditPayoutModal}
                    />
                </div>
                <div className="px-4 md:px-8">
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
                                    merchant.status !== "active" && (
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
            <MerchantAccountModal
                show={isOpen("MerchantAccountModal")}
                onClose={close}
                merchant={merchant}
            />
            <MerchantAccountSecurityModal
                show={isOpen("MerchantAccountSecurityModal")}
                onClose={close}
                merchant={merchant}
            />
            <MerchantOwnerModal
                show={isOpen("MerchantOwnerModal")}
                onClose={close}
                merchant={merchant}
                owner={owner}
            />
            <MerchantProfileModal
                show={isOpen("MerchantProfileModal")}
                onClose={close}
                merchant={merchant}
                profile={profile}
            />
            <MerchantPayoutModal
                merchant={merchant}
                show={isOpen("MerchantPayoutModal")}
                onClose={() => {
                    close();
                    setSelectedPayout(null);
                }}
                payout={selectedPayout}
            />
            <DeleteModal
                show={isOpen("MerchantDeleteModal")}
                onClose={close}
                onConfirm={handleConfirmDelete}
                isProcessing={isProcessing}
                title="Konfirmasi Tutup Toko"
                description={`Apakah Anda yakin ingin mengajukan penonaktifan toko "${merchant?.name}"? Admin akan meninjau permintaan Anda.`}
                confirmText="Ya, Ajukan Penonaktifan"
                requireReason={true}
            />
        </MerchantLayout>
    );
}
