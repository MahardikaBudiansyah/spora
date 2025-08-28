import React, { useState, useEffect } from "react";
import { Calendar } from "react-big-calendar";
import localizer from "@/utils/localizer";
import Toolbar from "@/components/merchant/calendar/Toolbar";
import CustomDateHeader from "@/components/merchant/calendar/CustomDateHeader";
import calendarFormats from "@/utils/CalendarFormat";
import DateCellWrapper from "@/components/merchant/Calendar/DateCellWrapper";
import "react-big-calendar/lib/css/react-big-calendar.css";

const CalendarComponent = ({ events = [], onDateSelect }) => {
    const [selectedDate, setSelectedDate] = useState(null);

    useEffect(() => {
        if (selectedDate) {
            console.log(
                "Fetch slot untuk:",
                selectedDate.toLocaleString(),
                selectedDate.toISOString()
            );
        }
    }, [selectedDate]);

    return (
        <div className="">
            <Calendar
                localizer={localizer}
                events={[]}
                startAccessor="start"
                endAccessor="end"
                defaultView="month"
                views={["month"]}
                culture="id"
                selectable
                longPressThreshold={1}
                onSelectSlot={(slotInfo) => {
                    const clickedDate = slotInfo.start;
                    setSelectedDate(clickedDate);
                    if (onDateSelect) {
                        onDateSelect(clickedDate); // kirim ke parent
                    }
                }}
                z
                components={{
                    toolbar: (props) => (
                        <Toolbar {...props} availableViews={["month"]} />
                    ),
                    month: {
                        dateHeader: (props) => (
                            <CustomDateHeader
                                {...props}
                                selectedDate={selectedDate}
                            />
                        ),
                        dateCellWrapper: (props) => (
                            <DateCellWrapper
                                {...props}
                                selectedDate={selectedDate}
                            />
                        ),
                    },
                }}
                formats={calendarFormats}
                style={{ height: 350 }}
                className="custom-calendar cursor-pointer"
            />
        </div>
    );
};

export default CalendarComponent;
