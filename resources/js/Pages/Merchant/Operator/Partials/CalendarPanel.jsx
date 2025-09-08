import React, { useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import luxonPlugin from "@fullcalendar/luxon3";
import { DateTime } from "luxon";
import Tippy from "@tippyjs/react";
import idLocale from "@fullcalendar/core/locales/id";

export default function CalendarPanel({
    events,
    onSelectSlot,
    onEventDrop,
    onEventResize,
    onEventClick,
    venueColors,
    venues = [],
    shifts = [],
}) {
    const calendarRef = useRef(null);

    // Pastikan title selalu dihitung ulang dari venues & shifts terbaru
    const mappedEvents = events.map((ev) => {
        const venueObj = venues.find((v) => v.id === ev.venueId);
        const shiftObj = shifts.find((s) => s.id === ev.shiftId);
        const venueName = `${venueObj?.name ?? "Unknown"} - ${
            shiftObj?.name ?? "-"
        }`;

        return {
            id: ev.id,
            title: venueName,
            start: ev.start.toJSDate(), // FullCalendar butuh JS Date
            end: ev.end.toJSDate(),
            extendedProps: {
                venueId: ev.venueId,
                shiftId: ev.shiftId,
            },
            classNames: venueColors[ev.venueId],
        };
    });

    // Custom eventContent
    const renderEventContent = (arg) => {
        const viewType = arg.view.type; // dayGridMonth, timeGridWeek, timeGridDay
        const start = DateTime.fromJSDate(arg.event.start);
        const end = DateTime.fromJSDate(arg.event.end);

        // Deteksi shift melewati tengah malam
        const isOvernight = end < start;

        const bgColor =
            venueColors[arg.event.extendedProps.venueId] ||
            "bg-indigo-600 dark:bg-indigo-400";

        if (viewType === "dayGridMonth") {
            // Bulanan: cukup judul
            return (
                <Tippy content={arg.event.title} placement="top" delay={100}>
                    <div
                        className={`text-white rounded px-1.5 py-0.5 text-xs truncate ${bgColor}`}
                    >
                        {arg.event.title}
                    </div>
                </Tippy>
            );
        } else {
            // Mingguan / harian: tampil judul + jam
            return (
                <Tippy
                    content={`${arg.event.title} (${start.toFormat(
                        "HH:mm"
                    )} – ${end.toFormat("HH:mm")})`}
                    placement="top"
                    delay={100}
                >
                    <div
                        className={`text-white rounded px-1.5 py-0.5 text-xs transition duration-150 hover:opacity-90 hover:scale-105 ${bgColor}`}
                        style={{
                            borderLeft: isOvernight ? "2px dashed yellow" : "",
                        }}
                    >
                        <span className="font-bold">{arg.event.title}</span>
                        <br />
                        <span className="text-[10px] opacity-80">
                            {start.toFormat("HH:mm")} – {end.toFormat("HH:mm")}
                        </span>
                    </div>
                </Tippy>
            );
        }
    };

    return (
        <div className="flex-1">
            <FullCalendar
                ref={calendarRef}
                locale={idLocale}
                plugins={[
                    dayGridPlugin,
                    timeGridPlugin,
                    interactionPlugin,
                    luxonPlugin,
                ]}
                initialView="dayGridMonth"
                headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek,timeGridDay",
                }}
                slotLabelFormat={{
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false, // pakai 24 jam
                }}
                events={mappedEvents}
                editable
                selectable
                select={(selectionInfo) => {
                    let start = DateTime.fromJSDate(selectionInfo.start);
                    let end = DateTime.fromJSDate(selectionInfo.end);
                    if (selectionInfo.allDay) end = end.minus({ days: 1 });
                    const isRange = !start.hasSame(end, "day");
                    onSelectSlot({ start, end, isRange });
                }}
                eventDrop={(info) => {
                    const start = DateTime.fromJSDate(info.event.start);
                    const end = DateTime.fromJSDate(info.event.end);
                    onEventDrop({ event: info.event, start, end });
                }}
                eventResize={(info) => {
                    const start = DateTime.fromJSDate(info.event.start);
                    const end = DateTime.fromJSDate(info.event.end);
                    onEventResize({ event: info.event, start, end });
                }}
                eventContent={renderEventContent}
                eventClick={(info) => {
                    const start = DateTime.fromJSDate(info.event.start);
                    const end = DateTime.fromJSDate(info.event.end);

                    onEventClick?.({
                        id: Number(info.event.id),
                        start,
                        end,
                        venueId: info.event.extendedProps.venueId,
                        shiftId: info.event.extendedProps.shiftId,
                        venueName: info.event.title,
                    });
                }}
                height={600}
            />
        </div>
    );
}
