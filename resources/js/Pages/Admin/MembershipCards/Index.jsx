import { useState } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import { toast } from "react-toastify";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
} from "@/components/Common/Card";
import Button from "@/components/Common/Button";
import DeleteModal from "@/components/common/DeleteModal";

import MembershipCardTable from "@/components/Memberships/MembershipCardTable";

export default function Index() {
    const { membershipCards } = usePage().props;

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedMembershipCard, setSelectedMembershipCard] = useState(null);

    const handleToggleActive = async (row) => {
        const currentStatus = row.is_active;
        const newStatus = !currentStatus;

        try {
            router.patch(
                route("admin.membershipCard.toggleActive", {
                    membershipCard: row.slug,
                }),
                { is_active: newStatus },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        toast.success(
                            `Kartu Member "${row.name}" berhasil ${
                                newStatus ? "diaktifkan" : "dinonaktifkan"
                            }.`,
                        );
                    },
                    onError: () => {
                        toast.error(
                            `Gagal mengubah status Kartu Member "${row.name}".`,
                        );
                    },
                },
            );
        } catch (err) {
            toast.error("Terjadi kesalahan saat mengubah status.");
        }
    };

    const handlePrintCard = (card) => {
        console.log(`Cetak Kartu Member: ${card.name}`);
    };

    const handleDelete = (membershipCard) => {
        setSelectedMembershipCard(membershipCard);
        setShowDeleteModal(true);
    };

    const deleteMembershipCard = () => {
        if (!selectedMembershipCard) return;

        router.delete(
            route("admin.membershipCard.destroy", {
                membershipCard: selectedMembershipCard.slug,
            }),
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(
                        `Kartu Member "${selectedMembershipCard.name}" berhasil dihapus!`,
                    );
                    setShowDeleteModal(false);
                    setSelectedMembershipCard(null);
                },
                onError: () => {
                    toast.error(
                        `Gagal menghapus Kartu Member "${selectedMembershipCard.name}"!`,
                    );
                },
            },
        );
    };

    return (
        <AdminLayout>
            <Head title="Kelola Data Kartu Member" />
            <Card className="flex flex-col h-full rounded-md shadow-none">
                <CardHeader className="p-4 md:p-6">
                    <div className="p-2 flex flex-col md:flex-row justify-between gap-6 md:items-center">
                        <div className="flex flex-col md:gap-1 md:text-left">
                            <div className="flex flex-row md:flex-row gap-2 font-bold text-2xl items-center ">
                                <span>Kelola</span>
                                <span className="text-primary-600 dark:text-primary-500">
                                    Data Kartu Member
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="primary"
                                size="xs"
                                onClick={() =>
                                    console.log("Cetak Semua Data Admin")
                                }
                            >
                                Cetak Data
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardBody className="py-4 md:py-6 px-0 min-h-[280px] sm:min-h-[310px] flex flex-col">
                    <MembershipCardTable
                        membershipCards={membershipCards}
                        viewMode="admin"
                        onToggle={handleToggleActive}
                        onPrint={handlePrintCard}
                        onDelete={handleDelete}
                        onEdit={() => {}}
                    />
                </CardBody>
                <CardFooter className="p-6 md:p-8 flex gap-2 justify-end"></CardFooter>

                {showDeleteModal && (
                    <DeleteModal
                        show={showDeleteModal}
                        onClose={() => {
                            setShowDeleteModal(false);
                            setSelectedMembershipCard(null);
                        }}
                        onDelete={deleteMembershipCard}
                        title="Hapus Kartu Member"
                        description={`Apakah yakin ingin menghapus kartu member "${selectedMembershipCard?.name}" ini?`}
                    />
                )}
            </Card>
        </AdminLayout>
    );
}
