import { useState } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import { toast } from "react-toastify";
import AdminLayout from "@/Layouts/AdminLayout";
import { Card, CardHeader, CardBody } from "@/components/Common/Card";
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
            <Head title="Daftar Data Kartu Member" />
            <Card className="flex flex-col h-full rounded-lg shadow-none dark:border-none">
                <CardHeader className="">
                    <div className="flex flex-row justify-between items-center p-4">
                        <div className="font-bold uppercase text-lg">
                            Daftar Data Kartu Member
                        </div>
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
                </CardHeader>
                <CardBody className="px-0 pb-8">
                    <MembershipCardTable
                        membershipCards={membershipCards}
                        viewMode="admin"
                        onToggle={handleToggleActive}
                        onPrint={handlePrintCard}
                        onDelete={handleDelete}
                        onEdit={() => {}}
                    />
                </CardBody>
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
