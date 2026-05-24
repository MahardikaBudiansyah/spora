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
import CourtInfo from "@/components/Courts/CourtInfo";
import { formatFullDate } from "@/utils/date";
import { ArrowLeft, Calendar, Edit } from "lucide-react";
import CourtTimeSlotDisplay from "@/components/Courts/CourtTimeSlotDisplay";

export default function Show() {
    const {
        venue,
        court: { data: courtData },
    } = usePage().props;

    return (
        <MerchantLayout>
            <Head title={`Detail ${courtData?.name}`} />

            <Card className="flex flex-col h-full rounded-md shadow-none">
                <CardHeader className="p-4 md:p-6">
                    <div className="p-2 flex flex-col md:flex-row justify-between gap-6 md:items-center">
                        <div className="flex flex-col gap-1 justify-center text-center md:text-left">
                            <div className="flex flex-col md:flex-row md:gap-1 font-bold text-2xl items-center md:items-baseline">
                                <span>Detail</span>
                                <span className="text-primary-600 dark:text-primary-500">
                                    {courtData.name}
                                </span>
                            </div>
                            <div className="text-xs text-secondary-500 dark:text-secondary-400 font-medium">
                                <div>
                                    <span>Ditambahkan: </span>
                                    <span className="font-bold">
                                        {formatFullDate(courtData.created_at)}
                                    </span>
                                </div>
                                <div>
                                    <span>Terakhir diperbarui: </span>
                                    <span className="font-bold">
                                        {formatFullDate(courtData.updated_at)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-row gap-2">
                            <Button
                                variant="success"
                                size="xs"
                                href={route("merchant.venues.courts.edit", {
                                    venue: venue.slug,
                                    court: courtData.slug,
                                })}
                                className="flex items-center w-auto gap-1.5 px-3 min-w-max"
                            >
                                <Edit className="w-4 h-4" />
                                <span>Edit</span>
                            </Button>
                            <Button
                                variant="warning"
                                size="xs"
                                href={route("merchant.venues.courts.calendar", {
                                    venue: venue.slug,
                                    court: courtData.slug,
                                })}
                                className="flex items-center w-auto gap-1.5 px-3 min-w-max"
                            >
                                <Calendar className="w-4 h-4" />
                                <span>Kalender</span>
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                <CardBody className="p-4 md:p-6  min-h-[280px] sm:min-h-[310px] flex flex-col">
                    <div className="p-2 flex-1 overflow-x-auto">
                        <div className="flex flex-col lg:flex-row gap-8">
                            <GalleryImage
                                images={courtData.images}
                                pathKey="url"
                            />
                            <div className="flex flex-col gap-6 w-full lg:w-6/12">
                                <CourtInfo
                                    name={courtData.name}
                                    court_surface={courtData.court_surface}
                                    // rating={Number(
                                    //     courtData.rating ?? 0,
                                    // ).toFixed(1)}
                                    description={courtData.description}
                                    showLabel={true}
                                />

                                <CourtTimeSlotDisplay
                                    timeSlots={courtData.timeSlots}
                                    showLabel={true}
                                />
                            </div>
                            <div></div>
                        </div>
                    </div>
                </CardBody>
                <CardFooter className="p-6 md:p-8 flex gap-2 justify-end">
                    <Button
                        variant="light"
                        size="xs"
                        onClick={() =>
                            router.get(
                                route("merchant.venues.courts.index", {
                                    venue: venue.slug,
                                }),
                            )
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
