import { useState, useMemo } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import { DateTime } from "luxon";
import { luxonLocalizer } from "react-big-calendar";

import MerchantLayout from "@/Layouts/MerchantLayout";
import Toolbar from "@/components/merchant/calendar/Toolbar";
import CustomDateHeader from "@/components/merchant/calendar/CustomDateHeader";
import DateCellWrapper from "@/components/merchant/calendar/DateCellWrapper";

import SidebarVenueFilter from "@/Pages/Merchant/Operator/Partials/SidebarVenueFilter";
import CalendarPanel from "@/Pages/Merchant/Operator/Partials/CalendarPanel";
import AssignmentList from "@/Pages/Merchant/Operator/Partials/AssignmentList";
import AssignmentModal from "@/Pages/Merchant/Operator/Partials/AssignmentModal";

import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
} from "@/components/Common/Card";
import Button from "@/components/Common/Button";

const localizer = luxonLocalizer(DateTime);

export default function Index() {
    const { staff, venue } = usePage().props;

    const [events, setEvents] = useState([]);
    const [selectedVenues, setSelectedVenues] = useState(
        venue.map((v) => v.id)
    );
    const [showModal, setShowModal] = useState(false);
    const [modalSlot, setModalSlot] = useState(null);
    const [modalVenueId, setModalVenueId] = useState(venue[0]?.id || null);
    const [editingEventId, setEditingEventId] = useState(null);
    const [initialIsRange, setInitialIsRange] = useState(false); // new

    const venueColors = useMemo(() => {
        const colors = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];
        const map = {};
        venue.forEach((v, i) => (map[v.id] = colors[i % colors.length]));
        return map;
    }, [venue]);

    const filteredEvents = useMemo(
        () => events.filter((ev) => selectedVenues.includes(ev.venueId)),
        [events, selectedVenues]
    );

    const toggleVenue = (id) => {
        setSelectedVenues((prev) =>
            prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
        );
    };

    const handleSelectSlot = ({ start, end }) => {
        const startDate = DateTime.fromJSDate(start);
        const endDate = DateTime.fromJSDate(end);

        // jika start === end → single, jika beda → range
        const isRangeSelection = startDate.hasSame(endDate, "day")
            ? false
            : true;

        setModalSlot({ start: startDate, end: endDate });
        setInitialIsRange(isRangeSelection); // kirim ke modal
        setEditingEventId(null);
        setModalVenueId(venue[0]?.id || null);
        setShowModal(true);
    };

    const handleAddOrUpdateEvent = () => {
        if (!modalSlot || !modalVenueId) return;
        const selectedVenue = venue.find(
            (v) => v.id === parseInt(modalVenueId)
        );
        if (!selectedVenue) return;

        const startDate = modalSlot.start.toJSDate();
        const endDate = modalSlot.end.toJSDate();

        if (editingEventId) {
            setEvents((prev) =>
                prev.map((ev) =>
                    ev.id === editingEventId
                        ? {
                              ...ev,
                              start: startDate,
                              end: endDate,
                              venueId: selectedVenue.id,
                              title: `${selectedVenue.name} - ${staff.name}`,
                          }
                        : ev
                )
            );
        } else {
            setEvents((prev) => [
                ...prev,
                {
                    id: `${selectedVenue.id}-${Date.now()}`,
                    title: `${selectedVenue.name} - ${staff.name}`,
                    start: startDate,
                    end: endDate,
                    venueId: selectedVenue.id,
                },
            ]);
        }

        setShowModal(false);
    };

    const handleEditEvent = (ev) => {
        const startDate = DateTime.fromJSDate(ev.start);
        const endDate = DateTime.fromJSDate(ev.end);
        setModalSlot({ start: startDate, end: endDate });
        setInitialIsRange(!startDate.hasSame(endDate, "day"));
        setModalVenueId(ev.venueId);
        setEditingEventId(ev.id);
        setShowModal(true);
    };

    const handleDeleteEvent = (id) =>
        setEvents((prev) => prev.filter((ev) => ev.id !== id));
    const handleEventDrop = ({ event, start, end }) =>
        setEvents((prev) =>
            prev.map((ev) => (ev.id === event.id ? { ...ev, start, end } : ev))
        );
    const handleEventResize = ({ event, start, end }) =>
        setEvents((prev) =>
            prev.map((ev) => (ev.id === event.id ? { ...ev, start, end } : ev))
        );
    const eventStyleGetter = (event) => ({
        style: {
            backgroundColor: venueColors[event.venueId] || "#4F46E5",
            borderRadius: "4px",
            color: "white",
            border: "none",
            padding: "2px 4px",
        },
    });

    return (
        <MerchantLayout>
            <Head title="Penugasan Operator" />

            <Card className="min-h-screen flex flex-col gap-4">
                <CardHeader className="flex justify-between items-center">
                    <h1 className="font-bold text-lg">
                        Penugasan Operator: {staff.name}
                    </h1>
                    <Button
                        variant="light"
                        size="xs"
                        onClick={() => setEvents([])}
                    >
                        Hapus Semua Penugasan
                    </Button>
                </CardHeader>

                <CardBody className="flex flex-row gap-4 px-4">
                    <SidebarVenueFilter
                        venues={venue}
                        selectedVenues={selectedVenues}
                        onToggleVenue={toggleVenue}
                        venueColors={venueColors}
                    />
                    <CalendarPanel
                        localizer={localizer}
                        events={filteredEvents}
                        onSelectSlot={handleSelectSlot}
                        onEventDrop={handleEventDrop}
                        onEventResize={handleEventResize}
                        eventStyleGetter={eventStyleGetter}
                        toolbarComponent={(props) => (
                            <Toolbar
                                {...props}
                                availableViews={["month", "week", "day"]}
                            />
                        )}
                        monthComponents={{
                            dateHeader: (props) => (
                                <CustomDateHeader {...props} />
                            ),
                            dateCellWrapper: (props) => (
                                <DateCellWrapper {...props} />
                            ),
                        }}
                    />
                    <AssignmentList
                        events={filteredEvents}
                        onEditEvent={handleEditEvent}
                        onDeleteEvent={handleDeleteEvent}
                    />
                </CardBody>

                <CardFooter className="flex justify-end gap-2">
                    <Button
                        variant="light"
                        type="button"
                        onClick={() =>
                            router.get(route("merchant.staff.index"))
                        }
                    >
                        Kembali ke Staf
                    </Button>
                </CardFooter>
            </Card>

            <AssignmentModal
                show={showModal}
                onClose={() => setShowModal(false)}
                venues={venue}
                modalVenueId={modalVenueId}
                setModalVenueId={setModalVenueId}
                modalSlot={modalSlot}
                setModalSlot={setModalSlot}
                onSave={handleAddOrUpdateEvent}
                initialIsRange={initialIsRange} // pass ke modal
                title={
                    editingEventId
                        ? "Edit Penugasan Operator"
                        : "Tambahkan Penugasan Operator"
                }
            />
        </MerchantLayout>
    );
}
