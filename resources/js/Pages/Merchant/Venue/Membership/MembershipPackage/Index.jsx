import { useState } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import MerchantLayout from "@/Layouts/MerchantLayout";
import { Card, CardHeader, CardBody } from "@/components/Common/Card";
import Table from "@/components/Common/Table";
import Button from "@/components/Common/Button";
import {
    formatDiscount,
    translateDiscountType,
    formatRupiah,
} from "@/utils/currency";
import { formatShortDate } from "@/utils/date";
import Badge from "@/components/Common/Badge";
import { getMembershipDuration } from "@/utils/membershipAttribute";
import { ChevronRight, ChevronDown, Eye, EyeClosed } from "lucide-react";
import ButtonToggle from "@/components/Common/ButtonToggle";
import { toast } from "react-toastify";
import Create from "@/Pages/Merchant/Venue/Membership/MembershipPackage/Create";
import Edit from "@/Pages/Merchant/Venue/Membership/MembershipPackage/Edit";
import DeleteModal from "@/components/Common/DeleteModal";

export default function Index() {
    const { venue, packages } = usePage().props; // dikirim dari controller
    const [expanded, setExpanded] = useState([]);

    const [showCreate, setShowCreate] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [deleteState, setDeleteState] = useState({
        show: false,
        item: null,
    });

    const openCreateModal = () => setShowCreate(true);
    const closeCreateModal = () => setShowCreate(false);
    const handleDeleteClick = (pkg) => {
        setDeleteState({ show: true, item: pkg });
    };

    const openEditModal = (pkg) => {
        setSelectedPackage(pkg);
        setShowEdit(true);
    };
    const closeEditModal = () => {
        setSelectedPackage(null);
        setShowEdit(false);
    };

    const toggleExpand = (id) => {
        setExpanded((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const handleToggleActive = async (membershipPackage) => {
        try {
            await axios.patch(
                route("merchant.venues.memberships.packages.toggle", {
                    venue: venue.slug,
                    package: membershipPackage.slug,
                })
            );

            toast.success(
                `Paket "${membershipPackage.name}" berhasil diubah statusnya.`
            );
            router.reload({ only: ["packages"] });
        } catch {
            toast.error(
                `Gagal mengubah status paket "${membershipPackage.name}".`
            );
        }
    };

    const handleConfirmDelete = async () => {
        if (!deleteState.item) return;

        try {
            const res = await axios.delete(
                route("merchant.venues.memberships.packages.destroy", {
                    venue: venue.slug,
                    package: deleteState.item.slug,
                })
            );

            if (res.data.success) {
                toast.success(res.data.message || "Paket berhasil dihapus.");
                router.reload({ only: ["packages"] });
            }
        } catch (err) {
            toast.error("Gagal menghapus paket membership.");
        } finally {
            setDeleteState({ show: false, item: null });
        }
    };

    const columns = [
        {
            key: "expand",
            header: "",
            render: (_, row) =>
                row ? (
                    <button onClick={() => toggleExpand(row.id)}>
                        {expanded.includes(row.id) ? (
                            <ChevronDown className="w-4 h-4" />
                        ) : (
                            <ChevronRight className="w-4 h-4" />
                        )}
                    </button>
                ) : null,

            className: "text-center content-center",
        },
        {
            key: "name",
            header: "Nama Paket",
            render: (val, row) => (
                <div className="font-semibold">{row.name}</div>
            ),
            className: "content-center",
        },
        {
            key: "description",
            header: "Deskripsi",
            className: "text-left content-center",
        },
        {
            key: "duration_months",
            header: "Durasi Paket",
            render: (val, row) => {
                const { label, color } = getMembershipDuration(val);
                return <Badge color={color}>{label}</Badge>;
            },
            className: "text-center content-center whitespace-nowrap w-24",
        },

        {
            key: "price",
            header: "Harga",
            render: (val) => formatRupiah(val),
            className: "text-right content-center whitespace-nowrap w-32",
        },
        {
            key: "updated_at",
            header: "Tanggal Pembaruan",
            render: (val) => formatShortDate(val),
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

    const columnBenefits = [
        {
            key: "type",
            header: "Tipe Manfaat",
            className: "text-center content-center",
        },
        { key: "name", header: "Nama Manfaat", className: "content-left" },
        { key: "description", header: "Deskripsi", className: "content-left" },
        {
            key: "discount_type",
            header: "Jenis Diskon",
            className: "text-center content-center",
            render: (_, row) => translateDiscountType(row.discount_type),
        },
        {
            key: "discount_value",
            header: "Nilai Diskon",
            className: "text-center content-center whitespace-nowrap w-32",
            render: (_, row) => row.discount_value,
        },
        {
            key: "discount_limit",
            header: "Limit Diskon",
            className: "text-center content-center whitespace-nowrap w-32",
            render: (_, row) => {
                if (row.type === "Lainnya") {
                    return "-"; // biar lebih netral
                }

                if (!row.discount_limit) {
                    return <Badge color="green">Tidak terbatas</Badge>;
                }

                return (
                    <Badge color="green">{row.discount_limit} slot/jam</Badge>
                );
            },
        },
    ];

    return (
        <MerchantLayout>
            <Head title={`Membership ${venue.name}`} />
            <Card className="flex flex-col h-full rounded-lg shadow-none dark:border-none">
                <CardHeader>
                    <div className="flex flex-row justify-between items-center p-4">
                        <div className="font-bold uppercase text-lg">
                            Paket Keanggotaan {venue.name}
                        </div>
                        <Button
                            variant="primary"
                            size="xs"
                            onClick={openCreateModal}
                        >
                            + Tambah Paket Membership
                        </Button>
                    </div>
                </CardHeader>
                <CardBody className="px-0">
                    <Table
                        columns={columns}
                        data={packages}
                        wrapperClassName=" shadow-none"
                        tableClassName="text-xs items-center"
                        expandedRowKeys={expanded}
                        renderExpandRow={(row) => {
                            if (!row) return null;
                            const combinedBenefits = [
                                ...(row.discounts || []).map((d) => ({
                                    id: `discount-${d.id}`,
                                    type: "Diskon",
                                    name: d.name,
                                    description: d.description || "-",
                                    discount_type: d.discount_type,
                                    discount_value: formatDiscount(
                                        d.discount_type,
                                        d.discount_value
                                    ),
                                    discount_limit: d.discount_limit,
                                })),
                                ...(row.others || []).map((o) => ({
                                    id: `other-${o.id}`,
                                    type: "Lainnya",
                                    name: o.name,
                                    description: o.description || "-",
                                    discount_type: "-",
                                    discount_value: "-",
                                })),
                            ];

                            return (
                                <div className="px-8 pt-4 pb-8 flex flex-col gap-4 bg-white dark:bg-secondary-900 border-b-2 border-b-secondary-200 dark:border-secondary-700">
                                    <span className="font-semibold">
                                        Manfaat Membership: {row.order_no}
                                    </span>
                                    <Table
                                        columns={columnBenefits}
                                        data={combinedBenefits}
                                        wrapperClassName="shadow-sm"
                                        tableClassName="text-xs"
                                        emptyState={
                                            <div className="text-center text-sm text-gray-500">
                                                Tidak ada Manfaat Membership.
                                            </div>
                                        }
                                    />
                                </div>
                            );
                        }}
                        emptyState={
                            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                                Tidak ada data Paket Membership untuk venue ini.
                            </div>
                        }
                    />
                </CardBody>
            </Card>
            {/* Modal Create */}
            {showCreate && (
                <Create
                    show={showCreate}
                    onClose={closeCreateModal}
                    venue={venue}
                    fetchPackages={() => router.reload({ only: ["packages"] })}
                />
            )}

            {/* Modal Edit */}
            {showEdit && selectedPackage && (
                <Edit
                    show={showEdit}
                    onClose={closeEditModal}
                    venue={venue}
                    pkg={selectedPackage}
                    fetchPackages={() => router.reload({ only: ["packages"] })}
                />
            )}

            {deleteState.show && (
                <DeleteModal
                    show={deleteState.show}
                    onClose={() => setDeleteState({ show: false, item: null })}
                    onDelete={handleConfirmDelete}
                    title="Hapus Paket Membership"
                    description={`Yakin ingin menghapus paket "${deleteState.item.name}"?`}
                />
            )}
        </MerchantLayout>
    );
}
