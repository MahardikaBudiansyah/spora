import { useState } from "react";
import { Head, usePage, router, Link } from "@inertiajs/react";
import { toast } from "react-toastify";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
} from "@/components/Common/Card";
import Table from "@/components/Common/Table";
import Button from "@/components/Common/Button";
import Pagination from "@/components/common/Pagination";
import DeleteModal from "@/components/common/DeleteModal";
import Badge from "@/components/Common/Badge";
import ButtonToggle from "@/components/Common/ButtonToggle";
import { Eye, EyeClosed } from "lucide-react";

import { formatTo08 } from "@/utils/numberPhone";
import { formatFullDateTime } from "@/utils/date";
import { getUserStatus, getUserBookingStatus } from "@/utils/userAttribute";

export default function Index() {
    const { users = [] } = usePage().props;

    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const columns = [
        { key: "number", header: "#", className: "text-center content-center" },
        { key: "name", header: "Nama User", className: "content-center" },
        {
            key: "email",
            header: "email",
            className: "text-center content-center",
        },
        {
            key: "phone_number",
            header: "No Handphone",
            render: (val, row) => formatTo08(row.phone_number) || "-",
            className: "text-center content-center",
        },
        {
            key: "booking_status",
            header: "Riwayat Booking",
            className: "text-center content-center",
            render: (val, row) => {
                const { label, color } = getUserBookingStatus(
                    row.booking_customers_count
                );
                return <Badge color={color}>{label}</Badge>;
            },
        },
        {
            key: "status",
            header: "Status",
            render: (val) => {
                const { label, color } = getUserStatus(val);
                return <Badge color={color}>{label}</Badge>;
            },
            className: "text-center content-center",
        },
        {
            key: "created_at",
            header: "Tanggal Registrasi",
            render: (val, row) => formatFullDateTime(row.created_at) || "-",
            className: "text-center content-center",
        },
        {
            key: "action",
            header: "Aksi",
            className: "text-center content-center",
            render: (val, row) => (
                <div className="flex gap-2 justify-center">
                    <ButtonToggle
                        active={row.is_active}
                        onClick={() => handleToggleActive(row)}
                        activeIcon={<Eye className="w-4 h-4" />}
                        inactiveIcon={<EyeClosed className="w-4 h-4" />}
                        tooltipActive="Aktif"
                        tooltipInactive="Nonaktif"
                        activeVariant="success"
                        inactiveVariant="danger"
                        size="sm"
                    />
                    <Button
                        variant="info"
                        size="xs"
                        onClick={() => handleInfo(row)}
                    >
                        Info
                    </Button>
                    <Button
                        variant="danger"
                        size="xs"
                        onClick={() => handleDelete(row)}
                    >
                        Hapus
                    </Button>
                </div>
            ),
        },
    ];

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
                            }.`
                        );
                    },
                    onError: () => {
                        toast.error(
                            `Gagal mengubah status user "${row.name}".`
                        );
                    },
                }
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
            <Head title="Daftar Data User" />
            <Card className="flex flex-col h-full rounded-lg shadow-none dark:border-none">
                <CardHeader className="">
                    <div className="flex flex-row justify-between items-center p-4">
                        <div className="font-bold uppercase text-lg">
                            Daftar Data User Konsumen
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
                <CardBody className="px-0 pb-8">
                    <Table
                        columns={columns}
                        data={users.data}
                        wrapperClassName="border-none rounded-none shadow-none"
                        tableClassName="text-xs"
                        emptyState={
                            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                                Tidak ada data User Konsumen.
                            </div>
                        }
                    />
                    <Pagination
                        links={users.links}
                        meta={users}
                        className="p-6 my-2"
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

                <CardFooter className="my-8 p-8 flex justify-end gap-2"></CardFooter>
            </Card>
        </AdminLayout>
    );
}
