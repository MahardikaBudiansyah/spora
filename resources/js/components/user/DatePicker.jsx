import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
    formatDayShort,
    parseDate,
    toISODate,
    formatWithPattern,
} from "@/utils/date";
import Button from "@/components/common/Button";
import DatePickerInput from "@/components/Common/DatePickerInput";

function DatePicker({ selected, onChange }) {
    const [startDate, setStartDate] = useState(
        calculateStartDate(selected ?? parseDate(new Date()))
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
    const today = parseDate(new Date()).startOf("day");
    const isPrevWeekDisabled = startDate <= today.startOf("week");

    const handleDateClick = (day) => {
        if (day < today) return;

        if (onChange) onChange(day);
        setStartDate(calculateStartDate(day));
    };

    const goToPreviousWeek = () => {
        const prevStart = startDate.minus({ days: daysToShow });
        if (prevStart < today.startOf("week")) return;

        setStartDate(prevStart);
        if (onChange) onChange(selected.minus({ days: daysToShow }));
    };

    const goToNextWeek = () => {
        setStartDate(startDate.plus({ days: daysToShow }));
        if (onChange) onChange(selected.plus({ days: daysToShow }));
    };

    const handleInputChange = (date) => {
        if (!date) return;
        const dt = parseDate(date); // pakai utils
        const todayDt = parseDate(new Date()).startOf("day");

        if (dt && dt.isValid && dt >= todayDt) {
            if (onChange) onChange(dt);
            setStartDate(calculateStartDate(dt));
        }
    };

    useEffect(() => {
        if (selected) {
            setStartDate(calculateStartDate(selected));
        }
    }, [selected]);

    return (
        <div className="max-w-full flex flex-row justify-between md:justify-center gap-8 md:gap-16 items-center bg-white dark:bg-secondary-800 px-6 py-4 rounded-md">
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
                        selected && toISODate(selected) === toISODate(day);

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
                                {formatDayShort(day)} {/* pakai utils */}
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
                    label=""
                    value={
                        selected
                            ? formatWithPattern(selected, "dd/MM/yyyy")
                            : ""
                    }
                    onChange={handleInputChange}
                />
            </div>
        </div>
    );
}

export default DatePicker;
