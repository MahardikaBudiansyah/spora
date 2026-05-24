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
import MerchantTable from "@/features/merchants/components/tables/MerchantTable";

export default function Index() {
    const {
        merchants: { data: merchants },
    } = usePage().props;
    console.log(merchants);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedMerchant, setSelectedMerchant] = useState(null);

    const handleToggleActive = async (row) => {
        try {
            const newStatus = !row.is_active;

            router.patch(
                route("admin.merchants.toggleActive", { merchant: row.slug }),
                { is_active: newStatus },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        toast.success(
                            `Akun Mitra "${row.name}" berhasil ${
                                newStatus ? "diaktifkan" : "dinonaktifkan"
                            }.`,
                        );
                    },
                    onError: () => {
                        toast.error(
                            `Gagal mengubah status akun Mitra "${row.name}".`,
                        );
                    },
                },
            );
        } catch (err) {
            toast.error("Terjadi kesalahan saat mengubah status.");
        }
    };

    const handleVerification = (row) => {
        router.get(
            route("admin.merchants.verification.index", { merchant: row.slug }),
        );
    };

    const handleInfo = (row) => {
        router.get(route("admin.merchants.show", { merchant: row.slug }));
    };

    const handleDelete = (row) => {
        setSelectedMerchant(row);
        setShowDeleteModal(true);
    };

    const deleteMerchant = () => {
        if (!selectedMerchant) return;

        router.delete(
            route("admin.merchants.destroy", {
                merchant: selectedMerchant.slug,
            }),
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success("Data akun Mitra berhasil dihapus!");
                    setShowDeleteModal(false);
                    setSelectedMerchant(null);
                },
                onError: (errors) => {
                    if (errors?.name) {
                        toast.error(errors.name);
                    } else {
                        toast.error("Gagal menghapus data akun Mitra!");
                    }
                },
            },
        );
    };

    return (
        <AdminLayout>
            <Head title="Kelola Daftar Mitra" />
            <Card className="flex flex-col h-full rounded-md shadow-none">
                <CardHeader className="p-4 md:p-6">
                    <div className="p-2 flex flex-col md:flex-row justify-between gap-6 md:items-center">
                        <div className="flex flex-col md:gap-1 md:text-left">
                            <div className="flex flex-row md:flex-row gap-2 font-bold text-2xl items-center ">
                                <span>Kelola</span>
                                <span className="text-primary-600 dark:text-primary-500">
                                    Data Mitra
                                </span>
                            </div>
                        </div>
                        <Button
                            variant="primary"
                            size="xs"
                            onClick={() => handlePrint()}
                        >
                            Cetak Data
                        </Button>
                    </div>
                </CardHeader>
                <CardBody className="py-4 md:py-6 px-0 min-h-[280px] sm:min-h-[310px] flex flex-col">
                    <MerchantTable
                        merchants={merchants}
                        handleToggleActive={handleToggleActive}
                        handleVerification={handleVerification}
                        handleInfo={handleInfo}
                        handleDelete={handleDelete}
                    />
                </CardBody>
                <CardFooter className="p-6 md:p-8 flex gap-2 justify-end"></CardFooter>
            </Card>
            {showDeleteModal && (
                <DeleteModal
                    show={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onDelete={deleteMerchant}
                    title="Hapus Data Mitra"
                    description={`Yakin ingin menghapus data akun Mitra "${selectedMerchant.name}"?`}
                />
            )}
        </AdminLayout>
    );
}
