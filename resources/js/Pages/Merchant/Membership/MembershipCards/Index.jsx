import { useState, useEffect } from "react";
import { Head, usePage, router, Link } from "@inertiajs/react";
import useModal from "@/hooks/useModal";
import MerchantLayout from "@/Layouts/MerchantLayout";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
} from "@/components/Common/Card";
import Button from "@/components/Common/Button";
import { toast } from "react-toastify";
import DeleteModal from "@/components/Common/DeleteModal";
import MembershipCardTable from "@/components/Memberships/MembershipCardTable";
import MembershipCardModal from "@/components/Memberships/MembershipCardModal";
import DevelopmentPlaceholder from "@/components/Common/DevelopmentPlaceholder";
import { FileText, Plus } from "lucide-react";
import BannerAlert from "@/components/Common/BannerAlert";

export default function Index() {
    const { merchant, membershipCards, venues, can_create } = usePage().props;

    const { isOpen, open, close } = useModal();

    const [modalState, setModalState] = useState({ show: false, member: null });
    const [deleteState, setDeleteState] = useState({ show: false, item: null });

    const getRouteParams = (member) => ({ membership_card: member.slug });

    const handleToggleActive = (member) => {
        router.patch(
            route(
                "merchant.memberships.cards.toggleActive",
                getRouteParams(member),
            ),
            {
                preserveScroll: true,
                onSuccess: () => toast.success("Status berhasil diperbarui."),
            },
        );
    };

    const handleConfirmDelete = () => {
        if (!deleteState.item) return;
        router.delete(
            route(
                "merchant.memberships.cards.destroy",
                getRouteParams(deleteState.item),
            ),
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success("Kartu Member berhasil dihapus.");
                    setDeleteState({ show: false, item: null });
                },
                onError: () => toast.error("Gagal menghapus kartu."),
            },
        );
    };

    return (
        <MerchantLayout>
            <Head title="Kelola Data Member" />
            <Card className="flex flex-col h-full rounded-md shadow-none">
                <CardHeader className="p-4 md:p-6">
                    <div className="p-2 flex flex-col md:flex-row justify-between gap-6 md:items-center">
                        <div className="flex flex-col md:gap-1 md:text-left">
                            <div className="flex flex-wrap flex-row md:flex-row gap-2 font-bold text-2xl items-center ">
                                <span>Kelola</span>
                                <span className="text-primary-600 dark:text-primary-500">
                                    Data Member
                                </span>
                            </div>
                            <div className="text-sm text-secondary-500 dark:text-secondary-400 font-semibold">
                                <span>Mitra </span>
                                <span>{merchant.name}</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="primary"
                                size="xs"
                                onClick={() =>
                                    setModalState({ show: true, member: null })
                                }
                                disabled={!can_create}
                                className="px-2 md:px-3 gap-1.5"
                            >
                                <Plus className="w-4 h-4 md:h-3" />
                                <span>Tambah Member</span>
                            </Button>
                            <Button
                                variant="outline"
                                size="xs"
                                onClick={() => open("PrintModal")}
                                disabled={!can_create}
                                className="px-2 md:px-3 gap-1.5"
                            >
                                <FileText className="w-4 h-4" />
                                <span>Cetak Data</span>
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                <CardBody className="py-4 md:py-6 px-0 min-h-[280px] sm:min-h-[310px] flex flex-col">
                    {!can_create && (
                        <BannerAlert
                            type="warning"
                            title="Verifikasi Data Mitra Diperlukan"
                            size="md"
                            titleClassName="text-xs"
                            className="mt-0 mb-4 mx-4 md:mx-8"
                        >
                            <div className="flex text-xs">
                                <p>
                                    Anda belum dapat menambah atau mengelola
                                    kartu member (membership) secara penuh
                                    sebelum verifikasi profil Mitra Anda
                                    disetujui oleh Admin. Silakan lengkapi data
                                    profil dan tunggu proses verifikasi.{" "}
                                    <Link
                                        href={route("merchant.profile.index")}
                                        className="font-bold"
                                    >
                                        Lengkapi Profil Sekarang.
                                    </Link>
                                </p>
                            </div>
                        </BannerAlert>
                    )}
                    <div className="py-2 flex-1 overflow-x-auto">
                        <MembershipCardTable
                            membershipCards={membershipCards}
                            viewMode="global"
                            onToggle={handleToggleActive}
                            onDelete={(member) =>
                                setDeleteState({ show: true, item: member })
                            }
                            onEdit={(member) =>
                                setModalState({ show: true, member })
                            }
                            onPrint={() => setShowPrintModal(true)}
                        />
                    </div>
                </CardBody>
                <CardFooter className="p-7 md:p-8 flex justify-end "></CardFooter>
            </Card>

            <MembershipCardModal
                show={modalState.show}
                onClose={() => setModalState({ show: false, member: null })}
                member={modalState.member}
                venueList={venues}
                fixedVenueId={null}
                routes={{
                    store: route("merchant.memberships.cards.store"),
                    update: modalState.member
                        ? route("merchant.memberships.cards.update", {
                              membership_card: modalState.member.slug,
                          })
                        : null,
                }}
            />

            <DevelopmentPlaceholder
                title="Fitur Cetak Data"
                show={isOpen("PrintModal")}
                onClose={close}
            />

            <DeleteModal
                show={deleteState.show}
                onClose={() => setDeleteState({ show: false, item: null })}
                onConfirm={handleConfirmDelete}
                title="Hapus Kartu Member"
                description={`Hapus kartu member "${
                    deleteState.item?.name || ""
                }"?`}
            />
        </MerchantLayout>
    );
}
