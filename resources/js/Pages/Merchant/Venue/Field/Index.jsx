import { useState } from "react";
import { Head, usePage, router, Link } from "@inertiajs/react";
import { toast } from "react-toastify";
import MerchantLayout from "@/Layouts/MerchantLayout";
import Pagination from "@/components/common/Pagination";
import {
    Card,
    CardBody,
    CardFooter,
    CardHeader,
} from "@/components/Common/Card";
import Table from "@/components/Common/Table";
import Button from "@/components/Common/Button";
import DeleteModal from "@/components/common/DeleteModal";
import { formatFullDate } from "@/utils/date";

export default function Index() {
    const { fields, venue } = usePage().props;

    const [showModal, setShowModal] = useState(false);
    const [selectedField, setSelectedField] = useState(null);

    const columns = [
        { key: "number", header: "#", className: "text-center" },
        { key: "name", header: "Nama Lapangan" },
        { key: "fieldType", header: "Tipe Lapangan", className: "text-center" },
        { key: "description", header: "Deskripsi" },
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
                        onClick={() => handleCalendar(row)}
                    >
                        Kalender
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

    const handleInfo = (row) => {
        router.get(
            route("merchant.venues.fields.show", {
                venue: venue.slug,
                field: row.slug,
            })
        );
    };

    const handleEdit = (row) => {
        router.get(
            route("merchant.venues.fields.edit", {
                venue: venue.slug,
                field: row.slug,
            })
        );
    };

    const handleCalendar = (row) => {
        router.get(
            route("merchant.venues.fields.calendar", {
                venue: venue.slug,
                field: row.slug,
            })
        );
    };

    const handleDelete = (row) => {
        setSelectedField(row);
        setShowModal(true);
    };

    const deleteField = () => {
        if (!selectedField) return;

        router.delete(
            route("merchant.venues.fields.destroy", {
                venue: venue.slug,
                field: selectedField.slug,
            }),
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success("Lapangan berhasil dihapus!");
                    setShowModal(false);
                    setSelectedField(null);
                },
                onError: (errors) => {
                    if (errors?.name) {
                        toast.error(errors.name);
                    } else {
                        toast.error("Gagal menghapus data lapangan.");
                    }
                },
            }
        );
    };

    return (
        <MerchantLayout>
            <Head title="Lapangan" />
            <Card className="flex flex-col h-full rounded-lg shadow-none dark:border-none">
                <CardHeader>
                    <div className="flex flex-row justify-between items-center p-4">
                        <div className="font-bold uppercase text-lg">
                            {venue?.name
                                ? `Daftar Lapangan di ${venue.name}`
                                : "Memuat data venue..."}
                        </div>
                        <Button
                            variant="primary"
                            size="xs"
                            onClick={() =>
                                router.get(
                                    route("merchant.venues.fields.create", {
                                        venue: venue.slug,
                                    })
                                )
                            }
                        >
                            + Lapangan Baru
                        </Button>
                    </div>
                </CardHeader>
                <CardBody className="px-0 pb-8">
                    <Table
                        columns={columns}
                        data={fields.data}
                        wrapperClassName="border-none rounded-none shadow-none"
                        tableClassName="text-xs"
                        emptyState={
                            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                                Tidak ada data.{" "}
                                <Link
                                    href={route(
                                        "merchant.venues.fields.create",
                                        {
                                            venue: venue.slug,
                                        }
                                    )}
                                    className="text-gray-900 hover:underline dark:text-primary-400 font-semibold"
                                >
                                    Tambahkan lapangan sekarang!
                                </Link>
                            </div>
                        }
                    />
                    <Pagination
                        links={fields.links}
                        meta={fields}
                        className="p-6 my-2"
                    />
                </CardBody>

                {showModal && selectedField && (
                    <DeleteModal
                        show={showModal}
                        onClose={() => setShowModal(false)}
                        onDelete={deleteField}
                        title="Hapus Lapangan"
                        description={`Yakin ingin menghapus lapangan "${selectedField.name}"?`}
                    />
                )}

                <CardFooter className="my-8 p-8 flex justify-end gap-2">
                    <Button
                        variant="light"
                        type="button"
                        onClick={() =>
                            router.get(route("merchant.venues.index"))
                        }
                    >
                        Kembali ke Venue
                    </Button>
                </CardFooter>
            </Card>
        </MerchantLayout>
    );
}
