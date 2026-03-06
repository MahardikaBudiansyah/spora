import { useState } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import useModal from "@/hooks/useModal";

import AdminProfileHeader from "@/features/admins/components/details/AdminProfileHeader";
import AdminProfileInfo from "@/features/admins/components/details/AdminProfileInfo";
import PlatformProfileInfo from "@/features/admins/components/details/PlatformProfileInfo";
import PlatformPayoutInfo from "@/features/admins/components/details/PlatformPayoutInfo";

import AdminProfileModal from "@/features/admins/components/modals/AdminProfileModal";
import PlatformProfileModal from "@/features/admins/components/modals/PlatformProfileModal";
import PlatformPayoutModal from "@/features/admins/components/modals/PlatformPayoutModal";
import DeleteModal from "@/components/Common/DeleteModal";
import AdminAccountModal from "@/features/admins/components/modals/AdminAccountModal";
import AdminAccountSecurityModal from "@/features/admins/components/modals/AdminAccountSecurityModal";

export default function Index() {
    const {
        admin: { data: admin },
        platform_profile: { data: platform_profile },
    } = usePage().props;
    const role = admin?.role;

    const { isOpen, open, close } = useModal();
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedPayout, setSelectedPayout] = useState(null);

    const handleEditAdmin = (type) => {
        if (type === "account") {
            open("AdminAccountModal");
        } else if (type === "security") {
            open("AdminAccountSecurityModal");
        }
    };

    const handleEditProfileAdmin = () => {
        open("AdminProfileModal");
    };

    const handleEditPlatformProfileAdmin = () => {
        open("PlatformProfileModal");
    };

    const handleOpenCreatePayoutModal = () => {
        setSelectedPayout(null);
        open("PlatformPayoutModal");
    };

    const handleOpenEditPayoutModal = (payout) => {
        setSelectedPayout(payout);
        open("PlatformPayoutModal");
    };

    const handleDeleteAdmin = () => {
        open("AdminDeleteModal");
    };

    const handleConfirmDelete = (data) => {
        router.post(
            route("admin.profile.account.request-deactivation"),
            {
                reason: data.reason,
            },
            {
                onBefore: () => setIsProcessing(true),
                onFinish: () => setIsProcessing(false),
                onSuccess: () => {
                    close();
                    toast.success(
                        "Pengajuan penonaktifan Akun Admin telah dikirim ke Superadmin",
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
        <AdminLayout>
            <Head
                title={
                    role === "superadmin"
                        ? "Profil Official (Superadmin)"
                        : "Profil Admin"
                }
            />
            <div className="relative pb-10 space-y-6">
                <AdminProfileHeader
                    admin={admin}
                    onEdit={handleEditAdmin}
                    onDelete={handleDeleteAdmin}
                />
                <div
                    className={`px-4 md:px-8 grid grid-cols-1 gap-6 ${
                        role === "superadmin"
                            ? "lg:grid-cols-3"
                            : "lg:grid-cols-2"
                    }`}
                >
                    <AdminProfileInfo
                        admin={admin}
                        onEdit={handleEditProfileAdmin}
                    />

                    <PlatformProfileInfo
                        admin={admin}
                        platform_profile={platform_profile}
                        onEdit={handleEditPlatformProfileAdmin}
                    />
                    {role === "superadmin" && (
                        <PlatformPayoutInfo
                            admin={admin}
                            onCreate={handleOpenCreatePayoutModal}
                            onEdit={handleOpenEditPayoutModal}
                        />
                    )}
                </div>
            </div>

            <AdminAccountModal
                show={isOpen("AdminAccountModal")}
                onClose={close}
                admin={admin}
            />
            <AdminAccountSecurityModal
                show={isOpen("AdminAccountSecurityModal")}
                onClose={close}
                admin={admin}
            />
            <AdminProfileModal
                show={isOpen("AdminProfileModal")}
                onClose={close}
                role={admin.role}
                profile={admin.profile}
            />
            <PlatformProfileModal
                show={isOpen("PlatformProfileModal")}
                onClose={close}
                profile={admin.platform_profile}
            />
            <PlatformPayoutModal
                show={isOpen("PlatformPayoutModal")}
                onClose={() => {
                    close();
                    setSelectedPayout(null);
                }}
                payout={selectedPayout}
            />
            <DeleteModal
                show={isOpen("AdminDeleteModal")}
                onClose={close}
                onConfirm={handleConfirmDelete}
                isProcessing={isProcessing}
                title="Konfirmasi Non-Aktif Akun Admin"
                description={`Apakah Anda yakin ingin mengajukan penonaktifan akun Admin "${admin?.name}"? Superadmin akan meninjau permintaan Anda.`}
                confirmText="Ya, Ajukan Penonaktifan"
                requireReason={true}
            />
        </AdminLayout>
    );
}
