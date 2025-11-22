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

import { formatTo08 } from "@/utils/numberPhone";
import { formatFullDateTime } from "@/utils/date";
import { getFieldType } from "@/utils/fieldTypeAttribute";

export default function Index() {
    const { fields = [] } = usePage().props;
    console.log(fields);

    const columns = [
        { key: "", header: "#", className: "text-center content-center" },
        {
            key: "name",
            header: "Nama Lapangan",
            className: "text-center content-center",
        },
        {
            key: "field_type_id",
            header: "Tipe Lapangan",
            render: (val) => {
                const { label, color } = getFieldType(val);
                return <Badge color={color}>{label}</Badge>;
            },
            className: "text-center content-center",
        },
        {
            key: "venue_name",
            header: "Venue",
            render: (val, row) => (row.venue ? row.venue.name : "-"),
            className: "text-center content-center",
        },
        {
            key: "merchant_name",
            header: "Mitra",
            render: (val, row) =>
                row.venue.merchant ? row.venue?.merchant?.name : "-",
            className: "text-center content-center",
        },
        {
            key: "created_at",
            header: "Tanggal Ditambahkan",
            render: (val, row) => formatFullDateTime(row.created_at) || "-",
            className: "text-center content-center w-42",
        },

        {
            key: "action",
            header: "Aksi",
            className: "text-center content-center",
            render: (val, row) => (
                <div className="flex gap-2 justify-center">
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

    const handleInfo = (row) => {
        router.get(
            route("admin.venues.fields.show", {
                venue: row.venue.slug,
                field: row.slug,
            })
        );
    };

    return (
        <AdminLayout>
            <Head title="Daftar Lapangan" />
            <Card className="flex flex-col h-full rounded-lg shadow-none dark:border-none">
                <CardHeader className="">
                    <div className="flex flex-row justify-between items-center p-4">
                        <div className="font-bold uppercase text-lg">
                            Daftar Data Lapangan
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
                        data={fields.data}
                        wrapperClassName="border-none rounded-none shadow-none"
                        tableClassName="text-xs"
                        emptyState={
                            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                                Tidak ada data Lapangan.
                            </div>
                        }
                    />
                    <Pagination
                        links={fields.links}
                        meta={fields}
                        className="p-6 my-2"
                    />
                </CardBody>

                <CardFooter className="my-8 p-8 flex justify-end gap-2"></CardFooter>
            </Card>
        </AdminLayout>
    );
}
