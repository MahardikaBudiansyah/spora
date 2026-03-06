import { useState, useEffect, useCallback } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import axios from "axios";
import { toISODate, formatFullDate, formatFullDateWithDay } from "@/utils/date";
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
import CourtTimeSlotModal from "@/Pages/Merchant/Venue/Courts/Partials/CourtTimeSlotModal";
import TimeSlotInfoModal from "@/Pages/Merchant/Venue/Courts/Partials/TimeSlotInfoModal";
import CourtScheduleFormModal from "@/Pages/Merchant/Venue/Courts/Partials/CourtScheduleFormModal";
import BannerAlert from "@/components/common/BannerAlert";
import { toast } from "react-toastify";
import CourtCalendarPanel from "@/Pages/Merchant/Venue/Courts/Partials/CourtCalendarPanel";
import { ArrowLeft } from "lucide-react";

export default function CourtCalendar() {
    const {
        venue,
        court: { data: courtData },
        statusType,
        timeSlots = [],
    } = usePage().props;

    const [showBanner, setShowBanner] = useState(true);
    const [selectedSlotInfo, setSelectedSlotInfo] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [timeslots, setTimeslots] = useState([]);
    const [calendarEvents, setCalendarEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const { isOpen, open, close } = useModal();

    const fetchTimeslots = useCallback(() => {
        if (!selectedDate) return;

        setSelectedSlotInfo(null);
        setLoading(true);
        const source = axios.CancelToken.source();

        axios
            .get(
                route("merchant.venues.courts.getTimeSlotsByCourt", {
                    venue: venue.slug,
                    court: courtData.slug,
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
    }, [selectedDate, venue.slug, courtData.slug]);

    const fetchCalendarData = useCallback(
        (start, end, viewType = "month") => {
            const viewMap = {
                dayGridMonth: "month",
                timeGridWeek: "week",
                timeGridDay: "day",
            };
            const view = viewMap[viewType] || "month";

            const endpoint = route("merchant.venues.courts.getCalendarData", {
                venue: venue.slug,
                court: courtData.slug,
            });

            axios
                .get(endpoint, {
                    params: { start, end, view },
                    headers: {
                        Accept: "application/json",
                        "X-Requested-With": "XMLHttpRequest",
                    },
                })
                .then((res) => {
                    let events = [];
                    if (res.data.view === "month") {
                        const summary = res.data.summary || [];
                        events = summary.map((day) => ({
                            id: day.date,
                            title: `${day.available} Slot Kosong`,
                            start: day.date,
                            allDay: true,
                            backgroundColor:
                                day.available === 0 ? "#fee2e2" : "#f0fdf4",
                            textColor:
                                day.available === 0 ? "#991b1b" : "#166534",
                            extendedProps: { ...day },
                        }));
                    } else {
                        const slots = res.data.slots || [];
                        events = slots.map((slot) => ({
                            title: slot.status || "-",
                            start: slot.start,
                            end: slot.end,
                            extendedProps: { ...slot },
                        }));
                    }

                    setCalendarEvents(events);
                })
                .catch((err) => {
                    console.error("Error fetchCalendarData:", err);
                });
        },
        [venue.slug, courtData.slug]
    );

    useEffect(() => {
        const cancel = fetchTimeslots();
        return cancel;
    }, [fetchTimeslots]);

    const handleSlotClick = useCallback(
        (slot) => {
            setSelectedSlotInfo(slot);
            open("info");
        },
        [open]
    );

    const handleDateSelect = useCallback((date) => {
        setSelectedDate(date ? new Date(date) : null);
    }, []);

    const handleRangeChange = useCallback(
        (start, end, view) => {
            fetchCalendarData(start, end, view);
        },
        [fetchCalendarData]
    );

    return (
        <MerchantLayout>
            <Head title={`Kalender ${courtData?.name || "Lapangan"}`} />

            <Card className="flex flex-col h-full rounded-md shadow-none">
                <CardHeader className="p-4 md:p-6">
                    <div className="p-2 flex flex-col md:flex-row justify-between gap-6 md:items-center">
                        <div className="flex flex-col gap-1 justify-center text-center md:text-left">
                            <div className="flex flex-col md:flex-row md:gap-1 font-bold text-2xl">
                                <span>Kalender </span>
                                <span>"{courtData.name}"</span>
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
                        <div className="flex flex-wrap gap-2">
                            <Button
                                variant="info"
                                size="xs"
                                href={route("merchant.venues.courts.show", {
                                    venue: venue.slug,
                                    court: courtData.slug,
                                })}
                            >
                                Info
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
                <CardBody className="p-4 md:p-6  min-h-[280px] sm:min-h-[310px] flex flex-col">
                    <div className="p-2 flex-1 overflow-x-auto">
                        {showBanner && (
                            <BannerAlert
                                type="info"
                                variant="subtle"
                                onClose={() => setShowBanner(false)}
                                closable
                            >
                                Pilih tanggal pada kalender untuk membuka panel
                                slot jadwal dari{" "}
                                <span className="font-bold">
                                    "{courtData.name}"
                                </span>
                            </BannerAlert>
                        )}

                        <div className="flex flex-col lg:flex-row gap-8">
                            <div className="flex w-full lg:w-1/2">
                                <CourtCalendarPanel
                                    events={calendarEvents}
                                    onDateSelect={handleDateSelect}
                                    onRangeChange={handleRangeChange}
                                />
                            </div>

                            {selectedDate && (
                                <div className="flex flex-1 flex-col gap-4 w-full text-xs">
                                    <div className="text-center font-bold text-sm">
                                        <div className="text-center font-bold text-xl">
                                            {formatFullDateWithDay(
                                                selectedDate
                                            ) || "-"}
                                        </div>
                                    </div>{" "}
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
                                        </Button>{" "}
                                        <Button
                                            variant="primary"
                                            size="xs"
                                            onClick={() => open("status")}
                                        >
                                            Perbarui Status Slot
                                        </Button>{" "}
                                    </div>{" "}
                                    {loading ? (
                                        <div className="text-center text-gray-500 my-4">
                                            Memuat data slot...{" "}
                                        </div>
                                    ) : (
                                        <div className="my-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-2">
                                            {timeslots.map((slot) => (
                                                <TimeSlotButton
                                                    key={slot.timeslot_id}
                                                    slot={{
                                                        start_time:
                                                            slot.start_time,
                                                        end_time: slot.end_time,
                                                        status:
                                                            slot.status_label ||
                                                            slot.status,
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
                                            ))}{" "}
                                        </div>
                                    )}{" "}
                                </div>
                            )}
                        </div>
                    </div>
                </CardBody>

                <CardFooter className="p-6 md:p-8 flex gap-2 justify-end">
                    <Button
                        variant="light"
                        type="button"
                        onClick={() =>
                            router.get(
                                route("merchant.venues.courts.index", {
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

            <CourtTimeSlotModal
                show={isOpen("timeslot")}
                onClose={close}
                venue={venue}
                court={courtData}
                timeSlots={timeSlots}
            />
            <TimeSlotInfoModal
                show={isOpen("info")}
                onClose={close}
                slot={selectedSlotInfo}
            />
            <CourtScheduleFormModal
                isOpen={isOpen("status")}
                onClose={close}
                venue={venue}
                court={courtData}
                statusType={statusType}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                timeslots={timeslots}
                refreshTimeslots={fetchTimeslots}
            />
        </MerchantLayout>
    );
}
