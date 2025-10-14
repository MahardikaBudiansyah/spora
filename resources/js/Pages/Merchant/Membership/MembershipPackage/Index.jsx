import { useState, useEffect } from "react";
import { Head, usePage } from "@inertiajs/react";
import axios from "axios";
import { toast } from "react-toastify";
import MerchantLayout from "@/Layouts/MerchantLayout";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
} from "@/components/Common/Card";
import useModal from "@/hooks/useModal";
import Create from "@/Pages/Merchant/Membership/MembershipPackage/Create";
import Edit from "@/Pages/Merchant/Membership/MembershipPackage/Edit";
import Table from "@/components/Common/Table";
import Button from "@/components/Common/Button";
import ButtonToggle from "@/components/Common/ButtonToggle";
import Badge from "@/components/Common/Badge";
import {
    getMembershipDuration,
    formatDiscountLimit,
} from "@/utils/membershipAttribute";
import {
    formatDiscount,
    translateDiscountType,
    formatRupiah,
} from "@/utils/currency";
import {
    ChevronDown,
    ChevronRight,
    Trash2,
    Eye,
    EyeClosed,
    SquarePen,
} from "lucide-react";
import Tabs from "@/components/Common/Tabs";
import DeleteModal from "@/components/Common/DeleteModal";
import { formatShortDate } from "@/utils/date";

