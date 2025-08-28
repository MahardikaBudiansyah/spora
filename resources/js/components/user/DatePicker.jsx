import React, { useState, useEffect } from "react";
import { DateTime } from "luxon";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatDayShort } from "@/utils/date";
import Button from "@/components/common/Button";
import DatePickerInput from "@/components/Common/DatePickerInput";

function DatePicker({ selected, onChange }) {
    const [selectedDate, setSelectedDate] = useState(
        DateTime.now().setLocale("id")
    );
    const [startDate, setStartDate] = useState(
        calculateStartDate(DateTime.now().setLocale("id"))
    );
    const daysToShow = 7;

    function calculateStartDate(date) {
        return date.startOf("week"); // default Senin
    }

    const getDaysToShow = (start) => {
        const nextDays = [];
        for (let i = 0; i < daysToShow; i++) {
            nextDays.push(start.plus({ days: i }));
        }
        return nextDays;
    };

    const days = getDaysToShow(startDate);
    const today = DateTime.now().startOf("day");
    const isPrevWeekDisabled = startDate <= today.startOf("week");

    const handleDateClick = (day) => {
        if (day < today) return; // ignore klik tanggal sebelum hari ini

        setSelectedDate(day);
        setStartDate(calculateStartDate(day));
        if (onChange) onChange(day);
    };

    const goToPreviousWeek = () => {
        const prevStart = startDate.minus({ days: daysToShow });
        if (prevStart < today.startOf("week")) {
            // sudah di minggu ini atau lebih awal, stop
            return;
        }
        setStartDate(prevStart);
        setSelectedDate(selectedDate.minus({ days: daysToShow }));
    };

    const goToNextWeek = () => {
        setStartDate(startDate.plus({ days: daysToShow }));
        setSelectedDate(selectedDate.plus({ days: daysToShow }));
    };

    const handleInputChange = (date) => {
        if (!date) return;

        // date sudah berupa objek Date dari react-calendar
        const dt = DateTime.fromJSDate(date).setLocale("id");
        const today = DateTime.now().startOf("day");

        if (dt.isValid && dt >= today) {
            setSelectedDate(dt);
            setStartDate(calculateStartDate(dt));
            console.log("Tanggal dari input:", dt.toISODate());
            if (onChange) onChange(dt);
            else {
                // ignore atau reset ke today kalau mau
                setSelectedDate(today);
                setStartDate(calculateStartDate(today));
            }
        }
    };

    useEffect(() => {
        const now = DateTime.now().setLocale("id");
        setSelectedDate(now);
        setStartDate(calculateStartDate(now));
        // if (onChange) onChange(now);
    }, []);

    return (
        <div className="max-w-full flex flex-row justify-between md:justify-center gap-8 md:gap-16 items-center  bg-white dark:bg-secondary-800 px-6 py-4 rounded-md">
            <div className="flex flex-row gap-2 overflow-x-auto scrollbar-hide">
                <Button
                    onClick={goToPreviousWeek}
                    variant="primary"
                    className="p-1 rounded-md focus:ring-0"
                    disabled={isPrevWeekDisabled}
                >
                    <ChevronLeft className="w-4 h-4" />
                </Button>

                {days.map((day) => {
                    const isDisabled = day < today;
                    const isSelected =
                        selectedDate.toISODate() === day.toISODate();

                    return (
                        <div
                            key={day.toMillis()}
                            className={`
                flex flex-col items-center text-center w-16 h-14 px-4 py-2 rounded-md
                ${
                    isSelected
                        ? "bg-primary-700 dark:bg-primary-800 text-white"
                        : isDisabled
                        ? "text-secondary-400 dark:text-secondary-600 cursor-not-allowed"
                        : "hover:bg-primary-100 dark:hover:bg-primary-700 cursor-pointer"
                }
            `}
                            onClick={() => !isDisabled && handleDateClick(day)}
                            aria-disabled={isDisabled}
                        >
                            <div className="text-xs font-semibold">
                                {formatDayShort(day)}
                            </div>
                        </div>
                    );
                })}

                <Button
                    onClick={goToNextWeek}
                    variant="primary"
                    className="p-1 rounded-md focus:ring-0"
                >
                    <ChevronRight className="w-4 h-4" />
                </Button>
            </div>
            <div className="border-l-2 pl-3 border-l-secondary-200 dark:border-l-secondary-600">
                <DatePickerInput
                    id="datePickerInput"
                    label=""
                    value={selectedDate.toISODate()}
                    onChange={handleInputChange}
                />
            </div>
        </div>
    );
}

export default DatePicker;
