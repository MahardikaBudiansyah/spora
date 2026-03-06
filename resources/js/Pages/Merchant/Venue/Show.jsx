import { useState } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import MerchantLayout from "@/Layouts/MerchantLayout";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
} from "@/components/Common/Card";
import Button from "@/components/common/Button";
import GalleryImage from "@/components/Common/GalleryImage";
import VenueInfo from "@/components/Venues/VenueInfo";
import VenueFacility from "@/components/Venues/VenueFacility";
import VenueAddress from "@/components/Venues/VenueAddress";
import VenueCourtList from "@/components/Venues/VenueCourtList";
import { formatFullDate } from "@/utils/date";
import {
    ArrowLeft,
    Edit,
    Plus,
    RectangleEllipsis,
    Settings,
} from "lucide-react";
import VenuePaymentInfo from "@/components/Venues/VenuePaymentInfo";
import VenueMembershipPackage from "@/features/venues/components/VenueMembershipPackage";

export default function Show() {
    const { venue: venueResource } = usePage().props;
    const venue = venueResource.data;

    if (!venue) return null;

    const [expandedPackageIds, setExpandedPackageIds] = useState({});

    const handleTogglePackage = (packageId) => {
        setExpandedPackageIds((prev) => ({
            ...prev,
            [packageId]: !prev[packageId],
        }));
    };

    return (
        <MerchantLayout>
            <Head title={`Detail Venue - ${venue?.name}`} />

            <Card className="flex flex-col h-full rounded-md shadow-none">
                <CardHeader className="p-4 md:p-6">
                    <div className="p-2 flex flex-col md:flex-row justify-between gap-6 md:items-center">
                        <div className="flex flex-col md:gap-1 md:text-left">
                            <div className="flex flex-wrap flex-row md:flex-row gap-2 font-bold text-2xl items-center ">
                                <span>Detail Venue</span>
                                <span className="text-primary-600 dark:text-primary-500">
                                    {venue.name}
                                </span>
                            </div>
                            <div className="text-xs text-secondary-600 dark:text-secondary-400">
                                <div>
                                    <span>Ditambahkan: </span>
                                    <span>
                                        {formatFullDate(venue.created_at)}
                                    </span>
                                </div>
                                <div>
                                    <span>Terakhir diperbarui: </span>
                                    <span>
                                        {formatFullDate(venue.updated_at)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="success"
                                size="xs"
                                href={route("merchant.venues.edit", {
                                    venue: venue.slug,
                                })}
                                className="flex items-center w-auto gap-1.5 px-3 min-w-max"
                            >
                                <Edit className="w-4 h-4" />
                                <span>Edit</span>
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                <CardBody className="p-4 md:p-6  min-h-[280px] sm:min-h-[310px] flex flex-col">
                    <div className="p-2 flex-1 overflow-x-auto">
                        <div className="flex flex-col lg:flex-row gap-8">
                            <GalleryImage images={venue.images} pathKey="url" />
                            <div className="flex flex-col gap-2 w-full lg:w-6/12">
                                <VenueInfo
                                    mode="merchant"
                                    showLabel={true}
                                    name={venue.name}
                                    rating={Number(venue.rating ?? 0).toFixed(
                                        1,
                                    )}
                                    description={venue.description}
                                    phone_number={venue.phone_number}
                                    address={venue.address}
                                    categories={venue.venue_categories ?? []}
                                    social_media={venue.social_media}
                                />
                                {venue.address && (
                                    <VenueAddress
                                        showLabel={true}
                                        address={venue.address}
                                    />
                                )}

                                {venue.payment_type && (
                                    <VenuePaymentInfo
                                        paymentType={venue.payment_type}
                                        venueSlug={venue.slug} // Tambahkan ini agar komponen tahu venue mana yang diatur
                                    />
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col gap-4 py-4">
                            {venue.facilities?.length > 0 && (
                                <VenueFacility
                                    showLabel={true}
                                    facilities={venue.facilities}
                                />
                            )}

                            {venue.membership_packages?.length > 0 && (
                                <VenueMembershipPackage
                                    packages={venue.membership_packages}
                                    mode="merchant-show"
                                    showLabel={true}
                                    showSettings={true}
                                    expandedPackageIds={expandedPackageIds}
                                    onTogglePackage={handleTogglePackage}
                                />
                            )}

                            <div className="flex flex-col">
                                <div className="py-4 flex flex-col lg:flex-row justify-between gap-2 items-start lg:items-center">
                                    <div className="flex items-center justify-between ">
                                        <h3 className="text-lg font-bold flex items-center gap-2 ">
                                            <div className="w-1.5 h-6 bg-primary-500 rounded-full"></div>
                                            Daftar Court
                                        </h3>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="warning"
                                            size="xs"
                                            href={route(
                                                "merchant.venues.courts.index",
                                                {
                                                    venue: venue.slug,
                                                },
                                            )}
                                            className="flex items-center w-auto gap-1.5 px-3 min-w-max"
                                        >
                                            <RectangleEllipsis className="w-4 h-4" />
                                            <span className="">Lapangan</span>
                                        </Button>
                                        <Button
                                            variant="primary"
                                            size="xs"
                                            href={route(
                                                "merchant.venues.courts.create",
                                                { venue: venue.slug },
                                            )}
                                            className="flex items-center w-auto gap-1.5 px-3 min-w-max"
                                        >
                                            <Plus className="w-4 h-4 md:h-3" />
                                            <span className="">
                                                Lapangan Baru
                                            </span>
                                        </Button>
                                    </div>
                                </div>
                                <VenueCourtList
                                    courts={venue.courts}
                                    venue={venue}
                                />
                            </div>
                        </div>
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
        </MerchantLayout>
    );
}
