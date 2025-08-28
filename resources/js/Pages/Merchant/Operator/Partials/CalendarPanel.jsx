import React from "react";
import { Calendar } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";

const DnDCalendar = withDragAndDrop(Calendar);

export default function CalendarPanel({
    localizer,
    events,
    onSelectSlot,
    onEventDrop,
    onEventResize,
    eventStyleGetter,
    toolbarComponent,
    monthComponents,
}) {
    return (
        <div className="flex-1">
            <DnDCalendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                defaultView="month"
                views={["month", "week", "day"]}
                culture="id"
                selectable
                resizable
                onSelectSlot={onSelectSlot}
                onEventDrop={onEventDrop}
                onEventResize={onEventResize}
                draggableAccessor={() => true}
                eventPropGetter={eventStyleGetter}
                components={{
                    toolbar: toolbarComponent,
                    month: monthComponents,
                }}
                style={{ height: 600 }}
            />
        </div>
    );
}
