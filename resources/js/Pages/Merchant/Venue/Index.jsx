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

import { formatTo08 } from "@/utils/numberPhone";
import { formatFullDate } from "@/utils/date";

export default function Index() {
    const { venues = [] } = usePage().props;

    const [showModal, setShowModal] = useState(false);
    const [selectedVenue, setSelectedVenue] = useState(null);

    const columns = [
        { key: "number", header: "#", className: "text-center" },
        { key: "name", header: "Nama Venue" },
        {
            key: "address",
            header: "Alamat",
            render: (val, row) =>
                row.address ? (
                    <div className="text-left">{row.address}</div>
                ) : (
                    <div className="text-center">-</div>
                ),
        },
        {
            key: "phone_number",
            header: "No Handphone",
            render: (val, row) => formatTo08(row.phone_number) || "-",
            className: "text-center",
        },
        {
            key: "field",
            header: "Lapangan",
            render: (val, row) =>
                row.field && row.field.length > 0 ? (
                    <ul className="flex flex-col gap-1">
                        {row.field.map((name, idx) => (
                            <li
                                key={idx}
                                className="px-2 py-0.5 bg-secondary-200 dark:bg-secondary-800 rounded-md text-xs"
                            >
                                {name}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <span className="text-secondary-500 italic">
                        Belum ada lapangan
                    </span>
                ),
        },
        {
            key: "updated_at",
            header: "Tanggal Pembaruan",
            render: (val, row) => formatFullDate(row.updated_at) || "-",
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
                        variant="pink"
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
            <Head title="Venues" />
            <Card className="flex flex-col h-full rounded-lg shadow-none dark:border-none">
                <CardHeader className="">
                    <div className="flex flex-row justify-between items-center p-4">
                        <div className="font-bold uppercase text-lg">
                            Semua Venue
                        </div>
                        <Button
                            variant="primary"
                            size="xs"
                            onClick={handleCreate}
                        >
                            + New Venue
                        </Button>
                    </div>
                </CardHeader>
                <CardBody className="px-0 pb-8">
                    <Table
                        columns={columns}
                        data={venues.data}
                        wrapperClassName="border-none rounded-none shadow-none"
                        tableClassName="text-xs"
                        emptyState={
                            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                                Tidak ada data.{" "}
                                <Link
                                    href={route("merchant.venues.create")}
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

                <CardFooter className="my-8 p-8 flex justify-end gap-2"></CardFooter>
            </Card>
        </MerchantLayout>
    );
}
