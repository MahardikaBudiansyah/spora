import { useState } from "react";
import { Head, usePage, router, Link } from "@inertiajs/react";
import { toast } from "react-toastify";
import MerchantLayout from "@/Layouts/MerchantLayout";
import Pagination from "@/components/common/Pagination";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
} from "@/components/Common/Card";
import Table from "@/components/Common/Table";
import Button from "@/components/Common/Button";

export default function Index() {
    const { bookings, venue } = usePage().props;

    const columns = [
        { key: "number", header: "#", className: "text-center" },
        { key: "order_no", header: "Nomor Pesanan" },
        { key: "name", header: "Nama Penyewa", className: "text-center" },
        {
            key: "phone_number",
            header: "Nomor Penyewa",
            className: "text-center",
        },
        {
            key: "status",
            header: "Status Pesanan",
            className: "text-center",
        },
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
                    {/* <Button
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
                    </Button> */}
                </div>
            ),
        },
    ];

    const handleInfo = (row) => {
        router.get(
            route("merchant.venues.bookings.show", {
                venue: venue.slug,
                booking: row.slug,
            })
        );
    };

    return (
        <MerchantLayout>
            <Head title="Pesanan" />
            <Card className="flex flex-col h-full min-h-screen rounded-lg shadow-none dark:border-none">
                <CardHeader>
                    <div className="flex flex-row justify-between items-center p-4">
                        <div className="font-bold">Booking Lapangan</div>
                        <Button
                            variant="primary"
                            size="xs"
                            onClick={() =>
                                router.get(
                                    route("merchant.venues.bookings.create", {
                                        venue: venue.slug,
                                    })
                                )
                            }
                        >
                            + Buat Pesanan
                        </Button>
                    </div>
                </CardHeader>
                <CardBody className="px-0">
                    <div>
                        <Table
                            columns={columns}
                            data={bookings.data}
                            wrapperClassName="border-none rounded-none shadow-none"
                            tableClassName="text-xs"
                            emptyState={
                                <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                                    Tidak ada data.{" "}
                                    <Link
                                        href={route(
                                            "merchant.venues.bookings.create",
                                            {
                                                venue: venue.slug,
                                            }
                                        )}
                                        className="text-gray-900 hover:underline dark:text-primary-400 font-semibold"
                                    >
                                        Booking sekarang!
                                    </Link>
                                </div>
                            }
                        />
                        <Pagination
                            links={bookings.links}
                            meta={bookings}
                            className="p-6 my-2"
                        />
                    </div>
                </CardBody>
                <CardFooter className="p-8 flex justify-end gap-2">
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
