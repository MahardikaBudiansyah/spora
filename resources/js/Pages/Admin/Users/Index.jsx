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
import UserTable from "@/features/users/components/tables/UserTable";

export default function Index() {
    const {
        users: { data: users },
    } = usePage().props;

    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const handleToggleActive = async (row) => {
        try {
            const newStatus = !row.is_active;

            router.patch(
                route("admin.users.toggleActive", { user: row.id }),
                { is_active: newStatus },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        toast.success(
                            `User "${row.name}" berhasil ${
                                newStatus ? "diaktifkan" : "dinonaktifkan"
                            }.`,
                        );
                    },
                    onError: () => {
                        toast.error(
                            `Gagal mengubah status user "${row.name}".`,
                        );
                    },
                },
            );
        } catch (err) {
            toast.error("Terjadi kesalahan saat mengubah status.");
        }
    };

    const handleInfo = (row) => {
        router.get(route("admin.users.show", { user: row.id }));
    };

    const handleDelete = (row) => {
        setSelectedUser(row);
        setShowModal(true);
    };

    const deleteUser = () => {
        if (!selectedUser) return;

        router.delete(route("admin.users.destroy", { user: selectedUser.id }), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Data User berhasil dihapus!");
                setShowModal(false);
                setSelectedUser(null);
            },
            onError: (errors) => {
                if (errors?.name) {
                    toast.error(errors.name);
                } else {
                    toast.error("Gagal menghapus Data User!");
                }
            },
        });
    };

    return (
        <AdminLayout>
            <Head title="Kelola Data User Konsumen" />
            <Card className="flex flex-col h-full rounded-md shadow-none">
                <CardHeader className="p-4 md:p-6">
                    <div className="p-2 flex flex-col md:flex-row justify-between gap-6 md:items-center">
                        <div className="flex flex-col md:gap-1 md:text-left">
                            <div className="flex flex-row md:flex-row gap-2 font-bold text-2xl items-center ">
                                <span>Kelola</span>
                                <span className="text-primary-600 dark:text-primary-500">
                                    Data User Konsumen
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
                    <UserTable
                        users={users}
                        handleToggleActive={handleToggleActive}
                        handleInfo={handleInfo}
                        handleDelete={handleDelete}
                    />
                </CardBody>

                {showModal && selectedUser && (
                    <DeleteModal
                        show={showModal}
                        onClose={() => setShowModal(false)}
                        onDelete={deleteUser}
                        title="Hapus Data User"
                        description={`Yakin ingin menghapus data User "${selectedUser.name}"?`}
                    />
                )}

                <CardFooter className="p-6 md:p-8 flex gap-2 justify-end"></CardFooter>
            </Card>
        </AdminLayout>
    );
}
