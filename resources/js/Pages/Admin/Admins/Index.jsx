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
import Table from "@/components/Common/Table";
import Button from "@/components/Common/Button";
import Pagination from "@/components/common/Pagination";
import AdminFormModal from "@/Pages/Admin/Admins/Partials/AdminFormModal";
import DeleteModal from "@/components/common/DeleteModal";
import Badge from "@/components/Common/Badge";
import ButtonToggle from "@/components/Common/ButtonToggle";
import { Eye, EyeClosed } from "lucide-react";

import { formatTo08 } from "@/utils/numberPhone";
import { formatFullDate } from "@/utils/date";
import { getAdminStatus } from "@/utils/attributes/adminAttribute";

export default function Index() {
    const { auth, admins = [] } = usePage().props;
    const isSuperAdmin = auth.admin.role === "superadmin";

    const [showFormModal, setShowFormModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [modalMode, setModalMode] = useState("create"); // create / edit
    const [selectedAdmin, setSelectedAdmin] = useState(null);

    const baseColumns = [
        { key: "number", header: "#", className: "text-center content-center" },
        { key: "name", header: "Nama Admin", className: "content-center" },
        {
            key: "role",
            header: "Role",
            className: "text-center content-center",
        },
        {
            key: "email",
            header: "Email",
            className: "text-center content-center",
        },
        {
            key: "phone_number",
            header: "No Handphone",
            render: (val, row) => formatTo08(row.phone_number) || "-",
            className: "text-center content-center",
        },
        {
            key: "status",
            header: "Status",
            render: (val) => {
                const { label, color } = getAdminStatus(val);
                return <Badge color={color}>{label}</Badge>;
            },
            className: "text-center content-center w-28",
        },
        {
            key: "created_at",
            header: "Tanggal Registrasi",
            render: (val, row) => formatFullDate(row.created_at) || "-",
            className: "text-center content-center",
        },
    ];

    // Tambahkan kolom aksi hanya jika superadmin
    const columns = isSuperAdmin
        ? [
              ...baseColumns,
              {
                  key: "action",
                  header: "Aksi",
                  className: "text-center content-center",
                  render: (val, row) => (
                      <div className="flex gap-2 justify-center">
                          <ButtonToggle
                              active={row.status}
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
                              variant="success"
                              size="xs"
                              onClick={() => handleEdit(row)}
                          >
                              Edit
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
          ]
        : baseColumns;

    const handleCreate = () => {
        setSelectedAdmin(null);
        setModalMode("create");
        setShowFormModal(true);
    };

    const handleEdit = (admin) => {
        setSelectedAdmin(admin);
        setModalMode("edit");
        setShowFormModal(true);
    };

    const handleDelete = (admin) => {
        setSelectedAdmin(admin);
        setShowDeleteModal(true);
    };

    const handleToggleActive = async (row) => {
        try {
            const newStatus = !row.status;

            router.patch(
                route("admin.admins.toggleActive", { admin: row.id }),
                { status: newStatus },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        toast.success(
                            `Data "${row.name}" berhasil ${
                                newStatus ? "diaktifkan" : "dinonaktifkan"
                            }.`
                        );
                    },
                    onError: () => {
                        toast.error(
                            `Gagal mengubah status Data Admin "${row.name}".`
                        );
                    },
                }
            );
        } catch (err) {
            toast.error("Terjadi kesalahan saat mengubah status.");
        }
    };

    const deleteAdmin = () => {
        if (!selectedAdmin) return;

        router.delete(
            route("admin.admins.destroy", { admin: selectedAdmin.id }),
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(
                        `Anggota "${selectedAdmin.name}" berhasil dihapus!`
                    );
                    setShowDeleteModal(false);
                    setSelectedAdmin(null);
                },
                onError: () => {
                    toast.error(
                        `Gagal menghapus anggota "${selectedAdmin.name}"!`
                    );
                },
            }
        );
    };

    return (
        <AdminLayout>
            <Head title="Anggota Admin" />
            <Card className="flex flex-col h-full rounded-lg shadow-none dark:border-none">
                <CardHeader className="">
                    <div className="flex flex-row justify-between items-center p-4">
                        <div className="font-bold uppercase text-lg">
                            Semua Anggota Admin
                        </div>
                        <div className="flex flex-row gap-2">
                            {isSuperAdmin && (
                                <Button
                                    variant="primary"
                                    size="xs"
                                    onClick={handleCreate}
                                >
                                    + Admin Baru
                                </Button>
                            )}
                        </div>
                    </div>
                </CardHeader>

                <CardBody className="px-0 pb-8">
                    <Table
                        columns={columns}
                        data={admins.data}
                        wrapperClassName="border-none rounded-none shadow-none"
                        tableClassName="text-xs"
                        emptyState={
                            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                                Tidak ada data.{" "}
                                {isSuperAdmin && (
                                    <button
                                        type="button"
                                        onClick={handleCreate}
                                        className="text-gray-900 hover:underline dark:text-primary-400 font-semibold"
                                    >
                                        Tambahkan anggota Admin sekarang!
                                    </button>
                                )}
                            </div>
                        }
                    />
                    <Pagination
                        links={admins.links}
                        meta={admins}
                        className="p-6 my-2"
                    />
                </CardBody>

                <AdminFormModal
                    show={showFormModal}
                    onClose={() => setShowFormModal(false)}
                    mode={modalMode}
                    selectedAdmin={selectedAdmin}
                />

                <DeleteModal
                    show={showDeleteModal}
                    onClose={() => {
                        setShowDeleteModal(false);
                        setSelectedAdmin(null);
                    }}
                    onDelete={deleteAdmin}
                    title="Hapus Admin"
                    description={`Yakin ingin menghapus Data "${selectedAdmin?.name}"?`}
                />
            </Card>
        </AdminLayout>
    );
}
