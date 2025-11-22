import { Head, usePage, router } from "@inertiajs/react";
import MerchantLayout from "@/Layouts/MerchantLayout";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
} from "@/components/Common/Card";
import Button from "@/components/common/Button";
import VenueInfo from "@/components/venue/VenueInfo";
import VenueGalleryImage from "@/components/venue/VenueGalleryImage";
import VenueFacility from "@/components/venue/VenueFacility";
import VenueAddress from "@/components/venue/VenueAddress";
import VenueFieldList from "@/components/venue/VenueFieldList";

export default function Show() {
    const { venue } = usePage().props;

    return (
        <MerchantLayout>
            <Head title="Informasi Venue" />

            <Card className="flex flex-col h-full rounded-lg shadow-none dark:border-none">
                <CardHeader>
                    <div className="flex flex-row justify-between items-center p-4">
                        <div className="flex flex-col">
                            <div className="text-2xl font-bold">
                                Informasi Venue {venue.name}
                            </div>
                            <div className="text-xs">
                                <span>Ditambahkan: </span>
                                <span>{venue.created_at}</span>
                            </div>
                            <div className="text-xs">
                                <span>Terakhir diperbarui: </span>
                                <span>{venue.updated_at}</span>
                            </div>
                        </div>
                        <Button
                            variant="success"
                            size="xs"
                            onClick={() =>
                                router.get(
                                    `/merchant/venues/${venue.slug}/edit`
                                )
                            }
                        >
                            Edit Venue
                        </Button>
                    </div>
                </CardHeader>

                <CardBody>
                    <div>
                        <div className="flex flex-col lg:flex-row gap-8 p-4">
                            <VenueGalleryImage images={venue.images} />
                            <div className="flex flex-col gap-2 w-full lg:w-6/12">
                                <VenueInfo
                                    name={venue.name}
                                    rating="4.8"
                                    description={venue.description}
                                    phone_number={venue.phone_number}
                                />
                                {venue.address?.length > 0 && (
                                    <VenueAddress address={venue.address} />
                                )}
                                <div className="flex flex-col gap-2">
                                    <span className="text-lg font-bold">
                                        Fasilitas:
                                    </span>
                                    <VenueFacility
                                        facilities={venue.facilities}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col py-4 px-4 pb-8">
                            <div className="py-4 flex flex-col lg:flex-row justify-between gap-2 items-start lg:items-center">
                                <div className="text-lg font-bold">
                                    Lapangan:
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="warning"
                                        size="xs"
                                        onClick={() =>
                                            router.get(
                                                route(
                                                    "merchant.venues.fields.index",
                                                    {
                                                        venue: venue.slug,
                                                    }
                                                )
                                            )
                                        }
                                    >
                                        Lapangan
                                    </Button>
                                    <Button
                                        variant="primary"
                                        size="xs"
                                        onClick={() =>
                                            router.get(
                                                route(
                                                    "merchant.venues.fields.create",
                                                    { venue: venue.slug }
                                                )
                                            )
                                        }
                                    >
                                        + Lapangan Baru
                                    </Button>
                                </div>
                            </div>
                            <VenueFieldList
                                fields={venue.fields}
                                venue={venue}
                            />
                        </div>
                    </div>
                </CardBody>
                <CardFooter className="p-8 flex justify-end gap-2">
                    <Button
                        variant="light"
                        type="button"
                        onClick={() => router.get("/merchant/venues")}
                    >
                        Kembali
                    </Button>
                </CardFooter>
            </Card>
        </MerchantLayout>
    );
}
