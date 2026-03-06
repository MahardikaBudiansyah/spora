import React, { memo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import luxonPlugin from "@fullcalendar/luxon3";
import idLocale from "@fullcalendar/core/locales/id";
import Tippy from "@tippyjs/react";

const CourtCalendarPanel = memo(
    ({ events = [], onDateSelect, onRangeChange }) => {
        const getDayTypeColor = (type) => {
            switch (type?.toLowerCase()) {
                case "weekend":
                    return "text-amber-700 bg-amber-100 border-amber-300 dark:bg-amber-900/30 dark:text-amber-400";
                case "holiday":
                    return "text-red-700 bg-red-100 border-red-300 dark:bg-red-900/30 dark:text-red-400";
                default: // Weekday
                    return "text-slate-600 bg-slate-100 border-slate-300 dark:bg-slate-800 dark:text-slate-400";
            }
        };

        return (
            <div className="w-full calendar-container">
                <FullCalendar
                    locale={idLocale}
                    plugins={[dayGridPlugin, interactionPlugin, luxonPlugin]}
                    initialView="dayGridMonth"
                    headerToolbar={{
                        left: "prev,next today",
                        center: "title",
                        right: "dayGridMonth",
                    }}
                    buttonText={{
                        today: "Hari Ini",
                        month: "Bulan",
                        week: "Minggu",
                        day: "Hari",
                    }}
                    eventClassNames="w-full border-none bg-transparent hover:bg-transparent shadow-none"
                    dayCellClassNames={(arg) => {
                        const classes = [];
                        if (arg.isOther)
                            classes.push(
                                "bg-secondary-50/50 text-secondary-400 opacity-50"
                            );
                        if (arg.date.getDay() === 0)
                            classes.push("text-red-500 font-medium");
                        return classes;
                    }}
                    selectable={true}
                    events={events}
                    eventContent={(arg) => {
                        const {
                            booked,
                            event,
                            maintenance,
                            available,
                            day_type,
                        } = arg.event.extendedProps;

                        return (
                            <Tippy
                                theme="light"
                                animation="shift-away"
                                content={
                                    <div className="p-2 text-xs min-w-[120px]">
                                        <p className="font-bold border-b pb-1 mb-1 uppercase text-[10px] flex justify-between">
                                            <span>Ringkasan</span>
                                            <span className="text-secondary-500">
                                                {day_type || "weekday"}
                                            </span>
                                        </p>
                                        <div className="space-y-1">
                                            <div className="flex justify-between">
                                                <span>Dipesan:</span>
                                                <span className="font-semibold text-rose-600">
                                                    {booked || 0}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Event:</span>
                                                <span className="font-semibold text-yellow-600">
                                                    {event || 0}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Maint:</span>
                                                <span className="font-semibold text-sky-600">
                                                    {maintenance || 0}
                                                </span>
                                            </div>
                                            <div className="flex justify-between border-t pt-1 mt-1 font-bold text-teal-600">
                                                <span>Tersedia:</span>
                                                <span>{available || 0}</span>
                                            </div>
                                        </div>
                                    </div>
                                }
                            >
                                <div className="flex flex-col gap-1 w-full p-0.5">
                                    <div
                                        className={`text-[8px] px-1.5 py-0.5 uppercase font-bold border rounded-sm truncate text-center shadow-sm ${getDayTypeColor(
                                            day_type
                                        )}`}
                                    >
                                        {day_type || "weekday"}
                                    </div>

                                    <div
                                        className={`px-1.5 py-1 rounded-md text-[10px] flex justify-between items-center font-bold border ${
                                            available === 0
                                                ? "bg-rose-50 text-rose-700 border-rose-200"
                                                : "bg-teal-50 text-teal-700 border-teal-200"
                                        }`}
                                    >
                                        <span>Slot</span>
                                        <span>{available}</span>
                                    </div>

                                    <div className="flex gap-1 px-1">
                                        {booked > 0 && (
                                            <span
                                                className="h-1 flex-1 bg-rose-400 rounded-full"
                                                title="Dipesan"
                                            />
                                        )}
                                        {event > 0 && (
                                            <span
                                                className="h-1 flex-1 bg-yellow-400 rounded-full"
                                                title="Event"
                                            />
                                        )}
                                        {maintenance > 0 && (
                                            <span
                                                className="h-1 flex-1 bg-sky-500 rounded-full"
                                                title="Maintenance"
                                            />
                                        )}
                                    </div>
                                </div>
                            </Tippy>
                        );
                    }}
                    dateClick={(info) => {
                        document
                            .querySelectorAll(".fc-daygrid-day")
                            .forEach((el) =>
                                el.classList.remove("selected-day")
                            );
                        info.dayEl.classList.add("selected-day");
                        if (onDateSelect) onDateSelect(info.dateStr);
                    }}
                    datesSet={(info) => {
                        if (onRangeChange)
                            onRangeChange(
                                info.startStr,
                                info.endStr,
                                info.view.type
                            );
                    }}
                    height="auto"
                />
            </div>
        );
    }
);

CourtCalendarPanel.displayName = "CourtCalendarPanel";

export default CourtCalendarPanel;
