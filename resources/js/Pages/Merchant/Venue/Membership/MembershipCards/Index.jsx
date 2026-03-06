import { useState } from "react";
import { Head, usePage, router } from "@inertiajs/react";
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
import { ArrowLeft, FileText, Plus } from "lucide-react";

export default function Index() {
    const { venue, membershipCards } = usePage().props;

    const { isOpen, open, close } = useModal();

    const [modalState, setModalState] = useState({ show: false, member: null });
    const [deleteState, setDeleteState] = useState({ show: false, item: null });

    const getRouteParams = (member = null) => {
        const params = { venue: venue.slug };
        if (member) {
            params.membership_card = member.slug;
        }
        return params;
    };

    const handleToggleActive = (member) => {
        router.patch(
            route(
                "merchant.venues.memberships.cards.toggleActive",
                getRouteParams(member)
            ),
            {
                preserveScroll: true,
                onSuccess: () => toast.success("Status berhasil diperbarui."),
                onError: () => toast.error("Gagal mengubah status."),
            }
        );
    };

    const handleConfirmDelete = () => {
        if (!deleteState.item) return;

        router.delete(
            route(
                "merchant.venues.memberships.cards.destroy",
                getRouteParams(deleteState.item)
            ),
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success("Kartu Member berhasil dihapus.");
                    setDeleteState({ show: false, item: null });
                },
                onError: () => toast.error("Gagal menghapus Kartu Member."),
            }
        );
    };

    return (
        <MerchantLayout>
            <Head title={`Daftar Member - ${venue.name}`} />
            <Card className="flex flex-col h-full rounded-md shadow-none">
                <CardHeader className="p-4 md:p-6">
                    <div className="p-2 flex flex-col md:flex-row justify-between gap-6 md:items-center">
                        <div className="flex flex-col md:gap-1 md:text-left">
                            <div className="flex flex-wrap flex-row md:flex-row gap-2 font-bold text-2xl items-center ">
                                <span>Daftar</span>
                                <span className="text-primary-600 dark:text-primary-500">
                                    Member
                                </span>
                            </div>
                            <div className="text-sm text-secondary-600 dark:text-secondary-400">
                                <span>Venue </span>
                                <span>{venue.name}</span>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                variant="primary"
                                size="xs"
                                onClick={() =>
                                    setModalState({
                                        show: true,
                                        member: null,
                                    })
                                }
                                className="px-2 md:px-3 gap-1.5"
                            >
                                <Plus className="w-4 h-4 md:h-3" />
                                <span>Tambah Member</span>
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
                        <MembershipCardTable
                            membershipCards={membershipCards}
                            viewMode="venue"
                            onToggle={handleToggleActive}
                            onEdit={(member) =>
                                setModalState({ show: true, member })
                            }
                            onDelete={(member) =>
                                setDeleteState({ show: true, item: member })
                            }
                            onPrint={() => setShowPrintModal(true)}
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

            <MembershipCardModal
                show={modalState.show}
                onClose={() => setModalState({ show: false, member: null })}
                member={modalState.member}
                venueList={[]}
                fixedVenueId={venue?.id}
                routes={{
                    store: route("merchant.venues.memberships.cards.store", {
                        venue: venue.slug,
                    }),
                    update: modalState.member
                        ? route("merchant.venues.memberships.cards.update", {
                              venue: venue.slug,
                              membership_card: modalState.member.slug,
                          })
                        : null,
                }}
            />

            <DevelopmentPlaceholder
                title={`Cetak Data Member ${venue.name}`}
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
