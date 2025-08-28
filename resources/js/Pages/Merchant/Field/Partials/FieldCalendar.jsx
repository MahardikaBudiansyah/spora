import { useState, useEffect, useCallback } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import axios from "axios";
import { toISODate } from "@/utils/date";
import useModal from "@/hooks/useModal";
import MerchantLayout from "@/Layouts/MerchantLayout";
import {
    Card,
    CardBody,
    CardFooter,
    CardHeader,
} from "@/components/common/Card";
import Button from "@/components/common/Button";
import TimeSlotButton from "@/components/common/TimeSlotButton";
import Calendar from "@/components/merchant/calendar/Calendar";
import TimeSlotModal from "@/Pages/Merchant/Field/Partials/TimeSlotModal";
import TimeSlotInfoModal from "@/Pages/Merchant/Field/Partials/TimeSlotInfoModal";
import TimeSlotStatusFormModal from "@/Pages/Merchant/Field/Partials/TimeSlotStatusFormModal";
import BannerAlert from "@/components/common/BannerAlert";
import { Info, X } from "lucide-react";
import { toast } from "react-toastify";

export default function FieldCalendar() {
    const { venue, field, slotStatusLabel } = usePage().props;

    const [showBanner, setShowBanner] = useState(true);
    const [selectedSlotInfo, setSelectedSlotInfo] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [timeslots, setTimeslots] = useState([]);
    const [loading, setLoading] = useState(false);
    const { isOpen, open, close } = useModal();

    const fetchTimeslots = useCallback(() => {
        if (!selectedDate) return;

        setLoading(true);
        const source = axios.CancelToken.source();

        axios
            .get(
                route("merchant.venues.fields.getTimeslotsByField", {
                    venue: venue.slug,
                    field: field.slug,
                }),
                {
                    params: { date: toISODate(selectedDate) },
                    cancelToken: source.token,
                }
            )
            .then((res) => setTimeslots(res.data.timeslots))
            .catch((err) => {
                if (!axios.isCancel(err)) {
                    toast.error(
                        "Gagal mengambil data slot jadwal. Silakan coba lagi."
                    );
                    console.error(err);
                }
            })
            .finally(() => setLoading(false));

        return () => source.cancel();
    }, [selectedDate, venue.slug, field.slug]);

    useEffect(() => {
        fetchTimeslots();
    }, [fetchTimeslots]);

    const handleSlotClick = useCallback(
        (slot) => {
            setSelectedSlotInfo(slot);
            open("info");
        },
        [open]
    );

    return (
        <MerchantLayout>
            <Head title="Kalender" />

            <Card className="flex flex-col h-full rounded-lg shadow-none dark:border-none">
                <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center p-4">
                        <div className="flex flex-col">
                            <div className="text-2xl font-bold">
                                Kalender "{field.name}"
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
                                variant="info"
                                size="xs"
                                onClick={() =>
                                    router.get(
                                        route("merchant.venues.fields.show", {
                                            venue: venue.slug,
                                            field: field.slug,
                                        })
                                    )
                                }
                            >
                                Info Lapangan
                            </Button>
                            <Button
                                variant="success"
                                size="xs"
                                onClick={() => open("timeslot")}
                            >
                                Tambah Jadwal
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                <CardBody>
                    {showBanner && (
                        <BannerAlert
                            type="info"
                            className="flex flex-row justify-between items-center mx-4"
                        >
                            <div className="flex items-center gap-2">
                                <Info className="w-6" />
                                Pilih tanggal pada kalender untuk membuka panel
                                slot jadwal dari{" "}
                                <span className="font-bold">
                                    "{field.name}"
                                </span>
                            </div>
                            <button onClick={() => setShowBanner(false)}>
                                <X className="w-4 h-4 cursor-pointer hover:text-blue-700" />
                            </button>
                        </BannerAlert>
                    )}

                    <div className="p-4 flex flex-col lg:flex-row gap-8">
                        <div className="w-full lg:w-1/2">
                            <Calendar
                                onDateSelect={(date) => setSelectedDate(date)}
                            />
                        </div>

                        {selectedDate && (
                            <div className="flex flex-col gap-4 w-full lg:w-1/2 text-xs">
                                <div className="text-sm font-bold">
                                    Slot Jam Lapangan :
                                </div>
                                <div className="text-center font-bold text-sm">
                                    {selectedDate.toLocaleDateString("id-ID", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </div>
                                <div className="flex flex-wrap justify-start gap-2">
                                    <Button
                                        variant="primary"
                                        size="xs"
                                        onClick={() =>
                                            router.get(
                                                route(
                                                    "merchant.venues.bookings.create",
                                                    { venue: venue.slug }
                                                )
                                            )
                                        }
                                    >
                                        Tambah Booking
                                    </Button>
                                    <Button
                                        variant="primary"
                                        size="xs"
                                        onClick={() => open("status")}
                                    >
                                        Perbarui Status Slot
                                    </Button>
                                </div>

                                {loading ? (
                                    <div className="text-center text-gray-500 my-4">
                                        Memuat data slot...
                                    </div>
                                ) : (
                                    <div className="my-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                                        {timeslots.map((slot) => (
                                            <TimeSlotButton
                                                key={slot.timeslot_id}
                                                slot={{
                                                    time: slot.name ?? "",
                                                    status: slot.status_label,
                                                    price: slot.price,
                                                }}
                                                selected={
                                                    selectedSlotInfo?.timeslot_id ===
                                                    slot.timeslot_id
                                                }
                                                onClick={() =>
                                                    handleSlotClick(slot)
                                                }
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </CardBody>

                <CardFooter className="p-8 flex justify-end gap-2">
                    <Button
                        variant="light"
                        type="button"
                        onClick={() =>
                            router.get(
                                route("merchant.venues.fields.index", {
                                    venue: venue.slug,
                                })
                            )
                        }
                    >
                        Kembali
                    </Button>
                </CardFooter>
            </Card>

            <TimeSlotModal show={isOpen("timeslot")} onClose={close} />
            <TimeSlotInfoModal
                show={isOpen("info")}
                onClose={close}
                slot={selectedSlotInfo}
            />
            <TimeSlotStatusFormModal
                isOpen={isOpen("status")}
                onClose={close}
                venue={venue}
                field={field}
                slotStatusLabel={slotStatusLabel}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                timeslots={timeslots}
                refreshTimeslots={fetchTimeslots} // ✅ prop refresh ditambahkan
            />
        </MerchantLayout>
    );
}
