import { useState } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import { toast } from "react-toastify";
import MerchantLayout from "@/Layouts/MerchantLayout";
import {
    Card,
    CardBody,
    CardFooter,
    CardHeader,
} from "@/components/Common/Card";
import Button from "@/components/Common/Button";
import DeleteModal from "@/components/common/DeleteModal";
import { ArrowLeft, Plus } from "lucide-react";
import CourtTable from "@/features/courts/components/tables/CourtTable";

export default function Index() {
    const {
        auth,
        venue,
        courts: { data: courts },
    } = usePage().props;

    const [showModal, setShowModal] = useState(false);
    const [selectedCourt, setSelectedCourt] = useState(null);

    const handleDelete = (row) => {
        setSelectedCourt(row);
        setShowModal(true);
    };

    const deleteCourt = () => {
        if (!selectedCourt) return;

        router.delete(
            route("merchant.venues.courts.destroy", {
                venue: venue.slug,
                court: selectedCourt.slug,
            }),
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success("Lapangan berhasil dihapus!");
                    setShowModal(false);
                    setSelectedCourt(null);
                },
                onError: (errors) => {
                    if (errors?.name) {
                        toast.error(errors.name);
                    } else {
                        toast.error("Gagal menghapus data lapangan.");
                    }
                },
            },
        );
    };

    return (
        <MerchantLayout>
            <Head title={`Kelola Lapangan - ${venue?.name}`} />
            <Card className="flex flex-col h-full rounded-md shadow-none">
                <CardHeader className="p-4 md:p-6">
                    <div className="p-2 flex flex-col md:flex-row justify-between gap-6 md:items-center">
                        <div className="flex flex-col md:gap-1 md:text-left">
                            <div className="flex flex-row md:flex-row gap-2 font-bold text-2xl items-center ">
                                <span>Kelola</span>
                                <span className="text-primary-600 dark:text-primary-500">
                                    Lapangan
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
                                href={route("merchant.venues.courts.create", {
                                    venue: venue.slug,
                                    court: courts.slug,
                                })}
                                className="flex items-center w-auto gap-1.5 px-3 min-w-max"
                            >
                                <Plus className="w-4 h-4 md:h-3" />
                                <span>Lapangan Baru</span>
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardBody className="py-4 md:py-6 px-0 min-h-[280px] sm:min-h-[310px] flex flex-col">
                    <CourtTable
                        auth={auth}
                        venue={venue}
                        courts={courts}
                        handleDelete={handleDelete}
                    />
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
            {showModal && selectedCourt && (
                <DeleteModal
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    onConfirm={deleteCourt}
                    title="Hapus Lapangan"
                    description={`Yakin ingin menghapus lapangan "${selectedCourt.name}"?`}
                />
            )}
        </MerchantLayout>
    );
}
