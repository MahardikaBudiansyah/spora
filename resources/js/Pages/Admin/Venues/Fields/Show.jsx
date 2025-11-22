import { Head, usePage, router } from "@inertiajs/react";

import AdminLayout from "@/Layouts/AdminLayout";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
} from "@/components/Common/Card";
import Button from "@/components/common/Button";
import FieldInfo from "@/components/field/FieldInfo";
import FieldGalleryImage from "@/components/field/FieldGalleryImage";

export default function Show() {
    const { venue, field } = usePage().props;

    return (
        <AdminLayout>
            <Head title="Informasi Lapangan" />

            <Card className="flex flex-col h-full rounded-lg shadow-none dark:border-none">
                <CardHeader>
                    <div className="flex flex-row justify-between items-center p-4">
                        <div className="flex flex-col">
                            <div className="text-2xl font-bold">
                                Informasi "{field.name}" Venue "{venue.name}""
                            </div>
                            <div className="text-xs">
                                <span>Ditambahkan: </span>
                                <span>{field.created_at}</span>
                            </div>
                            <div className="text-xs">
                                <span>Terakhir diperbarui: </span>
                                <span>{field.updated_at}</span>
                            </div>
                        </div>
                        <div className="flex flex-row gap-2">
                            <Button
                                variant="warning"
                                size="xs"
                                onClick={() =>
                                    router.get(
                                        route("admin.venues.fields.calendar", {
                                            venue: venue.slug,
                                            field: field.slug,
                                        })
                                    )
                                }
                            >
                                Kalender
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                <CardBody>
                    <div>
                        <div className="flex flex-col lg:flex-row gap-8 p-4">
                            <FieldGalleryImage images={field.images} />
                            <div className="flex flex-col gap-2 w-full lg:w-6/12">
                                <FieldInfo
                                    name={field.name}
                                    field_type={field.field_type}
                                    rating="4.8"
                                    description={field.description}
                                />
                            </div>
                        </div>
                    </div>
                </CardBody>
                <CardFooter className="p-8 flex justify-end gap-2">
                    <Button
                        variant="light"
                        type="button"
                        onClick={() =>
                            router.get(
                                route("admin.venues.show", {
                                    venue: venue.slug,
                                })
                            )
                        }
                    >
                        Kembali
                    </Button>
                </CardFooter>
            </Card>
        </AdminLayout>
    );
}