export default function Index() {
    const { venues: initialVenues } = usePage().props;
    const [venuesState, setVenuesState] = useState(initialVenues || []);
    const [deleteState, setDeleteState] = useState({
        show: false,
        item: null,
        venue: null,
    });

    const { isOpen, open, close } = useModal();
    const isCreateModalOpen = isOpen("CreateModal");
    const isEditModalOpen = isOpen("EditModal");
    const [expanded, setExpanded] = useState([]);
    const [selectedVenue, setSelectedVenue] = useState(null);

    const [selectedPackage, setSelectedPackage] = useState(null);

    const toggleExpand = (id) => {
        setExpanded((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const fetchVenues = async () => {
        try {
            const res = await axios.get(
                route("merchant.memberships.packages.index"),
                {
                    headers: { Accept: "application/json" },
                }
            );
            setVenuesState(res.data.venues);
        } catch (err) {
            console.error(err);
            toast.error("Gagal memuat data terbaru.");
        }
    };

    const handleToggleActive = async (venueId, pkg) => {
        try {
            const newStatus = !pkg.is_active;
            // PATCH request ke backend untuk update is_active
            await axios.patch(
                route("merchant.memberships.packages.is_active", pkg.slug),
                {
                    is_active: newStatus,
                }
            );

            // update state lokal
            setVenuesState((prev) =>
                prev.map((venue) =>
                    venue.id === venueId
                        ? {
                              ...venue,
                              membership_packages:
                                  venue.membership_packages.map((p) =>
                                      p.slug === pkg.slug
                                          ? { ...p, is_active: newStatus }
                                          : p
                                  ),
                          }
                        : venue
                )
            );

            toast.success(
                `Paket "${pkg.name}"  berhasil ${
                    newStatus ? "diaktifkan" : "dinonaktifkan"
                }`
            );
        } catch (err) {
            toast.error(`Gagal mengubah status paket "${pkg.name}".`);
        }
    };

    // buka modal hapus
    const handleDeleteClick = (venue, pkg) => {
        setDeleteState({
            show: true,
            item: pkg,
            venue,
        });
    };

    // eksekusi hapus
    const handleConfirmDelete = async () => {
        const { venue, item } = deleteState;
        if (!venue || !item) return;

        try {
            const res = await axios.delete(
                route("merchant.memberships.packages.destroy", {
                    membershipPackages: item.slug,
                }),
                { data: { venue_id: venue.id } }
            );

            if (res.data.success) {
                // update state
                await fetchVenues();

                toast.success(
                    res.data.message || "Paket membership berhasil dihapus."
                );
            }
        } catch (err) {
            console.error(err);
            toast.error("Gagal menghapus paket membership.");
        } finally {
            setDeleteState({ show: false, item: null, venue: null });
        }
    };

    const columns = (venueId) => [
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
            render: (_, row) => <span>{row.name}</span>,
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

            render: (_, row) => {
                const { label, color } = getMembershipDuration(
                    row.duration_months
                );
                return <Badge color={color}>{label}</Badge>;
            },
            className: "text-center content-center whitespace-nowrap w-24",
        },
        {
            key: "price",
            header: "Harga",
            render: (val, row) => formatRupiah(val),
            className: "text-right content-center whitespace-nowrap w-32",
        },
        {
            key: "updated_at",
            header: "Tanggal Pembaruan",
            render: (val, row) => formatShortDate(val),
            className: "text-center content-center",
        },
        {
            key: "action",
            header: "Aksi",
            render: (_, row) => (
                <div className="flex gap-2 justify-center items-center">
                    <ButtonToggle
                        active={row.is_active}
                        onClick={() => handleToggleActive(venueId, row)}
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
                        tooltip="Edit"
                        onClick={() => {
                            const venueSelected = venuesState.find(
                                (v) => v.id === venueId
                            );
                            const pkgSelected = row;

                            setSelectedVenue(venueSelected);
                            setSelectedPackage(pkgSelected);
                            open("EditModal");
                        }}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="danger"
                        size="xs"
                        tooltip="Hapus"
                        onClick={() =>
                            handleDeleteClick(
                                venuesState.find((v) => v.id === venueId),
                                row
                            )
                        }
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
            <Head title="Paket Membership" />
            <Card className="flex flex-col h-full rounded-lg shadow-none dark:border-none">
                <CardHeader>
                    <div className="flex flex-row justify-between items-center p-4">
                        <div className="font-bold uppercase text-xl">
                            Paket Memberships
                        </div>
                    </div>
                </CardHeader>
                <CardBody className="px-0 pb-8">
                    <div className="m-4">
                        <Tabs
                            defaultActive={0}
                            orientation="vertical"
                            className="text-sm"
                            tabs={venuesState.map((venue) => ({
                                id: venue.id,
                                label: venue.name,
                                content: (
                                    <div className="flex flex-col gap-2">
                                        <div className="m-2 text-right">
                                            <Button
                                                type="button"
                                                variant="primary"
                                                onClick={() => {
                                                    setSelectedVenue(venue); // ⬅️ simpan venue
                                                    open("CreateModal");
                                                }}
                                                className="text-xs"
                                            >
                                                + Tambah Paket Membership
                                            </Button>
                                        </div>
                                        <div className="m-2">
                                            <Table
                                                columns={columns(venue.id)}
                                                data={
                                                    venue.membership_packages ||
                                                    []
                                                }
                                                wrapperClassName=" shadow-none"
                                                tableClassName="text-xs items-center"
                                                expandedRowKeys={expanded}
                                                renderExpandRow={(row) => {
                                                    if (!row) return null;
                                                    const combinedBenefits = [
                                                        ...(
                                                            row.discounts || []
                                                        ).map((d) => ({
                                                            id: `discount-${d.id}`,
                                                            type: "Diskon",
                                                            name: d.name,
                                                            description:
                                                                d.description ||
                                                                "-",
                                                            discount_type:
                                                                d.discount_type,
                                                            discount_value:
                                                                formatDiscount(
                                                                    d.discount_type,
                                                                    d.discount_value
                                                                ),
                                                            discount_limit:
                                                                d.discount_limit,
                                                        })),
                                                        ...(
                                                            row.others || []
                                                        ).map((o) => ({
                                                            id: `other-${o.id}`,
                                                            type: "Lainnya",
                                                            name: o.name,
                                                            description:
                                                                o.description ||
                                                                "-",
                                                            discount_type: "-",
                                                            discount_value: "-",
                                                        })),
                                                    ];

                                                    return (
                                                        <div className="px-8 pt-4 pb-8 flex flex-col gap-4 bg-white dark:bg-secondary-900 border-b-2 border-b-secondary-200 dark:border-secondary-700">
                                                            <span className="font-semibold">
                                                                Manfaat
                                                                Membership:{" "}
                                                                {row.order_no}
                                                            </span>
                                                            <Table
                                                                columns={
                                                                    columnBenefits
                                                                }
                                                                data={
                                                                    combinedBenefits
                                                                }
                                                                wrapperClassName="shadow-sm"
                                                                tableClassName="text-xs"
                                                                emptyState={
                                                                    <div className="text-center text-sm text-gray-500">
                                                                        Tidak
                                                                        ada
                                                                        Manfaat
                                                                        Membership.
                                                                    </div>
                                                                }
                                                            />
                                                        </div>
                                                    );
                                                }}
                                                emptyState={
                                                    <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                                                        Tidak ada data Paket
                                                        Membership untuk venue
                                                        ini.
                                                    </div>
                                                }
                                            />
                                        </div>
                                    </div>
                                ),
                            }))}
                        />
                    </div>
                </CardBody>

                <CardFooter className="my-8 p-8 flex justify-end gap-2"></CardFooter>
            </Card>
            {deleteState.show && (
                <DeleteModal
                    show={deleteState.show}
                    onClose={() =>
                        setDeleteState({ show: false, item: null, venue: null })
                    }
                    onDelete={handleConfirmDelete}
                    title="Hapus Paket Membership"
                    description={`Yakin ingin menghapus paket "${deleteState.item.name}"?`}
                />
            )}

            <Create
                show={isCreateModalOpen}
                onClose={close}
                venue={selectedVenue}
                fetchVenues={fetchVenues}
            />
            <Edit
                show={isEditModalOpen}
                onClose={close}
                venue={selectedVenue}
                fetchVenues={fetchVenues}
                pkg={selectedPackage}
            />
        </MerchantLayout>
    );
}
