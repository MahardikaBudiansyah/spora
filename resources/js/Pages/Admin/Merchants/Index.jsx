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
import { getMerchantStatus } from "@/utils/merchantAttribute";
import { getVenuesCountBadge } from "@/utils/venueAttribute";

export default function Index() {
    const { merchants = [] } = usePage().props;
    console.log(merchants);

    const [showModal, setShowModal] = useState(false);
    const [selectedMerchant, setSelectedMerchant] = useState(null);

    const columns = [
        { key: "number", header: "#", className: "text-center content-center" },
        { key: "name", header: "Nama Mitra", className: "content-center" },
        {
            key: "email",
            header: "email",
            className: "text-center content-center",
        },
        {
            key: "address",
            header: "Alamat",
            className: "content-center",
            render: (val, row) =>
                row.address ? (
                    <div className="text-left">{row.address.address}</div>
                ) : (
                    <div className="text-center content-center">-</div>
                ),
        },
        {
            key: "phone_number",
            header: "No Handphone",
            render: (val, row) => formatTo08(row.phone_number) || "-",
            className: "text-center content-center",
        },
        {
            key: "venues_count",
            header: "Jumlah Venue",
            className: "text-center content-center w-32",
            render: (val, row) => {
                const { label, color } = getVenuesCountBadge(row.venues_count);
                return <Badge color={color}>{label}</Badge>;
            },
        },
        {
            key: "status",
            header: "Status",
            render: (val) => {
                const { label, color } = getMerchantStatus(val);
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
                        variant="warning"
                        size="xs"
                        onClick={() => handleInfo(row)}
                    >
                        Validasi
                    </Button>
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
                route("admin.merchants.toggleActive", { merchant: row.slug }),
                { is_active: newStatus },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        toast.success(
                            `Akun Mitra "${row.name}" berhasil ${
                                newStatus ? "diaktifkan" : "dinonaktifkan"
                            }.`
                        );
                    },
                    onError: () => {
                        toast.error(
                            `Gagal mengubah status akun Mitra "${row.name}".`
                        );
                    },
                }
            );
        } catch (err) {
            toast.error("Terjadi kesalahan saat mengubah status.");
        }
    };

    const handleInfo = (row) => {
        router.get(route("admin.merchants.show", { merchant: row.slug }));
    };

    const handleDelete = (row) => {
        setSelectedMerchant(row);
        setShowModal(true);
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
                    setShowModal(false);
                    setSelectedMerchant(null);
                },
                onError: (errors) => {
                    if (errors?.name) {
                        toast.error(errors.name);
                    } else {
                        toast.error("Gagal menghapus data akun Mitra!");
                    }
                },
            }
        );
    };

    return (
        <AdminLayout>
            <Head title="Daftar Mitra" />
            <Card className="flex flex-col h-full rounded-lg shadow-none dark:border-none">
                <CardHeader className="">
                    <div className="flex flex-row justify-between items-center p-4">
                        <div className="font-bold uppercase text-lg">
                            Daftar Data Mitra
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
                        data={merchants.data}
                        wrapperClassName="border-none rounded-none shadow-none"
                        tableClassName="text-xs"
                        emptyState={
                            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                                Tidak ada data Mitra.{" "}
                            </div>
                        }
                    />
                    <Pagination
                        links={merchants.links}
                        meta={merchants}
                        className="p-6 my-2"
                    />
                </CardBody>

                {showModal && selectedMerchant && (
                    <DeleteModal
                        show={showModal}
                        onClose={() => setShowModal(false)}
                        onDelete={deleteMerchant}
                        title="Hapus data Mitra"
                        description={`Yakin ingin menghapus data akun Mitra "${selectedMerchant.name}"?`}
                    />
                )}

                <CardFooter className="my-8 p-8 flex justify-end gap-2"></CardFooter>
            </Card>
        </AdminLayout>
    );
}
