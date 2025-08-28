import { useState } from "react";
import { Head, usePage, router, Link } from "@inertiajs/react";
import { toast } from "react-toastify";
import MerchantLayout from "@/Layouts/MerchantLayout";
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

export default function Index() {
    const { venues = [] } = usePage().props;

    const [showModal, setShowModal] = useState(false);
    const [selectedVenue, setSelectedVenue] = useState(null);

    const columns = [
        { key: "number", header: "#", className: "text-center" },
        { key: "name", header: "Nama Venue" },
        { key: "location", header: "Lokasi" },
        {
            key: "phone_number",
            header: "No Handphone",
            className: "text-center",
        },
        { key: "field", header: "Lapangan" },
        {
            key: "updated_at",
            header: "Tanggal Pembaruan",
            className: "text-center",
        },
        {
            key: "action",
            header: "Aksi",
            className: "text-center",
            render: (val, row) => (
                <div className="flex gap-2 justify-center">
                    <Button
                        variant="info"
                        size="xs"
                        onClick={() => handleInfo(row)}
                    >
                        Info
                    </Button>
                    <Button
                        variant="success"
                        size="xs"
                        onClick={() => handleEdit(row)}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="warning"
                        size="xs"
                        onClick={() => handleField(row)}
                    >
                        Lapangan
                    </Button>
                    <Button
                        variant="tertiary"
                        size="xs"
                        onClick={() => handleBooking(row)}
                    >
                        Booking
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

    const handleCreate = () => {
        router.get(route("merchant.venues.create"));
    };

    const handleInfo = (row) => {
        router.get(route("merchant.venues.show", { venue: row.slug }));
    };

    const handleEdit = (row) => {
        router.get(route("merchant.venues.edit", { venue: row.slug }));
    };

    const handleField = (row) => {
        router.get(route("merchant.venues.fields.index", { venue: row.slug }));
    };

    const handleBooking = (row) => {
        router.get(
            route("merchant.venues.bookings.index", { venue: row.slug })
        );
    };

    const handleDelete = (row) => {
        setSelectedVenue(row);
        setShowModal(true);
    };

    const deleteVenue = () => {
        if (!selectedVenue) return;

        router.delete(
            route("merchant.venues.destroy", { venue: selectedVenue.slug }),
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success("Venue berhasil dihapus!");
                    setShowModal(false);
                    setSelectedVenue(null);
                },
                onError: (errors) => {
                    if (errors?.name) {
                        toast.error(errors.name);
                    } else {
                        toast.error("Gagal menghapus data venue.");
                    }
                },
            }
        );
    };

    return (
        <MerchantLayout>
            <div>
                <Head title="Venues" />
                <Card className="flex flex-col h-full min-h-screen rounded-lg shadow-none dark:border-none">
                    <CardHeader className="border-none">
                        <div className="flex flex-row justify-between items-center p-4">
                            <div className="font-bold">Semua Venue</div>
                            <Button
                                variant="primary"
                                size="xs"
                                onClick={handleCreate}
                            >
                                + New Venue
                            </Button>
                        </div>
                    </CardHeader>
                    <CardBody className="px-0">
                        <div>
                            <Table
                                columns={columns}
                                data={venues.data}
                                wrapperClassName="border-none rounded-none shadow-none"
                                tableClassName="text-xs"
                                emptyState={
                                    <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                                        Tidak ada data.{" "}
                                        <Link
                                            href={route(
                                                "merchant.venues.create"
                                            )}
                                            className="text-gray-900 hover:underline dark:text-primary-400 font-semibold"
                                        >
                                            Tambahkan venue sekarang!
                                        </Link>
                                    </div>
                                }
                            />
                            <Pagination
                                links={venues.links}
                                meta={venues}
                                className="p-6 my-2"
                            />
                        </div>
                    </CardBody>

                    {showModal && selectedVenue && (
                        <DeleteModal
                            show={showModal}
                            onClose={() => setShowModal(false)}
                            onDelete={deleteVenue}
                            title="Hapus Venue"
                            description={`Yakin ingin menghapus venue "${selectedVenue.name}"?`}
                        />
                    )}

                    <CardFooter className="my-2 border-none shadow-none flex p-8"></CardFooter>
                </Card>
            </div>
        </MerchantLayout>
    );
}
