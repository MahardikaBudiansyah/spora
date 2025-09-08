// resources/js/components/merchant/calendar/FieldCalendarPanel.jsx
import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import luxonPlugin from "@fullcalendar/luxon3";
import idLocale from "@fullcalendar/core/locales/id";
import Tippy from "@tippyjs/react";

const FieldCalendarPanel = ({ events = [], onDateSelect, onRangeChange }) => {
    return (
        <div className="w-full">
            <FullCalendar
                locale={idLocale}
                plugins={[
                    dayGridPlugin,
                    // timeGridPlugin,
                    interactionPlugin,
                    luxonPlugin,
                ]}
                initialView="dayGridMonth"
                headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    // right: "dayGridMonth,timeGridWeek,timeGridDay",
                    right: "dayGridMonth",
                }}
                dayCellClassNames={(arg) => {
                    if (arg.isOther) {
                        return [
                            "bg-secondary-50",
                            "text-secondary-400",
                            "dark:bg-secondary-800",
                        ]; // style tanggal luar bulan
                    }
                }}
                selectable={true}
                events={events}
                eventContent={(arg) => {
                    const view = arg.view.currentStart; // tanggal mulai view (awal bulan)
                    const month = view.getMonth(); // bulan aktif
                    const eventMonth = arg.event.start.getMonth();

                    // kalau bukan bulan yang sama, jangan render
                    if (eventMonth !== month) return null;

                    const { booked, event, maintenance, available } =
                        arg.event.extendedProps;
                    return (
                        <Tippy
                            content={
                                <div className="text-sm space-y-1">
                                    <div>Booked: {booked}</div>
                                    <div>Event: {event}</div>
                                    <div>Pemeliharaan: {maintenance}</div>
                                    <div>Tersedia: {available}</div>
                                </div>
                            }
                        >
                            <div className="text-[10px] leading-tight space-y-0.5 cursor-pointer">
                                <div className="bg-rose-100 text-rose-700 px-1 rounded-sm">
                                    Booked: {booked}
                                </div>
                                <div className="bg-yellow-100 text-yellow-700 px-1 rounded-sm">
                                    Event: {event}
                                </div>
                                <div className="bg-sky-100 text-sky-700 px-1 rounded-sm">
                                    Pemeliharaan: {maintenance}
                                </div>
                                <div className="bg-teal-100 text-teal-700 px-1 rounded-sm">
                                    Tersedia: {available}
                                </div>
                            </div>
                        </Tippy>
                    );
                }}
                dateClick={(info) => {
                    if (onDateSelect) onDateSelect(info.date);
                }}
                datesSet={(info) => {
                    if (onRangeChange)
                        onRangeChange(
                            info.startStr,
                            info.endStr,
                            info.view.type
                        );
                }}
                eventDidMount={(info) => {
                    info.el.classList.add("cursor-pointer");
                }}
                height={700}
            />
        </div>
    );
};

export default FieldCalendarPanel;
