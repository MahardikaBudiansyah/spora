import { useState } from "react";
import { Head, usePage, router, Link } from "@inertiajs/react";
import { toast } from "react-toastify";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
} from "@/components/Common/Card";
import Table from "@/components/Common/Table";
import Button from "@/components/Common/Button";
import Pagination from "@/components/common/Pagination";
import Badge from "@/components/Common/Badge";
import ButtonToggle from "@/components/Common/ButtonToggle";
import { Eye, EyeClosed } from "lucide-react";

import { formatTo08 } from "@/utils/numberPhone";
import { formatFullDateTime } from "@/utils/date";
import {
    getVenueStatus,
    getVenueFieldsCountBadge,
} from "@/utils/venueAttribute";

export default function Index() {
    const { venues = [] } = usePage().props;

    const columns = [
        { key: "", header: "#", className: "text-center content-center" },
        { key: "name", header: "Nama Venue", className: "content-center" },
        {
            key: "merchant_name",
            header: "Mitra",
            render: (val, row) => (row.merchant ? row.merchant.name : "-"),
            className: "content-center",
        },
        {
            key: "fields_count",
            header: "Jumlah Lapangan",
            className: "text-center content-center w-32",
            render: (val, row) => {
                const { label, color } = getVenueFieldsCountBadge(
                    row.fields_count
                );
                return <Badge color={color}>{label}</Badge>;
            },
        },
        {
            key: "city",
            header: "Kota",
            render: (val, row) =>
                row.address && row.address.city ? row.address.city.name : "-",
            className: "text-center content-center w-36",
        },
        {
            key: "phone_number",
            header: "No Handphone",
            render: (val, row) => formatTo08(row.phone_number) || "-",
            className: "text-center content-center",
        },
        {
            key: "status",
            header: "Status",
            render: (val) => {
                const { label, color } = getVenueStatus(val);
                return <Badge color={color}>{label}</Badge>;
            },
            className: "text-center content-center",
        },
        {
            key: "created_at",
            header: "Tanggal Ditambahkan",
            render: (val, row) => formatFullDateTime(row.created_at) || "-",
            className: "text-center content-center w-36",
        },

        {
            key: "action",
            header: "Aksi",
            className: "text-center content-center",
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
                        variant="warning"
                        size="xs"
                        onClick={() => handleInfo(row)}
                    >
                        Validasi
                    </Button>
                    <Button
                        variant="info"
                        size="xs"
                        onClick={() => handleInfo(row)}
                    >
                        Info
                    </Button>
                </div>
            ),
        },
    ];

    const handleToggleActive = async (row) => {
        try {
            const newStatus = !row.is_active;

            router.patch(
                route("admin.venues.toggleActive", { venue: row.slug }),
                { is_active: newStatus },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        toast.success(
                            `Data Venue "${row.name}" berhasil ${
                                newStatus ? "diaktifkan" : "dinonaktifkan"
                            }.`
                        );
                    },
                    onError: () => {
                        toast.error(
                            `Gagal mengubah status Data Venue "${row.name}".`
                        );
                    },
                }
            );
        } catch (err) {
            toast.error("Terjadi kesalahan saat mengubah status.");
        }
    };

    const handleInfo = (row) => {
        router.get(route("admin.venues.show", { venue: row.slug }));
    };

    return (
        <AdminLayout>
            <Head title="Daftar Venue" />
            <Card className="flex flex-col h-full rounded-lg shadow-none dark:border-none">
                <CardHeader className="">
                    <div className="flex flex-row justify-between items-center p-4">
                        <div className="font-bold uppercase text-lg">
                            Daftar Data Venue
                        </div>
                        <Button
                            variant="primary"
                            size="xs"
                            onClick={() => handlePrint()}
                        >
                            Cetak Data
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
                                Tidak ada data Venue.{" "}
                            </div>
                        }
                    />
                    <Pagination
                        links={venues.links}
                        meta={venues}
                        className="p-6 my-2"
                    />
                </CardBody>

                <CardFooter className="my-8 p-8 flex justify-end gap-2"></CardFooter>
            </Card>
        </AdminLayout>
    );
}
