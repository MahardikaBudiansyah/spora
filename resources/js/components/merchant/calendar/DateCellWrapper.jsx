import React from "react";
import { DateTime } from "luxon";

const DateCellWrapper = ({ value, children, selectedDate }) => {
    const isSameDay =
        selectedDate &&
        DateTime.fromJSDate(value).hasSame(
            DateTime.fromJSDate(selectedDate),
            "day"
        );

    return (
        <div className="w-full h-full relative group">
            {/* Background layer */}
            <div
                className={`
        absolute inset-0 transition-all duration-150
        ${
            isSameDay
                ? "bg-primary-500 border border-primary-600 z-99"
                : "group-hover:bg-primary-200"
        }
    `}
            />
            {/* Children tetap di atas */}
            <div className="relative z-10">{children}</div>
        </div>
    );
};

export default DateCellWrapper;
