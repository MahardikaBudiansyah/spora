import React from "react";
import { DateTime } from "luxon";

const CustomDateHeader = ({ date, selectedDate }) => {
    const dt = DateTime.fromJSDate(date).setLocale("id");
    const dateLabel = dt.toFormat("d"); // hanya angka tanggal

    const today = DateTime.local().startOf("day");
    const current = dt.startOf("day");

    const isToday = current.hasSame(today, "day");
    const isSelected =
        selectedDate &&
        current.hasSame(
            DateTime.fromJSDate(selectedDate).startOf("day"),
            "day"
        );

    return (
        <div className="text-center items-center text-xs transition-all duration-150">
            <div className="font-medium">
                {/* Bisa isi nama hari jika mau */}
            </div>

            <div
                className={`
                    text-xl transition-all duration-150
                    ${isSelected ? "text-white" : ""}
                    ${isToday ? "font-bold text-primary-600" : ""}
                    group-hover:text-white
                `}
            >
                {dateLabel}
            </div>
        </div>
    );
};

export default CustomDateHeader;
