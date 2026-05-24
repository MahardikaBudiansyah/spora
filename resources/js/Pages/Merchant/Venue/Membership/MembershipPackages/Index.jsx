import { useState } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import axios from "axios";
import { toast } from "react-toastify";
import useModal from "@/hooks/useModal";
import MerchantLayout from "@/Layouts/MerchantLayout";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
} from "@/components/Common/Card";
import Button from "@/components/Common/Button";
import DeleteModal from "@/components/Common/DeleteModal";

import MembershipPackageTable from "@/components/Memberships/MembershipPackageTable";
import Create from "@/Pages/Merchant/Venue/Membership/MembershipPackages/Create";
import Edit from "@/Pages/Merchant/Venue/Membership/MembershipPackages/Edit";
import DevelopmentPlaceholder from "@/components/Common/DevelopmentPlaceholder";
import { FileText, Plus, ArrowLeft } from "lucide-react";

export default function Index() {
    const { venue, packages: { data: packages = [] } = {} } = usePage().props;
    const { isOpen, open, close } = useModal();

    const [selectedPackage, setSelectedPackage] = useState(null);
    const [deleteState, setDeleteState] = useState({
        show: false,
        item: null,
    });

    const handleToggleActive = async (pkg) => {
        try {
            await axios.patch(
                route("merchant.venues.memberships.packages.toggle", {
                    venue: venue.slug,
                    package: pkg.slug,
                }),
            );
            toast.success(`Status paket "${pkg.name}" berhasil diperbarui.`);
            router.reload({ only: ["packages"] });
        } catch {
            toast.error("Gagal mengubah status paket.");
        }
    };

    const handleEditClick = (pkg) => {
        setSelectedPackage(pkg);
        open("EditModal");
    };

    const handleDeleteClick = (pkg) => {
        setDeleteState({ show: true, item: pkg });
    };

    const handleConfirmDelete = async () => {
        if (!deleteState.item) return;
        try {
            const res = await axios.delete(
                route("merchant.venues.memberships.packages.destroy", {
                    venue: venue.slug,
                    package: deleteState.item.slug,
                }),
            );
            if (res.data.success) {
                toast.success(res.data.message);
                router.reload({ only: ["packages"] });
            }
        } catch (err) {
            toast.error("Gagal menghapus paket.");
        } finally {
            setDeleteState({ show: false, item: null });
        }
    };

    return (
        <MerchantLayout>
            <Head title={`Kelola Paket Membership ${venue.name}`} />
            <Card className="flex flex-col h-full rounded-md shadow-none">
                <CardHeader className="p-4 md:p-6">
                    <div className="p-2 flex flex-col md:flex-row justify-between gap-6 md:items-center">
                        <div className="flex flex-col md:gap-1 md:text-left">
                            <div className="flex flex-wrap flex-row md:flex-row gap-2 font-bold text-2xl items-center ">
                                <span>Kelola</span>
                                <span className="text-primary-600 dark:text-primary-500">
                                    Paket Membership
                                </span>
                            </div>
                            <div className="text-sm text-secondary-500 dark:text-secondary-400 font-semibold">
                                <span>Venue </span>
                                <span>{venue.name}</span>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                variant="primary"
                                size="xs"
                                onClick={() => open("CreateModal")}
                                className="px-2 md:px-3 gap-1.5"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Tambah Paket</span>
                            </Button>

                            <Button
                                variant="outline"
                                size="xs"
                                onClick={() => open("PrintModal")}
                                className="px-2 md:px-3 gap-1.5"
                            >
                                <FileText className="w-4 h-4" />
                                <span>Cetak Data</span>
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardBody className="py-4 md:py-6 px-0 min-h-[280px] sm:min-h-[310px] flex flex-col">
                    <div className="py-2 flex-1 overflow-x-auto">
                        <MembershipPackageTable
                            packages={packages}
                            onToggle={handleToggleActive}
                            onEdit={handleEditClick}
                            onDelete={handleDeleteClick}
                        />
                    </div>
                </CardBody>
                <CardFooter className="p-6 md:p-8 flex gap-2 justify-end">
                    <Button
                        variant="light"
                        size="xs"
                        onClick={() =>
                            router.get(route("merchant.venues.index"))
                        }
                        className="flex gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Kembali</span>
                    </Button>
                </CardFooter>
            </Card>

            <Create
                show={isOpen("CreateModal")}
                onClose={close}
                venue={venue}
                fetchPackages={() => router.reload({ only: ["packages"] })}
            />
            <Edit
                show={isOpen("EditModal")}
                onClose={close}
                venue={venue}
                pkg={selectedPackage}
                fetchPackages={() => router.reload({ only: ["packages"] })}
            />

            <DevelopmentPlaceholder
                title={`Cetak Data Paket Membership ${venue.name}`}
                show={isOpen("PrintModal")}
                onClose={close}
            />

            <DeleteModal
                show={deleteState.show}
                onClose={() => setDeleteState({ show: false, item: null })}
                onConfirm={handleConfirmDelete}
                title="Hapus Paket Membership"
                description={`Yakin ingin menghapus paket "${deleteState.item?.name}"?`}
            />
        </MerchantLayout>
    );
}
