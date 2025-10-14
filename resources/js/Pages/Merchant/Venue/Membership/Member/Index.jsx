import { useState } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import MerchantLayout from "@/Layouts/MerchantLayout";
import { Card, CardHeader, CardBody } from "@/components/Common/Card";
import Table from "@/components/Common/Table";
import Button from "@/components/Common/Button";
import { formatShortDate, formatFullDate } from "@/utils/date";
import { ChevronRight, ChevronDown, Eye, EyeClosed } from "lucide-react";
import ButtonToggle from "@/components/Common/ButtonToggle";
import { toast } from "react-toastify";
import DeleteModal from "@/components/Common/DeleteModal";

export default function Index() {
    const { venue, users } = usePage().props; // dikirim dari controller
    const [showCreate, setShowCreate] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [deleteState, setDeleteState] = useState({ show: false, item: null });

    const openCreateModal = () => setShowCreate(true);
    const closeCreateModal = () => setShowCreate(false);

    const openEditModal = (member) => {
        setSelectedMember(member);
        setShowEdit(true);
    };
    const closeEditModal = () => {
        setSelectedMember(null);
        setShowEdit(false);
    };

    const openInfoModal = (member) => {
        setSelectedMember(member);
        setShowInfo(true);
    };
    const closeInfoModal = () => {
        setSelectedMember(null);
        setShowInfo(false);
    };

    const handleToggleActive = async (member) => {
        try {
            await axios.patch(
                route("merchant.venues.memberships.users.toggle", {
                    venue: venue.slug,
                    membershipUser: member.slug,
                })
            );

            toast.success(`"${member.user.name}" berhasil diubah statusnya.`);
            router.reload({ only: ["users"] });
        } catch {
            toast.error(`Gagal mengubah status "${member.user.name}".`);
        }
    };

    const handleConfirmDelete = async () => {
        if (!deleteState.item) return;

        try {
            const res = await axios.delete(
                route("merchant.venues.memberships.users.destroy", {
                    venue: venue.slug,
                    membershipUser: deleteState.item.slug,
                })
            );

            if (res.data.success) {
                toast.success(res.data.message || "Member berhasil dihapus.");
                router.reload({ only: ["users"] });
            }
        } catch (err) {
            toast.error("Gagal menghapus member.");
        } finally {
            setDeleteState({ show: false, item: null });
        }
    };

    const handleDeleteClick = (member) => {
        setDeleteState({ show: true, item: member });
    };

    const columns = [
        { key: "number", header: "#", className: "text-center content-center" },
        {
            key: "member_no",
            header: "Kode Member",
            className: "text-left content-center",
        },
        {
            key: "name",
            header: "Nama Member",
            render: (val, row) => (
                <div className="font-semibold">{row.user.name}</div>
            ),
            className: "text-left content-center",
        },
        {
            key: "notes",
            header: "Catatan",
            render: (val, row) =>
                row.notes ? (
                    <div className="text-left">{row.notes}</div>
                ) : (
                    <div className="text-center text-gray-500">-</div>
                ),
            className: "text-left content-center",
        },
        {
            key: "created_at",
            header: "Tanggal Pendaftaran",
            render: (val) => formatFullDate(val),
            className: "text-center content-center",
        },
        {
            key: "updated_at",
            header: "Tanggal Pembaruan",
            render: (val) => formatFullDate(val),
            className: "text-center content-center",
        },
        {
            key: "action",
            header: "Aksi",
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
                        onClick={() => openInfoModal(row)}
                    >
                        Info
                    </Button>
                    <Button
                        variant="success"
                        size="xs"
                        onClick={() => openEditModal(row)}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="danger"
                        size="xs"
                        onClick={() => handleDeleteClick(row)}
                    >
                        Hapus
                    </Button>
                </div>
            ),
            className: "text-center content-center",
        },
    ];

    // Jika users memakai pagination, pakai users.data, kalau collection biasa, pakai users langsung
    const tableData = users.data ? users.data : users;

    return (
        <MerchantLayout>
            <Head title={`Membership ${venue.name}`} />
            <Card className="flex flex-col h-full rounded-lg shadow-none dark:border-none">
                <CardHeader>
                    <div className="flex justify-between items-center p-4">
                        <div className="font-bold uppercase text-lg">
                            Member {venue.name}
                        </div>
                        <Button
                            variant="primary"
                            size="xs"
                            onClick={openCreateModal}
                        >
                            + Tambah Member
                        </Button>
                    </div>
                </CardHeader>
                <CardBody className="px-0">
                    <Table
                        columns={columns}
                        data={tableData}
                        wrapperClassName="shadow-none"
                        tableClassName="text-xs"
                        emptyState={
                            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                                Tidak ada data Member Aktif.
                            </div>
                        }
                    />
                </CardBody>
            </Card>

            <DeleteModal
                show={deleteState.show}
                onClose={() => setDeleteState({ show: false, item: null })}
                onConfirm={handleConfirmDelete}
                title="Hapus Member"
                message={`Apakah yakin ingin menghapus member "${deleteState.item?.user.name}"?`}
            />
        </MerchantLayout>
    );
}
