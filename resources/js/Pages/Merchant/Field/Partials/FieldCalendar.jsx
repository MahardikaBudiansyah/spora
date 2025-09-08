import { useState, useEffect, useCallback } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import axios from "axios";
import { toISODate, formatFullDate } from "@/utils/date";
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
import TimeSlotModal from "@/Pages/Merchant/Field/Partials/TimeSlotModal";
import TimeSlotInfoModal from "@/Pages/Merchant/Field/Partials/TimeSlotInfoModal";
import TimeSlotStatusFormModal from "@/Pages/Merchant/Field/Partials/TimeSlotStatusFormModal";
import BannerAlert from "@/components/common/BannerAlert";
import { toast } from "react-toastify";
import FieldCalendarPanel from "@/Pages/Merchant/Field/Partials/FieldCalendarPanel";

export default function FieldCalendar() {
    const { venue, field, slotStatusLabel } = usePage().props;

    const [showBanner, setShowBanner] = useState(true);
    const [selectedSlotInfo, setSelectedSlotInfo] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [timeslots, setTimeslots] = useState([]);
    const [calendarEvents, setCalendarEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const { isOpen, open, close } = useModal();

    // Fetch timeslots per tanggal
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

    // Fetch data kalender
    const fetchCalendarData = useCallback(
        (start, end, viewType = "month") => {
            const viewMap = {
                dayGridMonth: "month",
                timeGridWeek: "week",
                timeGridDay: "day",
            };
            const view = viewMap[viewType] || "month";

            const endpoint =
                view === "month"
                    ? route("merchant.venues.fields.getCalendarMonth", {
                          venue: venue.slug,
                          field: field.slug,
                      })
                    : route("merchant.venues.fields.getCalendarWeekDays", {
                          venue: venue.slug,
                          field: field.slug,
                      });

            axios
                .get(endpoint, {
                    params: { start, end },
                    headers: {
                        Accept: "application/json",
                        "X-Requested-With": "XMLHttpRequest",
                    },
                })
                .then((res) => {
                    let events = [];
                    if (view === "month") {
                        const summary = res.data.summary || [];
                        events = summary.map((day) => ({
                            title: "", // kosongkan, karena nanti kita custom pakai eventContent
                            start: day.date,
                            allDay: true,
                            extendedProps: {
                                booked: day.booked,
                                event: day.event,
                                maintenance: day.maintenance,
                                available: day.available,
                            },
                        }));
                    } else {
                        const slots = res.data.slots || [];
                        events = slots.map((slot) => ({
                            title: slot.status || "-",
                            start: slot.start,
                            end: slot.end,
                        }));
                    }

                    setCalendarEvents(events);
                })
                .catch((err) => {
                    console.error("Error fetchCalendarData:", err);
                });
        },
        [venue.slug, field.slug]
    );

    useEffect(() => {
        const cancel = fetchTimeslots();
        return cancel; // supaya cancel token bekerja
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

                <CardBody className="py-4 px-8">
                    {showBanner && (
                        <BannerAlert
                            type="info"
                            variant="subtle"
                            onClose={() => setShowBanner(false)}
                            closable
                        >
                            Pilih tanggal pada kalender untuk membuka panel slot
                            jadwal dari{" "}
                            <span className="font-bold">"{field.name}"</span>
                        </BannerAlert>
                    )}

                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex w-full lg:w-3/5">
                            <FieldCalendarPanel
                                events={calendarEvents} // ✅ kirim data ke child
                                onDateSelect={(date) =>
                                    setSelectedDate(
                                        date ? new Date(date) : null
                                    )
                                }
                                onRangeChange={(start, end, view) =>
                                    fetchCalendarData(start, end, view)
                                }
                            />
                        </div>

                        {selectedDate && (
                            <div className="flex flex-1 flex-col gap-4 w-full text-xs">
                                <div className="text-sm font-bold">
                                    Slot Jam Lapangan :{" "}
                                </div>{" "}
                                <div className="text-center font-bold text-sm">
                                    <div className="text-center font-bold text-sm">
                                        {formatFullDate(selectedDate) || "-"}
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
                                        Tambah Booking{" "}
                                    </Button>{" "}
                                    <Button
                                        variant="primary"
                                        size="xs"
                                        onClick={() => open("status")}
                                    >
                                        Perbarui Status Slot{" "}
                                    </Button>{" "}
                                </div>{" "}
                                {loading ? (
                                    <div className="text-center text-gray-500 my-4">
                                        Memuat data slot...{" "}
                                    </div>
                                ) : (
                                    <div className="my-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-3 gap-2">
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
                                        ))}{" "}
                                    </div>
                                )}{" "}
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
                refreshTimeslots={fetchTimeslots}
            />
        </MerchantLayout>
    );
}
