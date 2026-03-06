import { Head, usePage, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
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
import { ArrowLeft, Calendar } from "lucide-react";
import CourtTimeSlotInfo from "@/Pages/Merchant/Venue/Courts/Partials/CourtTimeSlotInfo";

export default function Show() {
    const {
        venue,
        court: { data: courtData },
    } = usePage().props;

    return (
        <AdminLayout>
            <Head title={`Informasi - ${courtData?.name}`} />

            <Card className="flex flex-col h-full rounded-md shadow-none">
                <CardHeader className="p-4 md:p-6">
                    <div className="p-2 flex flex-col md:flex-row justify-between gap-6 md:items-center">
                        <div className="flex flex-col gap-1 justify-center text-center md:text-left">
                            <div className="flex flex-col md:flex-row md:gap-1 font-bold text-2xl items-center md:items-baseline">
                                <span>Informasi</span>
                                <span className="text-primary-600 dark:text-primary-500">
                                    {courtData.name}
                                </span>
                            </div>
                            <div className="text-xs text-secondary-600 dark:text-secondary-400">
                                <div>
                                    <span>Ditambahkan: </span>
                                    <span>
                                        {formatFullDate(courtData.created_at)}
                                    </span>
                                </div>
                                <div>
                                    <span>Terakhir diperbarui: </span>
                                    <span>
                                        {formatFullDate(courtData.updated_at)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-row gap-2">
                            <Button
                                variant="warning"
                                size="xs"
                                href={route("admin.venues.courts.calendar", {
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
                            <div className="flex flex-col gap-2 w-full lg:w-6/12">
                                <CourtInfo
                                    name={courtData.name}
                                    rating={Number(
                                        courtData.rating ?? 0
                                    ).toFixed(1)}
                                    description={courtData.description}
                                    court_surface={courtData.court_surface}
                                    categories={courtData.categories ?? []}
                                    showLabel={true}
                                />
                                <CourtTimeSlotInfo
                                    timeSlots={courtData.timeSlots}
                                />
                            </div>
                        </div>
                    </div>
                </CardBody>
                <CardFooter className="p-6 md:p-8 flex gap-2 justify-end">
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
                        className="flex gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Kembali</span>
                    </Button>
                </CardFooter>
            </Card>
        </AdminLayout>
    );
}
