import { useState, useMemo, useEffect } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import { DateTime } from "luxon";
import axios from "axios";

import MerchantLayout from "@/Layouts/MerchantLayout";
import FilterCalendar from "@/Pages/Merchant/Operator/Partials/FilterCalendar";
import CalendarPanel from "@/Pages/Merchant/Operator/Partials/CalendarPanel";
import AssignmentList from "@/Pages/Merchant/Operator/Partials/AssignmentList";
import EditAssignmentModal from "@/Pages/Merchant/Operator/Partials/EditAssignmentModal";
import CreateAssignmentModal from "@/Pages/Merchant/Operator/Partials/CreateAssignmentModal";

import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
} from "@/components/Common/Card";
import Button from "@/components/Common/Button";
import { toISODate } from "@/utils/date";
import { toast } from "react-toastify";

export default function Index() {
    const { staff, venues, shifts, assignments } = usePage().props;

    // === HELPER: MAP ASSIGNMENT -> EVENT ===
    const mapAssignmentToEvent = (a) => {
        const shift = shifts.find((s) => s.id === Number(a.shift_id));
        const venueId = a.venue?.id || null;
        const venueObj = venues.find((v) => v.id === venueId);

        let start = DateTime.fromISO(a.date).set({
            hour: shift?.startHour ?? 0,
        });
        let end = DateTime.fromISO(a.date).set({
            hour: shift?.endHour ?? 0,
        });
        if (end < start) end = end.plus({ days: 1 });

        return {
            id: a.id,
            shiftId: a.shift_id,
            venueId,
            venueName: `${venueObj?.name ?? "Unknown"} - ${shift?.name ?? "-"}`,
            start,
            end,
        };
    };

    // === INITIAL EVENTS ===
    const initialEvents = assignments.map(mapAssignmentToEvent);

    // === STATE ===
    const [events, setEvents] = useState(initialEvents);
    const [selectedVenues, setSelectedVenues] = useState(
        venues.map((v) => Number(v.id))
    );
    useEffect(() => {
        setEvents(initialEvents);
    }, [assignments]);

    const [showModal, setShowModal] = useState(false);
    const [modalSlot, setModalSlot] = useState(null);
    const [modalVenueId, setModalVenueId] = useState(venues[0]?.id || null);
    const [editingEventId, setEditingEventId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);

    // === VENUE COLOR MAPS ===
    const venueColorMaps = useMemo(() => {
        const bgClasses = [
            "bg-indigo-600 dark:bg-indigo-400",
            "bg-emerald-500 dark:bg-emerald-400",
            "bg-amber-500 dark:bg-amber-400",
            "bg-red-500 dark:bg-red-400",
            "bg-violet-500 dark:bg-violet-400",
        ];

        const borderClasses = [
            "border-l-indigo-600 dark:border-l-indigo-400",
            "border-l-emerald-500 dark:border-l-emerald-400",
            "border-l-amber-500 dark:border-l-amber-400",
            "border-l-red-500 dark:border-l-red-400",
            "border-l-violet-500 dark:border-l-violet-400",
        ];

        return venues.reduce(
            (acc, v, i) => {
                acc.bg[v.id] = bgClasses[i % bgClasses.length];
                acc.border[v.id] = borderClasses[i % borderClasses.length];
                return acc;
            },
            { bg: {}, border: {} }
        );
    }, [venues]);

    // === FILTERED EVENTS ===
    const filteredEvents = useMemo(() => {
        return events.filter((ev) => selectedVenues.includes(ev.venueId));
    }, [events, selectedVenues]);

    // === HANDLERS ===
    const toggleVenue = (id) => {
        setSelectedVenues((prev) =>
            prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
        );
    };

    const handleSelectSlot = ({ start, end, resourceId }) => {
        const startDT = DateTime.isDateTime(start)
            ? start
            : DateTime.fromJSDate(start);
        const endDT = DateTime.isDateTime(end) ? end : DateTime.fromJSDate(end);

        setModalSlot({ start: startDT, end: endDT });
        setEditingEventId(null);
        setModalVenueId(
            resourceId || selectedVenues[0] || venues[0]?.id || null
        );
        setShowModal(true);
    };

    // === CREATE EVENT ===
    const handleAddEvent = async (slot, venueId, shiftId) => {
        if (!slot || !venueId || !shiftId) return;

        let dates = [];
        if (Array.isArray(slot)) {
            dates = slot;
        } else if (slot.start && slot.end) {
            let current = new Date(slot.start);
            while (current <= slot.end) {
                dates.push(new Date(current));
                current.setDate(current.getDate() + 1);
            }
        } else if (slot.start) {
            dates = [slot.start];
        } else {
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post(
                route("merchant.staff.operator.store", { staff: staff.slug }),
                {
                    venue_id: venueId,
                    shift_id: shiftId,
                    dates: dates.map((d) => toISODate(d)),
                }
            );

            const newEvents =
                response.data.assignments.map(mapAssignmentToEvent);

            setEvents((prev) => [...prev, ...newEvents]);

            if (response.data.failed_dates?.length) {
                const failed = response.data.failed_dates;
                const msg =
                    failed.length > 5
                        ? `${failed.slice(0, 5).join(", ")} dan ${
                              failed.length - 5
                          } lainnya`
                        : failed.join(", ");
                toast.warn(`Beberapa tanggal gagal disimpan: ${msg}`);
            } else {
                toast.success("Penugasan berhasil disimpan");
                setShowModal(false);
            }
        } catch (error) {
            console.error(error);
            toast.error("Gagal menyimpan penugasan");
        } finally {
            setIsLoading(false);
        }
    };

    // === UPDATE EVENT ===
    const handleUpdateEvent = async ({ id, date, venueId, shiftId }) => {
        if (!id || !date || !venueId || !shiftId) return;

        setIsLoading(true);
        try {
            const response = await axios.put(
                route("merchant.staff.operator.update", {
                    staff: staff.slug,
                    assignment: id,
                }),
                {
                    venue_id: venueId,
                    shift_id: shiftId,
                    date: toISODate(date),
                }
            );

            const updated = mapAssignmentToEvent(response.data.assignment);

            setEvents((prev) =>
                prev.map((ev) => (ev.id === id ? updated : ev))
            );

            // 🔑 update juga editingEvent biar modal tidak pegang versi lama
            setEditingEvent(updated);

            toast.success("Penugasan berhasil diperbarui");

            // 🔑 tutup modal setelah update
            setShowModal(false);
            setEditingEvent(null);
            setEditingEventId(null);
        } catch (error) {
            console.error(error);
            toast.error("Gagal memperbarui penugasan");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteEvent = async (id) => {
        try {
            await axios.delete(
                route("merchant.staff.operator.destroy", {
                    staff: staff.slug,
                    assignment: id,
                })
            );
            setEvents((prev) => prev.filter((ev) => ev.id !== id));
            toast.success("Penugasan berhasil dihapus");
        } catch (error) {
            console.error(error);
            toast.error("Gagal menghapus penugasan");
        }
    };

    const handleEditEvent = (ev) => {
        setEditingEvent(ev);
        setEditingEventId(ev.id);
        setShowModal(true);
    };

    const handleEventUpdate = ({ event, start, end }) => {
        setEvents((prev) =>
            prev.map((ev) =>
                ev.id === event.id
                    ? {
                          ...ev,
                          start: DateTime.fromJSDate(start),
                          end: DateTime.fromJSDate(end),
                      }
                    : ev
            )
        );
    };

    // === RENDER ===
    return (
        <MerchantLayout>
            <Head title="Penugasan Operator" />

            <Card className="min-h-screen flex flex-col gap-4">
                <CardHeader>
                    <div className="flex justify-between items-center p-4">
                        <div className="font-bold text-xl">
                            Penugasan Operator: {staff.name}
                        </div>
                        <Button
                            variant="primary"
                            size="xs"
                            onClick={() => {
                                setModalSlot({
                                    start: DateTime.now().startOf("day"),
                                    end: DateTime.now().startOf("day"),
                                });
                                setEditingEventId(null);
                                setModalVenueId(
                                    selectedVenues[0] || venues[0]?.id || null
                                );
                                setShowModal(true);
                            }}
                        >
                            Tambah Penugasan
                        </Button>
                    </div>
                </CardHeader>

                <CardBody className="flex flex-row gap-4 px-4">
                    <CalendarPanel
                        events={filteredEvents}
                        onSelectSlot={handleSelectSlot}
                        onEventDrop={handleEventUpdate}
                        onEventResize={handleEventUpdate}
                        onEventClick={handleEditEvent}
                        venueColors={venueColorMaps.bg}
                        venues={venues}
                        shifts={shifts}
                    />

                    <div className="flex flex-col gap-4">
                        <FilterCalendar
                            venues={venues}
                            selectedVenues={selectedVenues}
                            onToggleVenue={toggleVenue}
                            venueColors={venueColorMaps.bg}
                        />

                        <AssignmentList
                            events={filteredEvents}
                            staff={staff}
                            venues={venues}
                            shifts={shifts}
                            venueColors={venueColorMaps.border}
                            onEditEvent={handleEditEvent}
                            onDeleteEvent={handleDeleteEvent}
                        />
                    </div>
                </CardBody>

                <CardFooter className="p-8 flex justify-end gap-2">
                    <Button
                        variant="light"
                        onClick={() =>
                            router.get(route("merchant.staff.index"))
                        }
                    >
                        Kembali ke Staf
                    </Button>
                </CardFooter>
            </Card>

            {editingEventId ? (
                <EditAssignmentModal
                    key={editingEvent?.id}
                    show={showModal}
                    onClose={() => {
                        setShowModal(false);
                        setEditingEvent(null);
                        setEditingEventId(null);
                    }}
                    venues={venues}
                    shifts={shifts}
                    event={editingEvent}
                    onSave={handleUpdateEvent}
                    isLoading={isLoading}
                />
            ) : (
                <CreateAssignmentModal
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    venues={venues}
                    shifts={shifts}
                    defaultVenueId={modalVenueId}
                    defaultSlot={modalSlot}
                    onSave={handleAddEvent}
                    isLoading={isLoading}
                />
            )}
        </MerchantLayout>
    );
}
